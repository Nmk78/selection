import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

// Get all secret keys with usage statistics
export const getAllWithUsage = query({
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
      data: secretKeys.map((k) => ({
        _id: k._id,
        secretKey: k.secretKey,
        firstRoundMale: k.firstRoundMale,
        firstRoundFemale: k.firstRoundFemale,
        secondRoundMale: k.secondRoundMale,
        secondRoundFemale: k.secondRoundFemale,
      })),
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

// Generate and insert a given amount of unique secret keys
export const generateAndInsert = mutation({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate amount
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    if (args.amount <= 0 || args.amount > 1000) {
      throw new Error("Amount must be between 1 and 1000");
    }

    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();

    if (!activeMetadata) {
      throw new Error("No active room!");
    }

    // Get all existing secret keys for this room to check uniqueness
    const existingKeys = await ctx.db
      .query("secretKeys")
      .withIndex("by_roomId", (q) => q.eq("roomId", activeMetadata._id))
      .collect();

    const existingKeySet = new Set(
      existingKeys.map((k) => k.secretKey.toLowerCase().trim())
    );

    // URL-safe characters: alphanumeric (0-9, a-z)
    // Using lowercase for consistency with how keys are stored
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    const keyLength = 3;
    const maxAttempts = args.amount * 100; // Prevent infinite loops

    const generatedKeys: string[] = [];
    let attempts = 0;

    while (generatedKeys.length < args.amount && attempts < maxAttempts) {
      attempts++;

      // Generate a random 3-character key
      let key = "";
      for (let i = 0; i < keyLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        key += chars[randomIndex];
      }

      // Check if key is unique (not in existing keys and not in generated keys)
      if (!existingKeySet.has(key) && !generatedKeys.includes(key)) {
        generatedKeys.push(key);
        existingKeySet.add(key); // Add to set to prevent duplicates in this batch
      }
    }

    if (generatedKeys.length < args.amount) {
      throw new Error(
        `Failed to generate ${args.amount} unique keys. Generated ${generatedKeys.length} keys after ${attempts} attempts.`
      );
    }

    // Insert the generated keys (same logic as insertMany)
    let insertedCount = 0;
    for (const key of generatedKeys) {
      const normalizedKey = key.toLowerCase().trim();

      // Double-check uniqueness before inserting
      const existing = await ctx.db
        .query("secretKeys")
        .withIndex("by_secretKey_roomId", (q) =>
          q.eq("secretKey", normalizedKey).eq("roomId", activeMetadata._id)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("secretKeys", {
          adminId: userId.subject as Id<"users">,
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
      message: `Generated and inserted ${insertedCount} unique secret keys.`,
      keysGenerated: generatedKeys.length,
      keysInserted: insertedCount,
      keys: generatedKeys,
    };
  },
});