import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get the current authenticated user
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Check if current user is admin
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return false;
    }
    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});

// Update user to admin role (internal use only)
export const setAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user is already admin
    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.role !== "admin") {
      // If no admins exist, make this user admin
      const admins = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "admin"))
        .collect();

      if (admins.length === 0) {
        // First user becomes admin
        await ctx.db.patch(userId, { role: "admin" });
        return { success: true };
      }

      throw new Error("Not authorized");
    }

    await ctx.db.patch(userId, { role: "admin" });
    return { success: true };
  },
});

// Make current user admin if no admins exist
export const makeFirstAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if any admins exist
    const admins = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    if (admins.length > 0) {
      throw new Error("Admin already exists");
    }

    await ctx.db.patch(userId, { role: "admin" });
    return { success: true };
  },
});

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});
