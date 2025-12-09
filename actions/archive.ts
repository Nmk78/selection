"use server";
import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma client
import { getMongoDb } from "@/lib/mongodb";
import { Document } from "mongodb";
import { getTopCandidates } from "./candidate";

export async function getArchiveMetadatas() {
  try {
    // Fetch all metadata that are not active
    const nonActiveMetadata = await prisma.metadata.findMany({
      where: { active: false },
    });
    // console.log("🚀 ~ getArchiveMetadatas ~ nonActiveMetadata:", nonActiveMetadata);

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
export async function getArchiveMetadatasById(id:string) {
  try {
    // Fetch all metadata that are not active
    const metadata = await prisma.metadata.findMany({
      where: { id },
    });
    // console.log("🚀 ~ getArchiveMetadatas ~ metadata:", metadata);

    if (!metadata || metadata.length === 0) {
      return {
        success: false,
        message: "No metadata found.",
        data: [],
      };
    }

    return {
      success: true,
      data: metadata,
    };
  } catch (error) {
    console.error("Error loading non-active metadata:", error);
    return {
      success: false,
      message: "Failed to load non-active metadata.",
    };
  }
}

// export const getCandidatesWithStatsAndTitles = async (roomId: string) => {
//   try {
//     await client.connect();
//     const db = client.db("selectionv2");

//     // Fetch candidates and their stats for the specific room
//     const candidatesWithStats = await db
//       .collection("Candidate")
//       .aggregate([
//         { $match: { roomId } }, // Filter by specific roomId
//         {
//           $lookup: {
//             from: "Vote", // Join with the Vote collection
//             let: { candidateId: { $toString: "$_id" } }, // Convert ObjectId to string
//             pipeline: [
//               { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } }, // Match votes for the candidate
//             ],
//             as: "voteDetails",
//           },
//         },
//         {
//           $addFields: {
//             totalVotes: {
//               $ifNull: [{ $sum: "$voteDetails.totalVotes" }, 0], // Sum totalVotes
//             },
//             totalRating: {
//               $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0], // Sum totalRating
//             },
//             combinedScore: {
//               $add: [
//                 { $ifNull: [{ $sum: "$voteDetails.totalVotes" }, 0] },
//                 { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
//               ], // Combined score for sorting
//             },
//           },
//         },
//         {
//           $project: {
//             id: "$_id", // MongoDB ObjectId as id
//             roomId: 1,
//             name: 1,
//             title: 1,
//             intro: 1,
//             gender: 1,
//             major: 1,
//             profileImage: 1,
//             carouselImages: 1,
//             height: 1,
//             age: 1,
//             weight: 1,
//             hobbies: 1,
//             totalVotes: 1,
//             totalRating: 1,
//             combinedScore: 1,
//           },
//         },
//         { $sort: { combinedScore: -1 } }, // Sort by combinedScore in descending order
//       ])
//       .toArray();

//     // Separate candidates by gender
//     const males = candidatesWithStats.filter(
//       (candidate: { gender: string }) => candidate.gender === "male"
//     );
//     const females = candidatesWithStats.filter(
//       (candidate: { gender: string }) => candidate.gender === "female"
//     );

//     // Assign titles to the top males and females
//     const assignTitles = (list: any[], titles: string[]) => {
//       return list.map((candidate: any, index: string | number) => ({
//         ...candidate,
//         title: titles[index] || null, // Assign titles to top candidates, null for others
//       }));
//     };

//     const maleTitles = ["King", "Prince"];
//     const femaleTitles = ["Queen", "Princess"];

//     const titledMales = assignTitles(males, maleTitles);
//     const titledFemales = assignTitles(females, femaleTitles);

//     // Combine titled candidates with other candidates
//     const allCandidatesWithTitles = [...titledMales, ...titledFemales];
//     console.log(
//       "🚀 ~ getCandidatesWithStatsAndTitles ~ allCandidatesWithTitles:",
//       allCandidatesWithTitles
//     );

//     return {
//       success: true,
//       data: allCandidatesWithTitles,
//     };
//   } catch (error) {
//     console.error("Error fetching candidates with stats and titles:", error);
//     return {
//       success: false,
//       message: "Failed to fetch candidates.",
//     };
//   } finally {
//     await client.close();
//   }
// };

interface Candidate {
  id: string;
  roomId: string;
  name: string;
  title: string | null;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string;
  carouselImages: string[];
  height: number;
  age: number;
  weight: number;
  hobbies: string[];
  totalVotes: number;
  totalRating: number;
  combinedScore: number;
}

export const getCandidatesWithStatsAndTitles = async (roomId: string) => {
  try {
    const db = await getMongoDb();

    const candidatesWithStatsDocuments: Document[] = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId } },
        {
          $lookup: {
            from: "Vote",
            let: { candidateId: { $toString: "$_id" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$candidateId", "$$candidateId"] } } },
            ],
            as: "voteDetails",
          },
        },
        {
          $addFields: {
            totalVotes: { $ifNull: [{ $sum: "$voteDetails.totalVotes" }, 0] },
            totalRating: { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
            combinedScore: {
              $add: [
                { $ifNull: [{ $sum: "$voteDetails.totalVotes" }, 0] },
                { $ifNull: [{ $sum: "$voteDetails.totalRating" }, 0] },
              ],
            },
          },
        },
        {
          $project: {
            id: "$_id",
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
        { $sort: { combinedScore: -1 } },
      ])
      .toArray();

    // Transform Document[] to Candidate[]
    const candidatesWithStats: Candidate[] = candidatesWithStatsDocuments.map(
      (doc) => ({
        id: doc.id, // Assuming `_id` was renamed to `id` in the aggregation's `$project`
        roomId: doc.roomId,
        name: doc.name,
        title: doc.title || null,
        intro: doc.intro,
        gender: doc.gender as "male" | "female", // Type assertion for gender
        major: doc.major,
        profileImage: doc.profileImage,
        carouselImages: doc.carouselImages || [],
        height: doc.height,
        age: doc.age,
        weight: doc.weight,
        hobbies: doc.hobbies || [],
        totalVotes: doc.totalVotes || 0,
        totalRating: doc.totalRating || 0,
        combinedScore: doc.combinedScore || 0,
      })
    );

    // Separate candidates by gender
    const males = candidatesWithStats.filter(
      (candidate) => candidate.gender === "male"
    );
    const females = candidatesWithStats.filter(
      (candidate) => candidate.gender === "female"
    );

    // Assign titles to the top males and females
    const assignTitles = (list: Candidate[], titles: string[]) => {
      return list.map((candidate, index) => ({
        ...candidate,
        title: titles[index] || null,
      }));
    };

    const maleTitles = ["King", "Prince"];
    const femaleTitles = ["Queen", "Princess"];

    const titledMales = assignTitles(males, maleTitles);
    const titledFemales = assignTitles(females, femaleTitles);

    // Combine titled candidates with other candidates
    const allCandidatesWithTitles = [...titledMales, ...titledFemales];
    console.log(
      "🚀 ~ getCandidatesWithStatsAndTitles ~ allCandidatesWithTitles:",
      allCandidatesWithTitles
    );

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
  }
};

export const getArchivedCandidateById = async (candidateId: string) => {
  try {
    // Fetch the candidate by ID using Prisma
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found.",
      };
    }

    // Fetch metadata using the roomId from the candidate
    const metadata = candidate.roomId
      ? await prisma.metadata.findUnique({
          where: { id: candidate.roomId },
        })
      : null;

    const room = metadata?.title || null; // Use metadata.title as the room name

    // Fetch top candidates to determine the title
    const { king, queen, prince, princess } = await getTopCandidatesFromArchive(candidate.roomId);
    console.log("🚀 ~ getArchivedCandidateById ~ king:", king)

    // Determine the title for the current candidate
    let title: string | null = null;
    if (king && king._id.toString() === candidate.id) {
      title = "King";
    } else if (queen && queen._id.toString() === candidate.id) {
      title = "Queen";
    } else if (prince && prince._id.toString() === candidate.id) {
      title = "Prince";
    } else if (princess && princess._id.toString() === candidate.id) {
      title = "Princess";
    }

    console.log("data", {
      id: candidate.id,
      name: candidate.name,
      title,
      room,
      intro: candidate.intro,
      gender: candidate.gender,
      major: candidate.major,
      profileImage: candidate.profileImage,
      carouselImages: candidate.carouselImages || [],
      height: candidate.height,
      age: candidate.age,
      weight: candidate.weight,
      hobbies: candidate.hobbies || [],
    })
    // Return the merged data
    return {
      success: true,
      data: {
        id: candidate.id,
        name: candidate.name,
        title,
        room,
        intro: candidate.intro,
        gender: candidate.gender,
        major: candidate.major,
        profileImage: candidate.profileImage,
        carouselImages: candidate.carouselImages || [],
        height: candidate.height,
        age: candidate.age,
        weight: candidate.weight,
        hobbies: candidate.hobbies || [],
      },
    };
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    return {
      success: false,
      message: "Failed to fetch candidate data.",
    };
  }
};


export const getTopCandidatesFromArchive = async (roomId:string) => {
  try {
    const db = await getMongoDb();

    const candidatesCollection = db.collection("Candidate");

    // Fetch active room metadata
   


    // Aggregate the candidates with their votes and ratings
    const candidatesWithVotes = await candidatesCollection
      .aggregate([
        { $match: { roomId: roomId } }, // Filter by roomId
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
  }
};
