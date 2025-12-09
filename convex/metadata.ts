import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all metadata ordered by updatedAt
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const metadata = await ctx.db.query("metadata").order("desc").collect();
    return metadata;
  },
});

// Get active metadata
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first();
    return activeMetadata;
  },
});

// Get metadata by ID
export const getById = query({
  args: { id: v.id("metadata") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get archived (non-active) metadata
export const getArchived = query({
  args: {},
  handler: async (ctx) => {
    const allMetadata = await ctx.db.query("metadata").collect();
    return allMetadata.filter((m) => !m.active);
  },
});

// Create new metadata
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    maleForSecondRound: v.number(),
    femaleForSecondRound: v.number(),
  },
  handler: async (ctx, args) => {
    // Deactivate all existing active metadata
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    for (const meta of activeMetadata) {
      await ctx.db.patch(meta._id, { active: false, updatedAt: Date.now() });
    }

    // Create new metadata
    const now = Date.now();
    const id = await ctx.db.insert("metadata", {
      title: args.title,
      description: args.description,
      maleForSecondRound: args.maleForSecondRound,
      femaleForSecondRound: args.femaleForSecondRound,
      active: true,
      round: "preview",
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});

// Set active metadata
export const setActive = mutation({
  args: { id: v.id("metadata") },
  handler: async (ctx, args) => {
    // Deactivate all existing active metadata
    const activeMetadata = await ctx.db
      .query("metadata")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    for (const meta of activeMetadata) {
      await ctx.db.patch(meta._id, { active: false, updatedAt: Date.now() });
    }

    // Activate the specified metadata
    await ctx.db.patch(args.id, { active: true, updatedAt: Date.now() });

    return await ctx.db.get(args.id);
  },
});

// Update round
export const updateRound = mutation({
  args: {
    id: v.id("metadata"),
    round: v.union(
      v.literal("preview"),
      v.literal("first"),
      v.literal("firstVotingClosed"),
      v.literal("secondPreview"),
      v.literal("second"),
      v.literal("secondVotingClosed"),
      v.literal("result")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { round: args.round, updatedAt: Date.now() });
    return await ctx.db.get(args.id);
  },
});
