import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

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
    leaderBoardCandidates: v.number(),
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
      leaderBoardCandidates: args.leaderBoardCandidates,
      active: true,
      round: "preview",
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});

export const edit = mutation({
  args: {
    id: v.id("metadata"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    maleForSecondRound: v.optional(v.number()),
    femaleForSecondRound: v.optional(v.number()),
    leaderBoardCandidates: v.optional(v.number()),
    round: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Metadata not found");

    const updateData: {
      _id: Id<"metadata">;
      _creationTime?: number;
      leaderBoardCandidates?: number | undefined;
      title?: string;
      active?: boolean;
      description?: string;
      maleForSecondRound?: number;
      femaleForSecondRound?: number;
      round?:
        | "preview"
        | "first"
        | "firstVotingClosed"
        | "secondPreview"
        | "second"
        | "secondVotingClosed"
        | "result";
      createdAt?: number;
      updatedAt?: number;
    } = {
      _id: args.id,
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.maleForSecondRound !== undefined)
      updateData.maleForSecondRound = args.maleForSecondRound;
    if (args.femaleForSecondRound !== undefined)
      updateData.femaleForSecondRound = args.femaleForSecondRound;
    if (args.leaderBoardCandidates !== undefined)
      updateData.leaderBoardCandidates = args.leaderBoardCandidates;
    if (args.round !== undefined) updateData.round = args.round as Doc<"metadata">["round"];

    await ctx.db.patch(args.id, updateData);

    return await ctx.db.get(args.id);
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


export const getCurrentRound = query({
  args: {},
  handler: async (ctx) => {
    const currentRound = await ctx.db.query("metadata").withIndex("by_active", (q) => q.eq("active", true)).first();
    if (!currentRound) throw new Error("No active metadata found");
    return currentRound.round;
  },
});