import { NextRequest } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { prisma } from "@/lib/prisma";

// Configure route segment for long-running connections
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Send initial data
      try {
        const topCandidates = await getTop5Candidates();
        send(JSON.stringify({ type: "initial", data: topCandidates }));
      } catch (error) {
        console.error("Error fetching initial leaderboard:", error);
        send(JSON.stringify({ type: "error", message: "Failed to fetch leaderboard" }));
      }

      // Set up MongoDB change stream
      let changeStream: any = null;
      try {
        const db = await getMongoDb();
        const voteCollection = db.collection("Vote");

        // Watch for changes in the Vote collection
        changeStream = voteCollection.watch([], {
          fullDocument: "updateLookup",
        });

        // Handle change events
        changeStream.on("change", async (change: any) => {
          try {
            console.log("Vote collection changed:", change.operationType);
            
            // Fetch updated leaderboard whenever a vote changes
            const topCandidates = await getTop5Candidates();
            send(JSON.stringify({ type: "update", data: topCandidates }));
          } catch (error) {
            console.error("Error processing change:", error);
            send(JSON.stringify({ type: "error", message: "Failed to process update" }));
          }
        });

        // Handle errors
        changeStream.on("error", (error: Error) => {
          console.error("Change stream error:", error);
          send(JSON.stringify({ type: "error", message: error.message }));
        });

        // Handle close
        changeStream.on("close", () => {
          console.log("Change stream closed");
          controller.close();
        });
      } catch (error) {
        console.error("Error setting up change stream:", error);
        send(JSON.stringify({ type: "error", message: "Failed to set up change stream" }));
      }

      // Clean up on client disconnect
      request.signal.addEventListener("abort", () => {
        if (changeStream) {
          changeStream.close();
        }
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for nginx
    },
  });
}

async function getTop5Candidates() {
  try {
    const activMetadata = await prisma.metadata.findMany({
      where: { active: true },
    });

    if (activMetadata.length === 0) {
      return [];
    }

    const db = await getMongoDb();

    const candidatesWithStats = await db
      .collection("Candidate")
      .aggregate([
        { $match: { roomId: activMetadata[0].id } },
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
            totalVotes: {
              $ifNull: [{ $toInt: { $sum: "$voteDetails.totalVotes" } }, 0],
            },
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
            id: { $toString: "$_id" },
            name: 1,
            gender: 1,
            major: 1,
            profileImage: 1,
            totalVotes: 1,
            totalRating: 1,
            combinedScore: 1,
          },
        },
        {
          $sort: { combinedScore: -1 },
        },
        {
          $limit: 5, // Get top 5
        },
      ])
      .toArray();

    return candidatesWithStats;
  } catch (error) {
    console.error("Error fetching top 5 candidates:", error);
    throw error;
  }
}
