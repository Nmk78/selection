import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Users table extended with role
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
  }).index("email", ["email"]),

  metadata: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
    active: v.boolean(),
    description: v.string(),
    maleForSecondRound: v.number(),
    femaleForSecondRound: v.number(),
    leaderBoardCandidates: v.number(),
    round: v.union(
      v.literal("preview"),
      v.literal("first"),
      v.literal("firstVotingClosed"),
      v.literal("secondPreview"),
      v.literal("second"),
      v.literal("secondVotingClosed"),
      v.literal("result")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["active"])
    .index("by_slug", ["slug"]),

  candidates: defineTable({
    roomId: v.id("metadata"),
    name: v.string(),
    slug: v.string(),
    intro: v.string(),
    gender: v.union(v.literal("male"), v.literal("female")),
    major: v.string(),
    profileImage: v.string(),
    carouselImages: v.array(v.string()),
    height: v.number(),
    age: v.number(),
    weight: v.number(),
    hobbies: v.array(v.string()),
  })
    .index("by_roomId", ["roomId"])
    .index("by_slug", ["slug"])
    .index("by_roomId_gender", ["roomId", "gender"])
    .index("by_slug_roomId", ["slug", "roomId"]),

  secretKeys: defineTable({
    adminId: v.string(),
    roomId: v.id("metadata"),
    secretKey: v.string(),
    firstRoundMale: v.boolean(),
    firstRoundFemale: v.boolean(),
    secondRoundMale: v.boolean(),
    secondRoundFemale: v.boolean(),
  })
    .index("by_secretKey", ["secretKey"])
    .index("by_roomId", ["roomId"])
    .index("by_secretKey_roomId", ["secretKey", "roomId"]),

  specialSecretKeys: defineTable({
    adminId: v.string(),
    roomId: v.id("metadata"),
    specialSecretKey: v.string(),
    used: v.boolean(),
    ratings: v.array(
      v.object({
        candidateId: v.string(),
        rating: v.number(),
      })
    ),
  })
    .index("by_specialSecretKey", ["specialSecretKey"])
    .index("by_roomId", ["roomId"])
    .index("by_specialSecretKey_roomId", ["specialSecretKey", "roomId"]),

  votes: defineTable({
    roomId: v.id("metadata"),
    candidateId: v.id("candidates"),
    totalVotes: v.number(),
    totalRating: v.number(),
  })
    .index("by_roomId", ["roomId"])
    .index("by_candidateId", ["candidateId"])
    .index("by_roomId_candidateId", ["roomId", "candidateId"]),

  // Invites table for invite-only access
  invites: defineTable({
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    invitedBy: v.optional(v.id("users")),
    used: v.boolean(),
    usedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
