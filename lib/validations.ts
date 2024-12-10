import { z } from "zod";

const metadataSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(), 
  // active: z.boolean().default(true),
  round: z.enum(["preview", "first", "second", "result"], {
    message:
      "Invalid round state. Allowed values are: 'preview', 'first', 'second', 'result'.",
  }).default("preview"),
});

const candidateSchema = z.object({
  roomId: z.string().min(1, { message: "Room ID is required" }), // Add room ID here
  // id: z.string().trim().min(1, { message: "ID is required" }),
  name: z.string().trim().min(1, { message: "Name is required" }),
  gender: z.enum(["male", "female"], { message: "Invalid gender" }),
  major: z.string().trim().min(1, { message: "Major is required" }),
  profileImage: z
    .string()
    .url({ message: "Profile image must be a valid URL" }),
  carouselImages: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional(),
  height: z
    .number()
    .min(50, { message: "Height must be at least 50 cm" })
    .max(250, { message: "Height must be less than or equal to 250 cm" }),
  weight: z
    .number()
    .min(20, { message: "Weight must be at least 20 kg" })
    .max(300, { message: "Weight must be less than or equal to 300 kg" }),
  hobbies: z.array(
    z
      .string()
      .trim()
      .min(1, { message: "Each hobby must be at least 1 character" })
  ),
});

const secretKeySchema = z.object({
  adminId: z.string().min(1, { message: "Admin ID is required" }),
  secretKey: z.string().min(1, { message: "Secret Key is required" }),
  firstRoundMale: z.boolean().default(false),
  firstRoundFemale: z.boolean().default(false),
  secondRoundMale: z.boolean().default(false),
  secondRoundFemale: z.boolean().default(false),
});

const specialSecretKeySchema = z.object({
  adminId: z.string().min(1, { message: "Admin ID is required" }),
  specialSecretKey: z
    .string()
    .min(1, { message: "Special Secret Key is required" }),
  used: z.boolean().default(false),
  ratings: z
    .array(
      z.object({
        candidateId: z.string().min(1, { message: "Candidate ID is required" }),
        rating: z
          .number()
          .min(1, { message: "Rating must be at least 1" })
          .max(10, { message: "Rating must be at most 10" }),
      })
    )
    .refine((ratings) => ratings.length === 6, {
      message: "You must rate exactly 6 candidates",
    }),
});

const voteSchema = z.object({
  roomid:z.string(),
  candidateId: z.string().min(1, { message: "Candidate ID is required" }), // Candidate being voted for
  totalVotes: z.number().default(0), // Total votes for the candidate in this round
  totalRating: z.number().default(0), // Cumulative rating (used in second round with special keys)
});

export {metadataSchema, candidateSchema, secretKeySchema, specialSecretKeySchema, voteSchema}