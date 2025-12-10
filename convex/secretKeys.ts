import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Insert multiple secret keys
export const insertMany = mutation({
  args: {
    userId: v.id("users"),
    keys: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { success: false, message: "No active room!" };
    }

    let insertedCount = 0;
    for (const key of args.keys) {
      const normalizedKey = key.toLowerCase().trim();

      // Check if key already exists for this room
      const existing = await ctx.db
        .query("secretKeys")
        .withIndex("by_secretKey_roomId", (q) =>
          q.eq("secretKey", normalizedKey).eq("roomId", activeMetadata._id)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("secretKeys", {
          adminId: args.userId,
          roomId: activeMetadata._id,
          secretKey: normalizedKey,
          firstRoundMale: false,
          firstRoundFemale: false,
          secondRoundMale: false,
          secondRoundFemale: false,
        });
        insertedCount++;
      }
    }

    return {
      success: true,
      message: `${insertedCount} secret keys inserted successfully.`,
    };
  },
});

// Get all secret keys for active room
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { success: false, data: [], message: "No active room!" };
    }

    const secretKeys = await ctx.db
      .query("secretKeys")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    return {
      success: true,
      data: secretKeys.map((k) => k.secretKey),
    };
  },
});

// Validate a secret key
export const validate = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { isValid: false };
    }

    const normalizedKey = args.key.toLowerCase().trim();

    const secretKeyRecords = await ctx.db
      .query("secretKeys")
      .withIndex("by_secretKey", (q) => q.eq("secretKey", normalizedKey))
      .collect();

    const secretKeyRecord = secretKeyRecords.find(
      (k) => k.roomId === activeMetadata._id
    );

    if (!secretKeyRecord) {
      return { isValid: false };
    }

    return {
      isValid: true,
      maleVoteFirstRound: secretKeyRecord.firstRoundMale,
      femaleVoteFirstRound: secretKeyRecord.firstRoundFemale,
      maleVoteSecondRound: secretKeyRecord.secondRoundMale,
      femaleVoteSecondRound: secretKeyRecord.secondRoundFemale,
    };
  },
});

// Add special secret key
export const addSpecialKey = mutation({
  args: {
    userId: v.id("users"),
    specialSecretKey: v.string(),
  },
  handler: async (ctx, args) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      throw new Error("No active room!");
    }

    const normalizedKey = args.specialSecretKey.toLowerCase().trim();

    // Check if key already exists
    const existing = await ctx.db
      .query("specialSecretKeys")
      .withIndex("by_specialSecretKey_roomId", (q) =>
        q.eq("specialSecretKey", normalizedKey).eq("roomId", activeMetadata._id)
      )
      .first();

    if (existing) {
      throw new Error("This secret key already exists");
    }

    const id = await ctx.db.insert("specialSecretKeys", {
      adminId: args.userId,
      roomId: activeMetadata._id,
      specialSecretKey: normalizedKey,
      used: false,
      ratings: [],
    });

    return await ctx.db.get(id);
  },
});

// Get all special secret keys for active room
export const getAllSpecial = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      return { success: false, data: [], message: "No active room!" };
    }

    const specialKeys = await ctx.db
      .query("specialSecretKeys")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    return {
      success: true,
      data: specialKeys.map((k) => k.specialSecretKey),
    };
  },
});
