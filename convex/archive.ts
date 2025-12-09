import { v } from "convex/values";
import { query } from "./_generated/server";

// Get all archived (non-active) rooms
export const getArchiveMetadatas = query({
  args: {},
  handler: async (ctx) => {
    const allMetadata = await ctx.db.query("metadata").collect();
    const archived = allMetadata.filter((m) => !m.active);

    if (archived.length === 0) {
      return {
        success: false,
        message: "No archived metadata found.",
        data: [],
      };
    }

    return {
      success: true,
      data: archived,
    };
  },
});

// Get archived room by ID
export const getArchiveMetadataById = query({
  args: { id: v.id("metadata") },
  handler: async (ctx, args) => {
    const metadata = await ctx.db.get(args.id);

    if (!metadata) {
      return {
        success: false,
        message: "Metadata not found.",
        data: null,
      };
    }

    return {
      success: true,
      data: metadata,
    };
  },
});

// Get candidates with stats and titles for an archived room
export const getCandidatesWithStatsAndTitles = query({
  args: { roomId: v.id("metadata") },
  handler: async (ctx, args) => {
    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();

    const voteMap = new Map(votes.map((v) => [v.candidateId, v]));

    const candidatesWithStats = candidates.map((candidate) => {
      const vote = voteMap.get(candidate._id);
      const totalVotes = vote?.totalVotes ?? 0;
      const totalRating = vote?.totalRating ?? 0;
      return {
        ...candidate,
        id: candidate._id,
        totalVotes,
        totalRating,
        combinedScore: totalVotes + totalRating,
        title: null as string | null,
      };
    });

    // Sort by combinedScore
    const sorted = candidatesWithStats.sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    // Separate by gender
    const males = sorted.filter((c) => c.gender === "male");
    const females = sorted.filter((c) => c.gender === "female");

    // Assign titles
    const maleTitles = ["King", "Prince"];
    const femaleTitles = ["Queen", "Princess"];

    const titledMales = males.map((candidate, index) => ({
      ...candidate,
      title: maleTitles[index] || null,
    }));

    const titledFemales = females.map((candidate, index) => ({
      ...candidate,
      title: femaleTitles[index] || null,
    }));

    const allCandidatesWithTitles = [...titledMales, ...titledFemales];

    return {
      success: true,
      data: allCandidatesWithTitles,
    };
  },
});

// Get archived candidate by ID with title
export const getArchivedCandidateById = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.candidateId);

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found.",
        data: null,
      };
    }

    // Get room metadata
    const metadata = await ctx.db.get(candidate.roomId);
    const room = metadata?.title || null;

    // Get all candidates for this room to determine title
    const allCandidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", candidate.roomId))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", candidate.roomId))
      .collect();

    const voteMap = new Map(votes.map((v) => [v.candidateId, v]));

    const candidatesWithStats = allCandidates.map((c) => {
      const vote = voteMap.get(c._id);
      const totalVotes = vote?.totalVotes ?? 0;
      const totalRating = vote?.totalRating ?? 0;
      return {
        id: c._id,
        gender: c.gender,
        combinedScore: totalVotes + totalRating,
      };
    });

    const sorted = candidatesWithStats.sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    const males = sorted.filter((c) => c.gender === "male");
    const females = sorted.filter((c) => c.gender === "female");

    // Determine title
    let title: string | null = null;
    if (males[0]?.id === args.candidateId) {
      title = "King";
    } else if (males[1]?.id === args.candidateId) {
      title = "Prince";
    } else if (females[0]?.id === args.candidateId) {
      title = "Queen";
    } else if (females[1]?.id === args.candidateId) {
      title = "Princess";
    }

    return {
      success: true,
      data: {
        id: candidate._id,
        name: candidate.name,
        title,
        room,
        intro: candidate.intro,
        gender: candidate.gender,
        major: candidate.major,
        profileImage: candidate.profileImage,
        carouselImages: candidate.carouselImages,
        height: candidate.height,
        age: candidate.age,
        weight: candidate.weight,
        hobbies: candidate.hobbies,
      },
    };
  },
});
