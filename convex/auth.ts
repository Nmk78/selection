import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if user already exists
      if (args.existingUserId) {
        // Existing user - allow sign in
        return args.existingUserId;
      }

      // New user - check if they're invited
      const email = args.profile?.email;
      if (!email) {
        throw new Error("Email is required");
      }

      const normalizedEmail = email.toLowerCase();

      // Check if email is in the invited list
      const invites = await ctx.db.query("invites").collect();
      const invite = invites.find(
        (i) => i.email === normalizedEmail && !i.used
      );

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
