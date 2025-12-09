// app/actions/candidates.js

"use server";

import { utapi } from "@/app/server/uploadthing";
import { prisma } from "@/lib/prisma";
import { extractKeyFromUrl } from "@/lib/utils";
import { candidateSchema } from "@/lib/validations";
import { Candidate } from "@/types/types";
// import { Candidate } from "@/types/types";
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
  const candidate = await prisma.candidate.create({
    data: parsedCandidateData,
  });
  // const candidate = await prisma.candidate.create({ data: candidateData });

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

// export const getCandidateById = async (candidateId: string) => {
//   const candidate = await prisma.candidate.findUnique({
//     where: { id: candidateId },
//   });

//   if (!candidate) {
//     throw new Error("Candidate not found");
//   }

//   const data = JSON.parse(JSON.stringify(candidate))
//   return data
// };

export const getCandidateById = async (candidateId: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  return candidate;
};

// Define the types for the data being passed

// Define the Candidate type based on the Prisma schema

// export const updateCandidate = async (
//   candidateId: string,
//   updatedData: CandidateUpdateData
// ): Promise<void> => {
//   // Ensure carouselImages is not empty
//   if (updatedData.carouselImages && updatedData.carouselImages.length === 0) {
//     throw new Error("Carousel images must contain at least one image.");
//   }

//   console.log("🚀 ~ updatedData:", updatedData);

//   // Track the old images from the current candidate (before updating)
//   const existingCandidate: Candidate | null = await prisma.candidate.findUnique({
//     where: { id: candidateId },
//   });

//   // If candidate doesn't exist, we should handle the case appropriately
//   if (!existingCandidate) {
//     throw new Error("Candidate not found");
//   }

//   // Track the old images
//   const deletedImages = {
//     profileImage: existingCandidate.profileImage,
//     carouselImages: existingCandidate.carouselImages,
//   };

//   // Update candidate data (name, gender, etc.)
//   const updatedCandidateData: any = {
//     ...updatedData,
//     // Only update profileImage and carouselImages separately as handled
//     profileImage: updatedData.profileImage || existingCandidate.profileImage,
//     carouselImages: updatedData.carouselImages || existingCandidate.carouselImages,
//   };

//   // Check if profile image has been updated
//   if (
//     updatedData.profileImage &&
//     updatedData.profileImage !== existingCandidate.profileImage
//   ) {
//     // If the profile image was removed, delete it from Uploadthing and MongoDB
//     if (deletedImages.profileImage) {
//       console.log("Deleting profile image");
//       const res = await utapi.deleteFiles(extractKeyFromUrl(deletedImages.profileImage)); // Delete the old profile image
//       console.log("🚀 ~ Delete profile image res:", res);
//     }
//   }

//   // Handle carousel image changes
//   if (updatedData.carouselImages && updatedData.carouselImages.length > 0) {
//     // Check for removed carousel images
//     const imagesToDelete = deletedImages.carouselImages.filter(
//       (img) => !updatedData?.carouselImages?.includes(img)
//     );

//     // Delete removed carousel images from Uploadthing
//     if (imagesToDelete.length > 0) {
//       console.log("deleting carousel Images");
//       const res = await utapi.deleteFiles(imagesToDelete.map(extractKeyFromUrl)); // Delete the images no longer needed
//       console.log("🚀 ~ delete carousel Image - res:", res);
//     }
//   }

//   // Update the candidate in the database
//   await prisma.candidate.update({
//     where: { id: candidateId },
//     data: updatedCandidateData, // Update with all the new data including profileImage and carouselImages
//   });

//   console.log("🚀 ~ Candidate updated successfully");
// };
// interface CandidateUpdateData {
//   profileImage?: string | null; // the profile image URL or identifier (nullable if no image)
//   carouselImages?: string[]; // list of carousel image URLs or identifiers (must have at least 1 image)
// }
// export const updateCandidate = async (
//   candidateId: string,
//   updatedData: CandidateUpdateData
// ): Promise<void> => {
//   // Ensure carouselImages is not empty
//   if (updatedData.carouselImages && updatedData.carouselImages.length === 0) {
//     console.error("Carousel images must contain at least one image.");
//     throw new Error("Carousel images must contain at least one image.");
//   }

