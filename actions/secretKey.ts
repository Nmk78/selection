"use server";

import { prisma } from "@/lib/prisma";
import { secretKeySchema } from "@/lib/validations";
import { z } from "zod";

export async function insertSecretKeys(userId: string, keys: string[]) {
  console.log("🚀 ~ insertSecretKeys ~ keys:", keys);

  try {
    const validData: any[] = [];

    const activeMetadata = await prisma.metadata.findFirst({
      where: { active: true },
    });

    if (!activeMetadata) {
      throw new Error("No active room!");
    }

    keys.forEach((value, index) => {
      console.log(`🚀 ~ Processing Key ${index + 1}:`, value);

      const validRow = secretKeySchema.parse({
        secretKey: value,
        adminId: userId,
        roomId: activeMetadata.id,
        firstRoundMale: false,
        firstRoundFemale: false,
        secondRoundMale: false,
        secondRoundFemale: false,
      });
      console.log("🚀 ~ keys.forEach ~ validRow:", validRow);

      validData.push(validRow);
    });

    const secretKeys = z.array(secretKeySchema).parse(validData);

    // Store each key in the database
    const insertedKeys = await prisma.secretKey.createMany({
      data: secretKeys,
    });

    // Return success response
    return {
      success: true,
      message: `${insertedKeys.count} secret keys inserted successfully.`,
    };
  } catch (error) {
    console.error("Error inserting secret keys:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      message: "Failed to insert secret keys.",
    };
  }
}

export async function getAllSecretKeys() {
  try {
    // Query the `SecretKey` model to get only the `secretKey` field
    const secretKeys = await prisma.secretKey.findMany({
      select: {
        secretKey: true, // Only select the `secretKey` field
      },
    });
    // console.log("🚀 ~ getAllSecretKeys ~ secretKeys:", secretKeys);

    // Return the list of secret keys
    return {
      success: true,
      data: secretKeys.map((key) => key.secretKey), // Extract secretKey values
    };
  } catch (error) {
    console.error("Error fetching secret keys:", error);
    return {
      success: false,
      message: "Failed to fetch secret keys.",
    };
  }
}


interface KeyStatus {
  isValid: boolean;
  maleVoteFirstRound: boolean;
  femaleVoteFirstRound: boolean;
  maleVoteSecondRound: boolean;
  femaleVoteSecondRound: boolean;
}

export async function validateKey(key: string): Promise<KeyStatus> {
  console.log("🚀 ~ validateKey ~ key:", key);
  // This is a mock implementation. In a real application, you would validate the key against a database.

  // For demonstration, we'll consider keys starting with 'valid' as valid
  const secretKeyRecord = await prisma.secretKey.findUnique({
    where: { secretKey: key },
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

  // Mock voting status based on the key
  const status: KeyStatus = {
    isValid: true,
    maleVoteFirstRound: firstRoundMale,
    femaleVoteFirstRound: firstRoundFemale,
    maleVoteSecondRound: secondRoundMale,
    femaleVoteSecondRound: secondRoundFemale,
  };

  return status;
}
