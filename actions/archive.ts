"use server";
import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma client
import { Document, MongoClient, ObjectId } from "mongodb";

//@ts-ignore
const client = new MongoClient(process.env.DATABASE_URL);

export async function archiveMetadata() {
  try {
    // Fetch all metadata that are not active
    const nonActiveMetadata = await prisma.metadata.findMany({
      where: { active: false },
    });
    console.log("🚀 ~ archiveMetadata ~ nonActiveMetadata:", nonActiveMetadata);

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
    await client.connect();
    const db = client.db("selectionv2");

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
  } finally {
    await client.close();
  }
};

export const getArchivedCandidateById = async (candidateId: string) => {
  try {
    // Ensure the MongoDB client is connected
    await client.connect();
    const db = client.db("selectionv2");

    // Fetch candidate details by ID
    const candidate = await db.collection("Candidate").findOne({
      _id: new ObjectId(candidateId), // Convert candidateId to ObjectId
    });

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found.",
      };
    }

    // Fetch the metadata for the candidate, which includes roomId, title, and year
    const metadata = await prisma.metadata.findFirst({
      where: { id: candidate.roomId }, // Use candidate.roomId to find metadata
    });

    if (!metadata) {
      return {
        success: false,
        message: "Metadata not found for this candidate.",
      };
    }

    // Extract the title and roomId from metadata (e.g., room and title for the position)
    const room = metadata.title || null; // Assuming title represents the room in your case

    // Fetch the votes for this candidate
    const votes = await db
      .collection("Votes")
      .find({ candidateId: new ObjectId(candidateId) })
      .toArray();

    // Calculate the title based on votes
    const allVotes = await db.collection("Votes").find({}).toArray(); // Get all votes

    // Separate male and female votes
    const maleVotes = allVotes.filter((vote) => vote.gender === "male");
    const femaleVotes = allVotes.filter((vote) => vote.gender === "female");

    // Count votes for each male candidate
    // Define the type for a vote
    interface Vote {
      candidateId: string | ObjectId; // candidateId can be ObjectId or a string
      gender: "male" | "female";
    }

    // Count votes for each male candidate
    const maleVoteCounts = maleVotes.reduce<Record<string, number>>(
      (acc, vote) => {
        const candidateId = vote.candidateId.toString(); // Ensure the key is a string
        acc[candidateId] = (acc[candidateId] || 0) + 1;
        return acc;
      },
      {}
    );

    // Count votes for each female candidate
    const femaleVoteCounts = femaleVotes.reduce<Record<string, number>>(
      (acc, vote) => {
        const candidateId = vote.candidateId.toString(); // Ensure the key is a string
        acc[candidateId] = (acc[candidateId] || 0) + 1;
        return acc;
      },
      {}
    );

    // Sort male and female candidates by votes in descending order
    const sortedMaleVotes = Object.entries(maleVoteCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const sortedFemaleVotes = Object.entries(femaleVoteCounts).sort(
      (a, b) => b[1] - a[1]
    );

    // Determine titles (King, Queen, Prince, Princess)
    const kingId = sortedMaleVotes[0]?.[0]; // Most voted male candidate
    const queenId = sortedFemaleVotes[0]?.[0]; // Most voted female candidate
    const princeId = sortedMaleVotes[1]?.[0]; // Second most voted male candidate
    const princessId = sortedFemaleVotes[1]?.[0]; // Second most voted female candidate

    // Determine the title for the candidate based on their ID
    let title: string | null = null;
    if (candidate._id.toString() === kingId) {
      title = "King";
    } else if (candidate._id.toString() === queenId) {
      title = "Queen";
    } else if (candidate._id.toString() === princeId) {
      title = "Prince";
    } else if (candidate._id.toString() === princessId) {
      title = "Princess";
    }

    // Return candidate data with calculated title and room from metadata
    return {
      success: true,
      data: {
        id: candidate._id.toString(), // Convert ObjectId to string for the response
        name: candidate.name,
        title: title, // Determined by votes (King, Queen, Prince, Princess)
        room: room, // From metadata (room information)
        intro: candidate.intro,
        gender: candidate.gender,
        major: candidate.major,
        profileImage: candidate.profileImage,
        carouselImages: candidate.carouselImages,
        height: candidate.height,
        age: candidate.age,
        weight: candidate.weight,
        hobbies: candidate.hobbies,
      },
    };
  } catch (error) {
    console.error("Error fetching archived candidate:", error);
    return {
      success: false,
      message: "Failed to fetch candidate data.",
    };
  } finally {
    // Ensure the MongoDB client is properly closed
    await client.close();
  }
};
