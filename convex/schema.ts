import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  metadata: defineTable({
    title: v.string(),
    active: v.boolean(),
    description: v.string(),
    maleForSecondRound: v.number(),
    femaleForSecondRound: v.number(),
    leaderBoardCandidates: v.optional(v.number()),
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
  }).index("by_active", ["active"]),

  candidates: defineTable({
    roomId: v.id("metadata"),
    name: v.string(),
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
    .index("by_roomId_gender", ["roomId", "gender"]),

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
});
