import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";

// Maximum number of history records to keep per announcement
const MAX_HISTORY_PER_ANNOUNCEMENT = 100;

// Helper function to clean up old history records
async function cleanupHistory(
  ctx: MutationCtx,
  announcementId: Id<"announcements">
) {
  const allHistory = await ctx.db
    .query("announcementHistory")
    .withIndex("by_announcementId_timestamp", (q) =>
      q.eq("announcementId", announcementId)
    )
    .order("desc")
    .collect();

  // If we have more than the max, delete the oldest ones
  if (allHistory.length > MAX_HISTORY_PER_ANNOUNCEMENT) {
    const recordsToDelete = allHistory.slice(MAX_HISTORY_PER_ANNOUNCEMENT);
    await Promise.all(
      recordsToDelete.map((record) => ctx.db.delete(record._id))
    );
  }
}

// Get all announcements (admin only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      return [];
    }

    return await ctx.db
      .query("announcements")
      .order("desc")
      .collect();
  },
});

// Get active announcements (public)
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_active", (q) => q.eq("active", true))
      .order("desc")
      .collect();
  },
});

// Create announcement (admin only)
export const create = mutation({
  args: {
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("important"),
      v.literal("warning"),
      v.literal("success")
    ),
    active: v.boolean(),
  },
  handler: async (ctx, { message, type, active }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can create announcements");
    }

    const now = Date.now();
    const announcementId = await ctx.db.insert("announcements", {
      message,
      type,
      active,
      createdAt: now,
      updatedAt: now,
    });

    // Log history if created as active
    if (active) {
      await ctx.db.insert("announcementHistory", {
        announcementId,
        action: "activated",
        userId,
        timestamp: now,
      });
      await cleanupHistory(ctx, announcementId);
    }

    return announcementId;
  },
});

// Update announcement (admin only)
export const update = mutation({
  args: {
    id: v.id("announcements"),
    message: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("info"),
        v.literal("important"),
        v.literal("warning"),
        v.literal("success")
      )
    ),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, message, type, active }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can update announcements");
    }

    const announcement = await ctx.db.get(id);
    if (!announcement) {
      throw new Error("Announcement not found");
    }

    // Log history if active status is changing
    if (active !== undefined && active !== announcement.active) {
      await ctx.db.insert("announcementHistory", {
        announcementId: id,
        action: active ? "activated" : "deactivated",
        userId,
        timestamp: Date.now(),
      });
      await cleanupHistory(ctx, id);
    }

    await ctx.db.patch(id, {
      ...(message !== undefined && { message }),
      ...(type !== undefined && { type }),
      ...(active !== undefined && { active }),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get history for an announcement (admin only)
export const getHistory = query({
  args: {
    announcementId: v.id("announcements"),
  },
  handler: async (ctx, { announcementId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      return [];
    }

    const history = await ctx.db
      .query("announcementHistory")
      .withIndex("by_announcementId", (q) =>
        q.eq("announcementId", announcementId)
      )
      .order("desc")
      .collect();

    // Get user details for each history entry
    const historyWithUsers = await Promise.all(
      history.map(async (entry) => {
        const user = await ctx.db.get(entry.userId);
        return {
          ...entry,
          userName: user?.name || user?.email || "Unknown",
        };
      })
    );

    return historyWithUsers;
  },
});

// Delete announcement (admin only)
export const remove = mutation({
  args: {
    id: v.id("announcements"),
  },
  handler: async (ctx, { id }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can delete announcements");
    }

    const announcement = await ctx.db.get(id);
    if (!announcement) {
      throw new Error("Announcement not found");
    }

    // Delete all history records for this announcement
    const historyRecords = await ctx.db
      .query("announcementHistory")
      .withIndex("by_announcementId", (q) => q.eq("announcementId", id))
      .collect();
    
    await Promise.all(
      historyRecords.map((record) => ctx.db.delete(record._id))
    );

    await ctx.db.delete(id);
    return { success: true };
  },
});

