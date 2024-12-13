// app/actions/candidates.js

"use server";

import { prisma } from "@/lib/prisma";
import { candidateSchema } from "@/lib/validations";
import { Candidate } from "@/types/types";

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

import { MongoClient } from "mongodb";

//@ts-ignore
const client = new MongoClient(process.env.DATABASE_URL);

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
            totalRating: { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] }, // Sum the ratings
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
          $sort: { totalVotes: -1 }, // Sort by totalVotes in descending order
        },
      ])
      .toArray();

    // console.log("🚀 ~ candidatesWithStats:", candidatesWithStats);

    // const candidatesWithStats = await db
    //   .collection("Candidate")
    //   .aggregate([
    //     { $match: { roomId: activMetadata[0].id } }, // Filter by roomId
    //     {
    //       $lookup: {
    //         from: "Vote", // Join with the Vote collection
    //         let: { candidateId: { $toString: "$_id" } }, // Convert ObjectId to string
    //         pipeline: [
    //           { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } }, // Compare with Vote.candidateId
    //         ],
    //         as: "voteDetails", // Store the joined data in this field
    //       },
    //     },
    //     {
    //       $addFields: {
    //         totalVotes: {
    //           $ifNull: [{ $toInt: { $size: "$voteDetails" } }, 0],
    //         },
    //         totalRating: { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] }, // Sum the ratings
    //       },
    //     },
    //     {
    //       $project: {
    //         id: { $toString: "$_id" }, // Convert _id to string
    //         name: 1,
    //         gender: 1,
    //         major: 1,
    //         totalVotes: 1,
    //         totalRating: 1,
    //       },
    //     },
    //   ])
    //   .toArray();
    // console.log("🚀 ~ candidatesWithStats:", candidatesWithStats);

    return candidatesWithStats;
  } catch (error) {
    console.error("Error fetching candidates with stats:", error);
    throw new Error("Failed to fetch candidates");
  } finally {
    await client.close();
  }
};

export const getCandidatesForSecondRound = async (roomId: string, maleForSecondRound: number , femaleForSecondRound: number ) => {
  try {
    const activMetadata = await prisma.metadata.findMany({
      where: { active: true },
    });

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
              $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0], // Count the number of votes
            },
            totalRating: {
              $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0], // Sum the ratings
            },
          },
        },
        {
          $project: {
            id: { $toString: "$_id" }, // Convert _id to string
            name: 1,
            gender: 1,
            major: 1,
            totalVotes: 1,
            totalRating: 1,
          },
        },
        {
          $sort: { totalVotes: -1 }, // Sort by totalVotes in descending order
        },
      ])
      .toArray();

    // Separate candidates by gender
    const maleCandidates = candidatesWithStats.filter((candidate) => candidate.gender === "male");
    const femaleCandidates = candidatesWithStats.filter((candidate) => candidate.gender === "female");

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

    // console.log("🚀 ~ getCandidatesForSecondRound ~ topMales:", topMales);
    // console.log("🚀 ~ getCandidatesForSecondRound ~ topFemales:", topFemales);
    // console.log("🚀 ~ getCandidatesForSecondRound ~ eligibleCandidates:", eligibleCandidates);

    return { topMales, topFemales, eligibleCandidates };
  } catch (error) {
    console.error("Error fetching candidates for second round:", error);
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

export async function updateCandidate(id: string, data: any) {
  return await prisma.candidate.update({
    where: { id },
    data,
  });
}

export async function deleteCandidate(id: string) {
  return await prisma.candidate.delete({
    where: { id },
  });
}
