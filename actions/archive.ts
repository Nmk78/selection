"use server"
import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma client
import { MongoClient } from "mongodb";

//@ts-ignore
const client = new MongoClient(process.env.DATABASE_URL);

export async function archiveMetadata() {
  try {
    // Fetch all metadata that are not active
    const nonActiveMetadata = await prisma.metadata.findMany({
      where: { active: false },
    });
    console.log("🚀 ~ archiveMetadata ~ nonActiveMetadata:", nonActiveMetadata)

    if (!nonActiveMetadata || nonActiveMetadata.length === 0) {
      return {
        success: false,
        message: "No non-active metadata found.",
        data: [],
      };
    }

    return {
      success: true,
      data: nonActiveMetadata,
    };
  } catch (error) {
    console.error("Error loading non-active metadata:", error);
    return {
      success: false,
      message: "Failed to load non-active metadata.",
    };
  }
}


export const getCandidatesWithStatsAndTitles = async (roomId: string) => {
  try {
    await client.connect();
    const db = client.db("selectionv2");

    // Fetch candidates and their stats for the specific room
    const candidatesWithStats = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId } }, // Filter by specific roomId
        {
          $lookup: {
            from: "Vote", // Join with the Vote collection
            let: { candidateId: { $toString: "$_id" } }, // Convert ObjectId to string
            pipeline: [
              { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } }, // Match votes for the candidate
            ],
            as: "voteDetails",
          },
        },
        {
          $addFields: {
            totalVotes: {
              $ifNull: [{ $sum: "$voteDetails.totalVotes" }, 0], // Sum totalVotes
            },
            totalRating: {
              $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0], // Sum totalRating
            },
            combinedScore: {
              $add: [
                { $ifNull: [{ $sum: "$voteDetails.totalVotes" }, 0] },
                { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
              ], // Combined score for sorting
            },
          },
        },
        {
          $project: {
            id: "$_id", // MongoDB ObjectId as id
            roomId: 1,
            name: 1,
            title: 1,
            intro: 1,
            gender: 1,
            major: 1,
            profileImage: 1,
            carouselImages: 1,
            height: 1,
            age: 1,
            weight: 1,
            hobbies: 1,
            totalVotes: 1,
            totalRating: 1,
            combinedScore: 1,
          },
        },
        { $sort: { combinedScore: -1 } }, // Sort by combinedScore in descending order
      ])
      .toArray();

    // Separate candidates by gender
    const males = candidatesWithStats.filter((candidate: { gender: string }) => candidate.gender === "male");
    const females = candidatesWithStats.filter((candidate: { gender: string }) => candidate.gender === "female");

    // Assign titles to the top males and females
    const assignTitles = (list: any[], titles: string[]) => {
      return list.map((candidate: any, index: string | number) => ({
        ...candidate,
        title: titles[index] || null, // Assign titles to top candidates, null for others
      }));
    };

    const maleTitles = ["King", "Prince"];
    const femaleTitles = ["Queen", "Princess"];

    const titledMales = assignTitles(males, maleTitles);
    const titledFemales = assignTitles(females, femaleTitles);

    // Combine titled candidates with other candidates
    const allCandidatesWithTitles = [...titledMales, ...titledFemales];
    console.log("🚀 ~ getCandidatesWithStatsAndTitles ~ allCandidatesWithTitles:", allCandidatesWithTitles);

    return {
      success: true,
      data: allCandidatesWithTitles,
    };
  } catch (error) {
    console.error("Error fetching candidates with stats and titles:", error);
    return {
      success: false,
      message: "Failed to fetch candidates.",
    };
  } finally {
    await client.close();
  }
};