//   console.log("🚀 ~ Updated candidate data received:", updatedData);

//   // Track the old images from the current candidate (before updating)
//   const existingCandidate: Candidate | null = await prisma.candidate.findUnique({
//     where: { id: candidateId },
//   });

//   // If candidate doesn't exist, we should handle the case appropriately
//   if (!existingCandidate) {
//     console.error("Candidate not found for ID:", candidateId);
//     throw new Error("Candidate not found");
//   }

//   console.log("🚀 ~ Existing candidate data:", existingCandidate);

//   // Track the old images
//   const deletedImages = {
//     profileImage: existingCandidate.profileImage,
//     carouselImages: existingCandidate.carouselImages,
//   };
//   console.log("🚀 ~ Images to be deleted (Old):", deletedImages);

//   // Update candidate data (name, gender, etc.)
//   const updatedCandidateData: any = {
//     ...updatedData,
//     // Only update profileImage and carouselImages separately as handled
//     profileImage: updatedData.profileImage || existingCandidate.profileImage,
//     carouselImages: updatedData.carouselImages || existingCandidate.carouselImages,
//   };

//   console.log("🚀 ~ Updated candidate data after combining with existing:", updatedCandidateData);

//   // Check if profile image has been updated
//   if (
//     updatedData.profileImage &&
//     updatedData.profileImage !== existingCandidate.profileImage
//   ) {
//     // If the profile image was removed, delete it from Uploadthing and MongoDB
//     if (deletedImages.profileImage) {
//       console.log("Deleting old profile image:", deletedImages.profileImage);
//       const res = await utapi.deleteFiles(extractKeyFromUrl(deletedImages.profileImage)); // Delete the old profile image
//       console.log("🚀 ~ Delete profile image res:", res);
//     }
//   }

//   // Handle carousel image changes
//   if (updatedData.carouselImages && updatedData.carouselImages.length > 0) {
//     // Check for removed carousel images
//     const imagesToDelete = deletedImages.carouselImages.filter(
//       (img) => !updatedData?.carouselImages?.includes(img)
//     );

//     console.log("🚀 ~ Images to delete from carousel:", imagesToDelete);

//     // Delete removed carousel images from Uploadthing
//     if (imagesToDelete.length > 0) {
//       console.log("Deleting carousel images:", imagesToDelete);
//       const res = await utapi.deleteFiles(imagesToDelete.map(extractKeyFromUrl)); // Delete the images no longer needed
//       console.log("🚀 ~ Delete carousel image - res:", res);
//     }
//   }

//   // Update the candidate in the database
//   try {
//     console.log("🚀 ~ Updating candidate in database...");
//     await prisma.candidate.update({
//       where: { id: candidateId },
//       data: updatedCandidateData, // Update with all the new data including profileImage and carouselImages
//     });
//     console.log("🚀 ~ Candidate updated successfully in database.");
//   } catch (error) {
//     console.error("🚨 Error updating candidate in the database:", error);
//     throw error;
//   }
// };

// Utility function to extract the key from a URL (if your URL follows this pattern)

export interface ExtendedCandidate {
  id: string | undefined;
  roomId?: string;
  name: string;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string | null; // URL of the profile image
  carouselImages: string[]; // Array of URLs for carousel images
  age: number;
  height: number;
  weight: number;
  hobbies: string[]; // Array of hobbies
}

export const updateCandidate = async (payload: ExtendedCandidate) => {
  try {
    // Find the candidate by candidateId
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: payload.id },
    });

    // If the candidate doesn't exist, return an error
    if (!existingCandidate) {
      return { error: "Candidate not found" };
    }

    // Update the candidate with the new payload
    const updatedCandidate = await prisma.candidate.update({
      where: { id: payload.id },
      data: {
        name: payload.name,
        intro: payload.intro,
        gender: payload.gender,
        major: payload.major,
        profileImage: payload.profileImage || "/user.png",
        carouselImages: payload.carouselImages,
        height: payload.height,
        age: payload.age,
        weight: payload.weight,
        hobbies: payload.hobbies,
        roomId: payload.roomId,
      },
    });
    console.log("🚀 ~ updateCandidate ~ updatedCandidate:", updatedCandidate);

    return { status: "success", data: updatedCandidate };
  } catch (error) {
    console.error("Error updating candidate:", error);
    return { error: "An error occurred while updating the candidate" };
  }
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

