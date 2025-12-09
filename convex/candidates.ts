import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all candidates for active room
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return [];
    }

    return await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();
  },
});

// Get all candidates for a specific room
export const getByRoomId = query({
  args: { roomId: v.id("metadata") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

// Get candidate by ID
export const getById = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get candidates with stats (votes + ratings) for active room
export const getWithStats = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return [];
    }

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
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
      };
    });

    // Sort by combinedScore descending
    return candidatesWithStats.sort((a, b) => b.combinedScore - a.combinedScore);
  },
});

// Get candidates with stats for a specific room (for archives)
export const getWithStatsByRoomId = query({
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
      };
    });

    // Sort by combinedScore descending
    return candidatesWithStats.sort((a, b) => b.combinedScore - a.combinedScore);
  },
});

// Get top candidates (King, Queen, Prince, Princess) for active room
export const getTopCandidates = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { king: null, queen: null, prince: null, princess: null };
    }

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
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
      };
    });

    // Sort by combinedScore descending
    const sorted = candidatesWithStats.sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    const males = sorted.filter((c) => c.gender === "male");
    const females = sorted.filter((c) => c.gender === "female");

    return {
      king: males[0] ?? null,
      prince: males[1] ?? null,
      queen: females[0] ?? null,
      princess: females[1] ?? null,
    };
  },
});

// Get top candidates for a specific room (for archives)
export const getTopCandidatesByRoomId = query({
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
      };
    });

    const sorted = candidatesWithStats.sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    const males = sorted.filter((c) => c.gender === "male");
    const females = sorted.filter((c) => c.gender === "female");

    return {
      king: males[0] ?? null,
      prince: males[1] ?? null,
      queen: females[0] ?? null,
      princess: females[1] ?? null,
    };
  },
});

// Get candidates for second round (top N males and females)
export const getForSecondRound = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { topMales: [], topFemales: [], eligibleCandidates: [] };
    }

    const { maleForSecondRound, femaleForSecondRound } = activeMetadata;

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
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
      };
    });

    const sorted = candidatesWithStats.sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    const males = sorted.filter((c) => c.gender === "male");
    const females = sorted.filter((c) => c.gender === "female");

    const topMales = males.slice(0, maleForSecondRound);
    const topFemales = females.slice(0, femaleForSecondRound);

    const eligibleCandidates = [
      ...topMales.map((c) => c._id),
      ...topFemales.map((c) => c._id),
    ];

    return { topMales, topFemales, eligibleCandidates };
  },
});

// Get candidates for judge voting
export const getForJudge = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { topMales: [], topFemales: [], eligibleCandidates: [] };
    }

    const { maleForSecondRound, femaleForSecondRound } = activeMetadata;

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const votes = await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const voteMap = new Map(votes.map((v) => [v.candidateId, v]));

    const candidatesWithStats = candidates.map((candidate) => {
      const vote = voteMap.get(candidate._id);
      const totalVotes = vote?.totalVotes ?? 0;
      const totalRating = vote?.totalRating ?? 0;
      return {
        id: candidate._id,
        name: candidate.name,
        intro: candidate.intro,
        gender: candidate.gender,
        major: candidate.major,
        profileImage: candidate.profileImage,
        carouselImages: candidate.carouselImages,
        height: candidate.height,
        age: candidate.age,
        weight: candidate.weight,
        hobbies: candidate.hobbies,
        totalVotes,
        totalRating,
        combinedScore: totalVotes + totalRating,
      };
    });

    const sorted = candidatesWithStats.sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    const males = sorted.filter((c) => c.gender === "male");
    const females = sorted.filter((c) => c.gender === "female");

    const topMales = males.slice(0, maleForSecondRound);
    const topFemales = females.slice(0, femaleForSecondRound);

    const eligibleCandidates = [
      ...topMales.map((c) => c.id),
      ...topFemales.map((c) => c.id),
    ];

    return { topMales, topFemales, eligibleCandidates };
  },
});

// Get all candidate images for active room
export const getAllImages = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return [];
    }

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const allImages = candidates.flatMap((c) => c.carouselImages);
    return allImages;
  },
});

// Create candidate
export const create = mutation({
  args: {
    name: v.string(),
    intro: v.string(),
    gender: v.union(v.literal("male"), v.literal("female")),
    major: v.string(),
    profileImage: v.string(),
    carouselImages: v.array(v.string()),
    height: v.number(),
    age: v.number(),
    weight: v.number(),
    hobbies: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      throw new Error("No active room!");
    }

    const id = await ctx.db.insert("candidates", {
      roomId: activeMetadata._id,
      name: args.name,
      intro: args.intro,
      gender: args.gender,
      major: args.major,
      profileImage: args.profileImage || "/user.png",
      carouselImages: args.carouselImages,
      height: args.height,
      age: args.age,
      weight: args.weight,
      hobbies: args.hobbies,
    });

    return await ctx.db.get(id);
  },
});

// Update candidate
export const update = mutation({
  args: {
    id: v.id("candidates"),
    name: v.string(),
    intro: v.string(),
    gender: v.union(v.literal("male"), v.literal("female")),
    major: v.string(),
    profileImage: v.string(),
    carouselImages: v.array(v.string()),
    height: v.number(),
    age: v.number(),
    weight: v.number(),
    hobbies: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Candidate not found");
    }

    await ctx.db.patch(id, {
      name: data.name,
      intro: data.intro,
      gender: data.gender,
      major: data.major,
      profileImage: data.profileImage || "/user.png",
      carouselImages: data.carouselImages,
      height: data.height,
      age: data.age,
      weight: data.weight,
      hobbies: data.hobbies,
    });

    return await ctx.db.get(id);
  },
});

// Delete candidate
export const remove = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    // Also delete associated votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_candidateId", (q) => q.eq("candidateId", args.id))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Remove image from candidate
export const removeImage = mutation({
  args: {
    candidateId: v.id("candidates"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    // Check if it's the profile image
    if (candidate.profileImage === args.imageUrl) {
      await ctx.db.patch(args.candidateId, { profileImage: "" });
    }

    // Remove from carousel images
    if (candidate.carouselImages.includes(args.imageUrl)) {
      const newCarouselImages = candidate.carouselImages.filter(
        (img) => img !== args.imageUrl
      );
      await ctx.db.patch(args.candidateId, { carouselImages: newCarouselImages });
    }

    return { success: true };
  },
});
