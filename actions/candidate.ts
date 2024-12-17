// app/actions/candidates.js

"use server";

import { utapi } from "@/app/server/uploadthing";
import { prisma } from "@/lib/prisma";
import { candidateSchema } from "@/lib/validations";
import { Candidate } from "@/types/types";
import { MongoClient } from "mongodb";

//@ts-ignore
const client = new MongoClient(process.env.DATABASE_URL);

export async function createCandidate(candidateData: Candidate) {
  // Validate input candidateData using Zod
  const parsedData = candidateSchema.safeParse(candidateData);

  // Check if validation succeeded
  if (!parsedData.success) {
    console.log("🚀 ~ createCandidate ~ parsedData:", parsedData);

    // Throw an error with validation issues if validation fails
    throw new Error(
      "zod error while parsing " +
        parsedData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  // Destructure the parsed candidateData
  const parsedCandidateData = parsedData.data;
  console.log(
    "🚀 ~ createCandidate ~ parsedCandidateData:",
    parsedCandidateData
  );

  // Create the candidate in the database
  const candidate = await prisma.candidate.create({ data: candidateData });

  return candidate;
}

export async function getAllCandidates() {
  const activMetadata = await prisma.metadata.findMany({
    where: { active: true },
  });
  // console.log("🚀 ~ getAllCandidates ~ activMetadata:", activMetadata)

  if (activMetadata.length === 0) {
    throw Error("No active room!");
  }
  return await prisma.candidate.findMany({
    where: {
      roomId: activMetadata[0].id,
    },
  });
}

export const getCandidatesWithStats = async () => {
  try {
    const activMetadata = await prisma.metadata.findMany({
      where: { active: true },
    });
    // console.log("🚀 ~ getAllCandidates ~ activMetadata:", activMetadata)

    if (activMetadata.length === 0) {
      throw Error("No active room!");
    }

    await client.connect();
    const db = client.db("selectionv2");

    const candidatesWithStats = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId: activMetadata[0].id } }, // Filter by roomId
        {
          $lookup: {
            from: "Vote", // Join with the Vote collection
            let: { candidateId: { $toString: "$_id" } }, // Convert ObjectId to string
            pipeline: [
              { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } }, // Compare with Vote.candidateId
            ],
            as: "voteDetails", // Store the joined data in this field
          },
        },
        {
          $addFields: {
            totalVotes: {
              $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
            }, // Count the number of votes
            totalRating: { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
            combinedScore: {
              $add: [
                {
                  $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
                },
                { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
              ],
            },
          },
        },
        {
          $project: {
            id: "$_id",
            name: 1,
            gender: 1,
            major: 1,
            totalVotes: 1,
            totalRating: 1,
          },
        },
        {
          $sort: { combinedScore: -1 }, // Sort by totalVotes + totalRating in descending order
        },
      ])
      .toArray();

    return candidatesWithStats;
  } catch (error) {
    console.error("Error fetching candidates with stats:", error);
    throw new Error("Failed to fetch candidates");
  } finally {
    await client.close();
  }
};

export const getCandidatesForSecondRound = async () => {
  try {
    const activMetadata = await prisma.metadata.findMany({
      where: { active: true },
    });

    if (activMetadata.length === 0) {
      throw new Error("No active room!");
    }

    const { id, maleForSecondRound, femaleForSecondRound } = activMetadata[0];

    await client.connect();
    const db = client.db("selectionv2");

    const candidatesWithStats = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId: id } }, // Filter by roomId
        {
          $lookup: {
            from: "Vote", // Join with the Vote collection
            let: { candidateId: { $toString: "$_id" } }, // Convert ObjectId to string
            pipeline: [
              { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } }, // Compare with Vote.candidateId
            ],
            as: "voteDetails", // Store the joined data in this field
          },
        },
        {
          $addFields: {
            totalVotes: {
              $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
            }, // Count the number of votes
            totalRating: { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
            combinedScore: {
              $add: [
                {
                  $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
                },
                { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: { $toString: "$_id" }, // Convert _id to string for consistency
            name: 1,
            intro: 1,
            gender: 1,
            roomId: 1,
            height: 1,
            age: 1,
            weight: 1,
            hobbies: 1,
            major: 1,
            profileImage: 1,
            carouselImages: 1,
            // totalVotes: 1, // Ensure these fields are included
            // totalRating: 1,
            combinedScore: 1,
          },
        },
        {
          $sort: { combinedScore: -1 }, // Sort by combinedScore in descending order
        },
      ])
      .toArray();

    // Separate candidates by gender
    const maleCandidates = candidatesWithStats.filter(
      (candidate) => candidate.gender === "male"
    );
    const femaleCandidates = candidatesWithStats.filter(
      (candidate) => candidate.gender === "female"
    );

    // Sort and take top males
    const topMales = maleCandidates
      .sort((a, b) => {
        if (b.totalVotes === a.totalVotes) {
          return (b.totalRating || 0) - (a.totalRating || 0); // Sort by rating if votes are the same
        }
        return b.totalVotes - a.totalVotes;
      })
      .slice(0, maleForSecondRound);

    // Sort and take top females
    const topFemales = femaleCandidates
      .sort((a, b) => {
        if (b.totalVotes === a.totalVotes) {
          return (b.totalRating || 0) - (a.totalRating || 0); // Sort by rating if votes are the same
        }
        return b.totalVotes - a.totalVotes;
      })
      .slice(0, femaleForSecondRound);

    // Combine eligible candidates' IDs
    const eligibleCandidates = [
      ...topMales.map((v) => v.id),
      ...topFemales.map((v) => v.id),
    ];

    return { topMales, topFemales, eligibleCandidates };
  } catch (error) {
    console.error("Error fetching candidates for second round:", error);
    throw new Error("Failed to fetch candidates for the second round");
  } finally {
    await client.close();
  }
};

