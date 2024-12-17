"use server";
import { prisma } from "@/lib/prisma";

export const addRatingsToVotes = async (ratings: any, secretKey: any) => {
  try {
    // Ensure the secretKey is valid and in lowercase
    if (!secretKey || typeof secretKey !== "string") {
      throw new Error("Secret key is required and should be a string.");
    }

    const SpecialSecretKey = secretKey.toLowerCase().trim();
    const activeMetadata = await prisma.metadata.findFirst({
      where: { active: true },
    });

    if (!activeMetadata) {
      throw new Error("No active room!");
    }

    //@ts-ignore
    const { id } = activeMetadata;

    const totalSecretKeys = await prisma.specialSecretKey.count();

    // Fetch the special secret key record from the database
    const secretKeyRecord = await prisma.specialSecretKey.findUnique({
      where: { specialSecretKey: SpecialSecretKey, roomId: id }, // Use camelCase field name
    });

    // Handle case where the secret key is not valid
    if (!secretKeyRecord) {
        return { success: false, message: "This key was invalid." };
    }

    if (secretKeyRecord.used) {
      return { success: false, message: "This key was already used." };
    }

    const { roomId } = secretKeyRecord;

    // Validate the ratings object to ensure it's not empty
    if (
      !ratings ||
      typeof ratings !== "object" ||
      Object.keys(ratings).length === 0
    ) {
      throw new Error("Ratings object is invalid or empty.");
    }

    const results = []; // Array to store update or creation results
    for (const [candidateId, rating] of Object.entries(ratings)) {
      if (typeof rating !== "number" || rating <= 0) {
        throw new Error(
          `Invalid rating value for candidate ${candidateId}: ${rating}.`
        );
      }

      const existingVote = await prisma.vote.findFirst({
        where: { candidateId, roomId },
      });

      if (existingVote) {
        // Update the existing vote
        const updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: {
            totalRating: {
              increment: Math.round(rating / (totalSecretKeys / 2)), // Round the rating effect
            },
          },
        });
        results.push({
          candidateId,
          message: `Vote updated for candidate ${candidateId}: ${updatedVote.totalVotes} votes, ${updatedVote.totalRating} total rating.`,
        });
      } else {
        // Create a new vote
        const createdVote = await prisma.vote.create({
          data: {
            candidateId,
            roomId,
            totalVotes: 1,
            totalRating: rating,
          },
        });
        results.push({
          candidateId,
          message: `New vote created for candidate ${candidateId}: ${createdVote.totalVotes} votes, ${createdVote.totalRating} total rating.`,
        });
      }
    }

    await prisma.specialSecretKey.update({
      where: { specialSecretKey: SpecialSecretKey },
      data: { used: true },
    });
    return {
      success: true,
      message: "Ratings successfully added!",
      details: results,
    };
  } catch (error: any) {
    console.error("Error updating ratings:", error.message);
    return {
      success: false,
      message: "Failed to rate candidates.",
      error: error.message,
    };
  }
};
