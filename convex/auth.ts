import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

// Validate environment variables
if (!process.env.AUTH_GOOGLE_ID) {
  throw new Error("AUTH_GOOGLE_ID environment variable is not set");
}
if (!process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_SECRET environment variable is not set");
}

// Configure Google provider
const googleProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
});

console.log("🔐 Auth configuration - Provider count:", 1);
console.log("🔐 Auth configuration - Provider ID:", googleProvider.id || "google");

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [googleProvider, ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if user already exists by ID
      if (args.existingUserId) {
        // Existing user - allow sign in
        return args.existingUserId;
      }

      // New user - check if they're invited
      const email = args.profile?.email;
      console.log("🚀 ~ email:", email)
      if (!email) {
        throw new Error("Email is required");
      }

      const normalizedEmail = email.toLowerCase();

      // Check if user already exists by email (existing users can always sign in)
      // Query all users and filter by email
      const allUsers = await ctx.db.query("users").collect();
      console.log("🚀 ~ allUsers:", allUsers)
      const existingUser = allUsers.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );
      console.log("🚀 ~ existingUser:", existingUser)
      if (existingUser) {
        // Existing user - allow sign in
        return existingUser._id;
      }

      // New user - check if they're invited
      const invites = await ctx.db.query("invites").collect();
      const invite = invites.find(
        (i) => i.email === normalizedEmail && !i.used
      );
      console.log("🚀 ~ invite:", invite)
      if (!invite) {
        throw new Error("You are not invited. Please contact an admin.");
      }

      // Create the user
      const userId = await ctx.db.insert("users", {
        email: normalizedEmail,
        name: args.profile?.name ?? undefined,
        image: args.profile?.image ?? undefined,
        role: invite.role ?? "user",
      });

      // Mark invite as used
      await ctx.db.patch(invite._id, { used: true, usedAt: Date.now() });

      return userId;
    },
  },
});