export const getCandidatesForJudge = async () => {
  try {
    const activMetadata = await prisma.metadata.findMany({
      where: { active: true },
    });
    // console.log("🚀 ~ activMetadata:", activMetadata);

    if (activMetadata.length === 0) {
      throw Error("No active room!");
    }

    const { id, maleForSecondRound, femaleForSecondRound } = activMetadata[0];

    await client.connect();
    const db = client.db("selectionv2");

    const candidatesWithStats = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId: id } }, // Filter by roomId
        {
          $lookup: {
            from: "Vote", // Join with the Vote collection
            let: { candidateId: { $toString: "$_id" } }, // Convert ObjectId to string
            pipeline: [
              { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } }, // Compare with Vote.candidateId
            ],
            as: "voteDetails", // Store the joined data in this field
          },
        },
        {
          $addFields: {
            totalVotes: {
              $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
            },
            totalRating: {
              $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0],
            },
            combinedScore: {
              $add: [
                {
                  $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
                },
                { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
              ],
            },
          },
        },
        {
          $sort: { combinedScore: -1 }, // Sort by combinedScore in descending order
        },
      ])
      .toArray();

    // console.log("🚀 ~ getCandidatesForJudge ~ candidatesWithStats:", candidatesWithStats)

    // Separate candidates by gender
    const maleCandidates = candidatesWithStats.filter(
      (candidate) => candidate.gender === "male"
    );
    const femaleCandidates = candidatesWithStats.filter(
      (candidate) => candidate.gender === "female"
    );

    // Sort and take top males
    const topMales = maleCandidates
      .sort((a, b) => {
        if (b.totalVotes === a.totalVotes) {
          return (b.totalRating || 0) - (a.totalRating || 0);
        }
        return b.totalVotes - a.totalVotes;
      })
      .slice(0, maleForSecondRound);

    // Sort and take top females
    const topFemales = femaleCandidates
      .sort((a, b) => {
        if (b.totalVotes === a.totalVotes) {
          return (b.totalRating || 0) - (a.totalRating || 0);
        }
        return b.totalVotes - a.totalVotes;
      })
      .slice(0, femaleForSecondRound);

    // Map candidates to include only the required fields
    //@ts-ignore
    const sanitizeCandidate = (candidate) => ({
      id: candidate._id.toString(),
      name: candidate.name,
      intro: candidate.intro,
      gender: candidate.gender,
      major: candidate.major,
      profileImage: candidate.profileImage,
      carouselImages: candidate.carouselImages,
      height: candidate.height,
      age: candidate.age,
      weight: candidate.weight,
      hobbies: candidate.hobbies,
    });

    const topMalesSanitized = topMales.map(sanitizeCandidate);
    const topFemalesSanitized = topFemales.map(sanitizeCandidate);

    // Combine eligible candidates' IDs
    const eligibleCandidates = [
      ...topMalesSanitized.map((v) => v.id),
      ...topFemalesSanitized.map((v) => v.id),
    ];

    return {
      topMales: topMalesSanitized,
      topFemales: topFemalesSanitized,
      eligibleCandidates,
    };
  } catch (error) {
    console.error("Error fetching candidates for the second round:", error);
    throw new Error("Failed to fetch candidates for the second round");
  } finally {
    await client.close();
  }
};

export async function getCandidateById(candidateId: string) {
  "use server";

  // Validate the input
  if (!candidateId) {
    throw new Error("Candidate ID is required");
  }

  // Fetch candidate from the database
  const candidate = await prisma.candidate.findUnique({
    where: {
      id: candidateId,
    },
  });

  // Check if the candidate exists
  if (!candidate) {
    throw new Error("Candidate not found");
  }

  // Return the candidate's information
  return candidate;
}

// Define the types for the data being passed
interface CandidateUpdateData {
  profileImage?: string | null; // the profile image URL or identifier (nullable if no image)
  carouselImages?: string[]; // list of carousel image URLs or identifiers (must have at least 1 image)
}

// Define the Candidate type based on the Prisma schema

