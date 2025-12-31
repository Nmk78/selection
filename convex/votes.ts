import { v } from "convex/values";
import { mutation, query } from "./_generated/server";



//////////////////////
// 1️⃣ Normal Votes (Student Votes) — 50%

// Each student vote counts as 1 point in the first round.

// 2️⃣ Judge Ratings — 50%


///////////////////
// Vote for a candidate
export const voteForCandidate = mutation({
  args: {
    candidateId: v.id("candidates"),
    secretKey: v.string(),
  },
  handler: async (ctx, args) => {
    // Get active room
    const currentRoom = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!currentRoom) {
      return { success: false, message: "No active round found." };
    }

    const { round } = currentRoom;

    // if (round !== "first" && round !== "second") {
    if (round !== "first") {
      return { success: false, message: "Voting is closed." };
    }

    const normalizedKey = args.secretKey.toLowerCase().trim();

    // Find secret key
    const secretKeyRecords = await ctx.db
      .query("secretKeys")
      .withIndex("by_secretKey", (q) => q.eq("secretKey", normalizedKey))
      .collect();

    const secretKeyRecord = secretKeyRecords.find(
      (k) => k.roomId === currentRoom._id
    );

    if (!secretKeyRecord) {
      return { success: false, message: "Invalid secret key." };
    }

    // Get candidate
    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate) {
      return { success: false, message: "Invalid candidate." };
    }

    const { gender } = candidate;

    // Check if already voted for this gender in this round
    if (
      (round === "first" && gender === "male" && secretKeyRecord.firstRoundMale) ||
      (round === "first" && gender === "female" && secretKeyRecord.firstRoundFemale) 
      // ||
      // (round === "second" && gender === "male" && secretKeyRecord.secondRoundMale) ||
      // (round === "second" && gender === "female" && secretKeyRecord.secondRoundFemale)
    ) {
      return {
        success: false,
        message: "Key was already used for this gender in this round!",
      };
    }

    // Find or create vote record
    const existingVotes = await ctx.db
      .query("votes")
      .withIndex("by_roomId_candidateId", (q) =>
        q.eq("roomId", currentRoom._id).eq("candidateId", args.candidateId)
      )
      .collect();

    const existingVote = existingVotes[0];

    if (existingVote) {
      // Increment vote
      await ctx.db.patch(existingVote._id, {
        totalVotes: existingVote.totalVotes + 1,
      });
    } else {
      // Create new vote
      await ctx.db.insert("votes", {
        roomId: currentRoom._id,
        candidateId: args.candidateId,
        totalVotes: 1,
        totalRating: 0,
      });
    }

    // Update secret key voting status based on round
    const updateData: {
      firstRoundMale?: boolean;
      firstRoundFemale?: boolean;
      secondRoundMale?: boolean;
      secondRoundFemale?: boolean;
    } = {};

    if (round === "first") {
      if (gender === "male") {
        updateData.firstRoundMale = true;
      } else {
        updateData.firstRoundFemale = true;
      }
    } else if (round === "second") {
      if (gender === "male") {
        updateData.secondRoundMale = true;
      } else {
        updateData.secondRoundFemale = true;
      }
    }

    await ctx.db.patch(secretKeyRecord._id, updateData);

    return { success: true, message: "Vote successfully recorded." };
  },
});

// Add ratings from judge
export const addRatings = mutation({
  args: {
    ratings: v.array(
      v.object({
        candidateId: v.id("candidates"),
        rating: v.number(),
      })
    ),
    secretKey: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedKey = args.secretKey.toLowerCase().trim();

    // Get active room
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { success: false, message: "No active room!" };
    }

    // Find special secret key
    const specialKeyRecords = await ctx.db
      .query("specialSecretKeys")
      .withIndex("by_specialSecretKey", (q) => q.eq("specialSecretKey", normalizedKey))
      .collect();

    const secretKeyRecord = specialKeyRecords.find(
      (k) => k.roomId === activeMetadata._id
    );

    if (!secretKeyRecord) {
      return { success: false, message: "Invalid key." };
    }

    if (secretKeyRecord.used) {
      return { success: false, message: "This key was already used." };
    }

    // Validate: Only allow up to 5 candidates with 0 ratings
    const zeroRatings = args.ratings.filter((r) => r.rating <= 0);
    const zeroRatingCount = zeroRatings.length;

    if (zeroRatingCount > 5) {
      return {
        success: false,
        message: "Please rate all categories.",
      };
    }

    // Count total special keys for scaling
    const totalSpecialKeys = await ctx.db
      .query("specialSecretKeys")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const keyCount = totalSpecialKeys.length;

    // Process ratings
    for (const { candidateId, rating } of args.ratings) {
      if (rating <= 0) continue;

      const existingVotes = await ctx.db
        .query("votes")
        .withIndex("by_roomId_candidateId", (q) =>
          q.eq("roomId", activeMetadata._id).eq("candidateId", candidateId)
        )
        .collect();

      const existingVote = existingVotes[0];
      const scaledRating = Math.round(rating / (keyCount / 2 || 1));

      if (existingVote) {
        await ctx.db.patch(existingVote._id, {
          totalRating: existingVote.totalRating + scaledRating,
        });
      } else {
        await ctx.db.insert("votes", {
          roomId: activeMetadata._id,
          candidateId,
          totalVotes: 0,
          totalRating: scaledRating,
        });
      }
    }

    // Mark key as used
    await ctx.db.patch(secretKeyRecord._id, {
      used: true,
      ratings: args.ratings,
    });

    return { success: true, message: "Ratings successfully added!" };
  },
});

// Get votes for a room
export const getByRoomId = query({
  args: { roomId: v.id("metadata") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});
