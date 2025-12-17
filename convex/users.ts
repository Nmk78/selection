import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get the current authenticated user
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    console.log("🚀 ~ userId:", userId)
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

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// ========== INVITE MANAGEMENT ==========

// Create an invite (admin only)
export const createInvite = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, { email, role }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can create invites");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if invite already exists
    const existing = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      throw new Error("Invite already exists for this email");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const inviteId = await ctx.db.insert("invites", {
      email: normalizedEmail,
      role,
      invitedBy: userId,
      used: false,
      createdAt: Date.now(),
    });

    return { success: true, inviteId };
  },
});

// Get all invites (admin only)
export const getInvites = query({
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

    return await ctx.db.query("invites").order("desc").collect();
  },
});

// Delete an invite (admin only)
export const deleteInvite = mutation({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, { inviteId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Only admins can delete invites");
    }

    const invite = await ctx.db.get(inviteId);
    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.used) {
      throw new Error("Cannot delete a used invite");
    }

    await ctx.db.delete(inviteId);
    return { success: true };
  },
});

// Check if any users exist (for first admin setup)
export const hasUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").first();
    return !!users;
  },
});

// Create first admin invite (only if no users exist)
export const createFirstAdminInvite = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Check if any users exist
    const existingUser = await ctx.db.query("users").first();
    if (existingUser) {
      throw new Error("Users already exist. Contact an admin for an invite.");
    }

    // Check if any invites exist
    const existingInvite = await ctx.db.query("invites").first();
    if (existingInvite) {
      throw new Error("An invite already exists.");
    }

    const normalizedEmail = email.toLowerCase().trim();

    await ctx.db.insert("invites", {
      email: normalizedEmail,
      role: "admin",
      used: false,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