export const updateCandidate = async (
  candidateId: string,
  updatedData: CandidateUpdateData
): Promise<void> => {
  // Ensure carouselImages is not empty
  if (updatedData.carouselImages && updatedData.carouselImages.length === 0) {
    throw new Error("Carousel images must contain at least one image.");
  }

  console.log("🚀 ~ updatedData:", updatedData);

  // Track the old images from the current candidate (before updating)
  const existingCandidate: Candidate | null = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  // If candidate doesn't exist, we should handle the case appropriately
  if (!existingCandidate) {
    throw new Error("Candidate not found");
  }

  // Track the old images
  const deletedImages = {
    profileImage: existingCandidate.profileImage,
    carouselImages: existingCandidate.carouselImages,
  };

  // Update candidate data (name, gender, etc.)
  const updatedCandidateData: any = {
    ...updatedData,
    // Only update profileImage and carouselImages separately as handled
    profileImage: updatedData.profileImage || existingCandidate.profileImage,
    carouselImages: updatedData.carouselImages || existingCandidate.carouselImages,
  };

  // Check if profile image has been updated
  if (
    updatedData.profileImage &&
    updatedData.profileImage !== existingCandidate.profileImage
  ) {
    // If the profile image was removed, delete it from Uploadthing and MongoDB
    if (deletedImages.profileImage) {
      console.log("Deleting profile image");
      const res = await utapi.deleteFiles(extractKeyFromUrl(deletedImages.profileImage)); // Delete the old profile image
      console.log("🚀 ~ Delete profile image res:", res);
    }
  }

  // Handle carousel image changes
  if (updatedData.carouselImages && updatedData.carouselImages.length > 0) {
    // Check for removed carousel images
    const imagesToDelete = deletedImages.carouselImages.filter(
      (img) => !updatedData?.carouselImages?.includes(img)
    );

    // Delete removed carousel images from Uploadthing
    if (imagesToDelete.length > 0) {
      console.log("deleting carousel Images");
      const res = await utapi.deleteFiles(imagesToDelete.map(extractKeyFromUrl)); // Delete the images no longer needed
      console.log("🚀 ~ delete carousel Image - res:", res);
    }
  }

  // Update the candidate in the database
  await prisma.candidate.update({
    where: { id: candidateId },
    data: updatedCandidateData, // Update with all the new data including profileImage and carouselImages
  });

  console.log("🚀 ~ Candidate updated successfully");
};

// Utility function to extract the key from a URL (if your URL follows this pattern)
const extractKeyFromUrl = (url: string): string => {
  const match = url.match(/f\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : ""; // Extracts the key from the URL
};

export async function deleteCandidate(id: string) {
  return await prisma.candidate.delete({
    where: { id },
  });
}

export const getTopCandidates = async () => {
  try {
    await client.connect();
    const db = client.db("selectionv2");

    const votesCollection = db.collection("Vote");
    const candidatesCollection = db.collection("Candidate");

    // Fetch active room metadata
    const activeMetadata = await prisma.metadata.findFirst({
      where: { active: true },
    });

    if (!activeMetadata) {
      throw new Error("No active room!");
    }

    const { id } = activeMetadata;

    // Aggregate the candidates with their votes and ratings
    const candidatesWithVotes = await candidatesCollection
      .aggregate([
        { $match: { roomId: id } }, // Filter by roomId
        {
          $lookup: {
            from: "Vote",
            let: { candidateId: { $toString: "$_id" } }, // Convert `_id` to string if needed
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$candidateId", "$$candidateId"] }, // Match votes for the candidate
                },
              },
            ],
            as: "voteDetails",
          },
        },
        {
          $addFields: {
            totalVotes: {
              $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
            },
            totalRating: {
              $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0],
            },
            combinedScore: {
              $add: [
                {
                  $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
                },
                { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
              ],
            },
          },
        },
        {
          $sort: { combinedScore: -1 }, // Sort by combined score
        },
        {
          $project: {
            id: { $toString: "$_id" },
            name: 1,
            gender: 1,
            profileImage: 1,
            major: 1,
            totalVotes: 1,
            totalRating: 1,
            combinedScore: 1,
            voteDetails: 1, // Inspect the joined vote details
          },
        },
      ])
      .toArray();

    // Log candidates for debugging
    console.log(
      "🚀 ~ getTopCandidates ~ candidatesWithVotes:",
      candidatesWithVotes
    );

    // Filter candidates by gender
    const males = candidatesWithVotes.filter(
      (candidate) => candidate.gender === "male"
    );
    const females = candidatesWithVotes.filter(
      (candidate) => candidate.gender === "female"
    );

    // Get the top 2 candidates for each gender
    const topMales = males.slice(0, 2);
    const topFemales = females.slice(0, 2);

    console.log("Top Males:", topMales);
    console.log("Top Females:", topFemales);

    // Return the top 2 candidates for each gender
    return {
      king: topMales[0],
      prince: topMales[1],
      queen: topFemales[0],
      princess: topFemales[1],
    };
  } catch (error) {
    console.error("Error fetching top candidates:", error);
    throw new Error("Failed to fetch top candidates.");
  } finally {
    await client.close();
  }
};
