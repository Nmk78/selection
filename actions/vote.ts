"use server";
import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma client
import { MongoClient } from "mongodb";
import { getCandidatesForSecondRound } from "./candidate";

export async function voteForCandidate(candidateId: string, secretKey: string) {
  try {
    // Fetch the secret key details
    const secretKeyRecord = await prisma.secretKey.findUnique({
      where: { secretKey },
    });

    if (!secretKeyRecord) {
      throw new Error("Invalid secret key.");
    }

    const {
      roomId,
      firstRoundMale,
      firstRoundFemale,
      secondRoundMale,
      secondRoundFemale,
    } = secretKeyRecord;

    // Fetch the current metadata (active room and round)
    const currentRoom = await prisma.metadata.findFirst({
      where: { active: true },
    });

    if (!currentRoom) {
      throw new Error("No active round found.");
    }

    const { round, maleForSecondRound, femaleForSecondRound } = currentRoom;

    if (round !== "first" && round !== "second") {
      throw new Error("Voting is closed.");
    }

    // Check the candidate's gender
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error("Invalid candidate.");
    }

    const { gender } = candidate; // Assuming the candidate model has a gender field

    if (
      (round === "first" && gender === "male" && firstRoundMale) ||
      (round === "first" && gender === "female" && firstRoundFemale) ||
      (round === "second" && gender === "male" && secondRoundMale) ||
      (round === "second" && gender === "female" && secondRoundFemale)
    ) {
      console.log("📍📍📍Already used");
      return {
        success: false,
        message: "Key was already used for this gender in this round!",
      };
    }

    // Handle first round voting
    if (round === "first") {
      // Fetch or create a vote record
      const voteRecord = await prisma.vote.findFirst({
        where: {
          candidateId,
          roomId,
        },
      });

      if (!voteRecord) {
        // Create a new vote record
        const res = await prisma.vote.create({
          data: {
            roomId,
            candidateId,
            totalVotes: 1,
          },
        });
        console.log("🚀 ~ voteForCandidate create ~ res:", res);

        // Update secretKey for gender-specific voting
        const voteres = await prisma.secretKey.update({
          where: { secretKey },
          data: {
            firstRoundMale: gender === "male" ? true : firstRoundMale,
            firstRoundFemale: gender === "female" ? true : firstRoundFemale,
          },
        });
        console.log("🚀 ~ voteForCandidate update ~ voteres:", voteres);
      } else {
        // Increment vote count for the existing record
        const res = await prisma.vote.update({
          where: { id: voteRecord.id },
          data: {
            totalVotes: voteRecord.totalVotes + 1,
          },
        });
        console.log("🚀 ~ voteForCandidate update ~ res:", res);
        const voteres = await prisma.secretKey.update({
          where: { secretKey },
          data: {
            firstRoundMale: gender === "male" ? true : firstRoundMale,
            firstRoundFemale: gender === "female" ? true : firstRoundFemale,
          },
        });
        console.log("🚀 ~ voteForCandidate update ~ voteres:", voteres);
      }
    } else if (round === "second") {
      try {
        // Fetch eligible candidates for the second round
        let res = await getCandidatesForSecondRound(
          roomId,
          maleForSecondRound,
          femaleForSecondRound
        );
        console.log("🚀 ~ voteForCandidate ~ res:", res);

        const { eligibleCandidates, topMales, topFemales } = res;

        // Check if the candidate is eligible
        if (!eligibleCandidates.includes(candidateId)) {
          throw new Error(
            "Candidate is not eligible for votes in the second round."
          );
        }

        if (
          (gender === "male" && !topMales.some((c) => c.id === candidateId)) ||
          (gender === "female" && !topFemales.some((c) => c.id === candidateId))
        ) {
          throw new Error(
            "This candidate is not eligible based on the gender for this round."
          );
        }

        // Proceed with adding a vote for the valid candidate
        const voteRecord = await prisma.vote.findFirst({
          where: { candidateId, roomId },
        });

        if (!voteRecord) {
          const res = await prisma.vote.create({
            data: {
              roomId,
              candidateId,
              totalVotes: 1,
            },
          });
          const voteres = await prisma.secretKey.update({
            where: { secretKey },
            data: {
              secondRoundMale: gender === "male" ? true : secondRoundMale,
              secondRoundFemale: gender === "female" ? true : secondRoundFemale,
            },
          });
          console.log("🚀 ~ voteForCandidate create ~ res:", res);
          return {
            success: true,
            message: "Vote successfully cast for the candidate.",
          };
        } else {
          const res = await prisma.vote.update({
            where: { id: voteRecord.id },
            data: {
              totalVotes: voteRecord.totalVotes + 1,
            },
          });
          const voteres = await prisma.secretKey.update({
            where: { secretKey },
            data: {
              secondRoundMale: gender === "male" ? true : secondRoundMale,
              secondRoundFemale: gender === "female" ? true : secondRoundFemale,
            },
          });
          console.log("🚀 ~ voteForCandidate update ~ res:", res);
          return {
            success: true,
            message: "Vote successfully cast for the candidate.",
          };
        }
      } catch (error) {
        console.error("Error in second round voting:", error);
        //@ts-ignore
        throw new Error(
          error.message || "An error occurred while casting the vote."
        );
      }
    }

    return { success: true, message: "Vote successfully recorded." };
  } catch (error) {
    console.log("🚀 ~ voteForCandidate ~ error:", error);
    //@ts-ignore
    return { success: false, message: error.message };
  }
}