export const deleteImage = async (
  imgUrl: string,
  candidateId: string
): Promise<{ success: boolean; deletedCount: number }> => {
  try {
    // Step 1: Perform the deletion from the cloud storage
    const key = extractKeyFromUrl(imgUrl);

    const res = await utapi.deleteFiles(key); // Assuming utapi.deleteFiles is the API call
    console.log("🚀 ~ deleteImage ~ res:", res);

    // Step 2: If the deletion from the cloud was successful, delete from the database
    if (res.success) {
      // Call API to delete the image from the database using candidateId
      await deleteImageFromDatabase(candidateId, imgUrl);
      return {
        success: true,
        deletedCount: res.deletedCount,
      };
    }

    return {
      success: false,
      deletedCount: 0,
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      deletedCount: 0,
    };
  }
};

const deleteImageFromDatabase = async (
  candidateId: string,
  imageUrl: string
) => {
  console.log("Deleting img from db");
  try {
    // First, check if the candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    console.log("🚀 ~ deleteImageFromDatabase ~ candidate:", candidate);

    if (!candidate) {
      throw new Error("Candidate not found.");
    }

    // Step 1: Remove the image from profileImage if it's the profile image being deleted
    if (candidate.profileImage === imageUrl) {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { profileImage: "" }, // Reset profile image field
      });
      console.log(
        `Profile image for candidate ${candidateId} deleted from the database.`
      );
    }

    // Step 2: Remove the image from carouselImages if it's an additional carousel image
    if (candidate.carouselImages.includes(imageUrl)) {
      const res = await prisma.candidate.update({
        where: { id: candidateId },
        data: {
          carouselImages: {
            set: candidate.carouselImages.filter((image) => image !== imageUrl), // Remove image from the array
          },
        },
      });
      console.log("🚀 ~ deleteImageFromDatabase ~ res:", res);
    }

    return { success: true, message: "Image deleted from database." };
  } catch (error) {
    console.error("Error deleting image from database:", error);
    return { success: false, message: "Failed to delete image from database." };
  }
};

export const deleteImages = async (urls: string[]): Promise<void> => {
  if (!urls || urls.length === 0) {
    console.warn("No URLs provided for image deletion.");
    return;
  }

  try {
    const keys = urls.map((url) => extractKeyFromUrl(url));
    console.log(`Deleting images with keys: ${keys}`);
    await utapi.deleteFiles(keys);
    console.log("Images deleted successfully:", urls);
  } catch (error) {
    console.error("Error deleting images:", error);
    throw new Error("Failed to delete the images.");
  }
};

export const getLeaderboardCandidates = async () => {
  try {
    // Fetch active room metadata
    const activeMetadata = await prisma.metadata.findFirst({
      where: { active: true },
    });

    if (!activeMetadata) {
      return { error: "No active room!", topMales: [], topFemales: [], leaderboardCandidate: 5 };
    }

    const { id, leaderboardCandidate = 5 } = activeMetadata;

    await client.connect();
    const db = client.db("selectionv2");

    const candidatesWithVotes = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId: id } },
        {
          $lookup: {
            from: "Vote",
            let: { candidateId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$candidateId", "$$candidateId"] },
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
          $sort: { combinedScore: -1 },
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
          },
        },
      ])
      .toArray();

    // Filter candidates by gender
    const males = candidatesWithVotes.filter(
      (candidate) => candidate.gender === "male"
    );
    const females = candidatesWithVotes.filter(
      (candidate) => candidate.gender === "female"
    );

    // Get the top candidates for each gender based on leaderboardCandidate setting
    const topMales = males.slice(0, leaderboardCandidate);
    const topFemales = females.slice(0, leaderboardCandidate);

    return {
      topMales,
      topFemales,
      leaderboardCandidate,
      title: activeMetadata.title,
    };
  } catch (error) {
    console.error("Error fetching leaderboard candidates:", error);
    throw new Error("Failed to fetch leaderboard candidates.");
  } finally {
    await client.close();
  }
};
