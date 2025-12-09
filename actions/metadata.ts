"use server";

import { metadataSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Round } from "@prisma/client";

export async function addMetadata(data: FormData) {
  "use server";

  // Authentication
  const sessionToken = (await cookies()).get("__session"); // Clerk's session cookie
  if (!sessionToken) {
    throw new Error("User not authenticated");
  }

  // Parse FormData to an object
  const formValues = Object.fromEntries(data.entries());
  console.log("🚀 ~ addMetadata ~ formValues:", formValues);

  // Convert specific fields to integers
  const formValuesWithParsedInts = {
    ...formValues,
    maleForSecondRound: parseInt(formValues.maleForSecondRound as string, 10),
    femaleForSecondRound: parseInt(formValues.femaleForSecondRound as string, 10),
    leaderboardCandidate: parseInt(formValues.leaderboardCandidate as string, 10) || 5,
  };

  console.log(
    "🚀 ~ addMetadata ~ formValuesWithParsedInts:",
    formValuesWithParsedInts
  );

  // Validate using the schema
  const parsedData = metadataSchema.safeParse(formValuesWithParsedInts);
  console.log("🚀 ~ addMetadata ~ parsedData:", parsedData);

  if (!parsedData.success) {
    throw new Error(
      parsedData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { title, description, maleForSecondRound, femaleForSecondRound, leaderboardCandidate } =
    parsedData.data;

  // Set previous active metadata entries to inactive
  await prisma.metadata.updateMany({
    where: {
      active: true,
    },
    data: {
      active: false,
    },
  });

  // Create new metadata entry
  const metadata = await prisma.metadata.create({
    data: {
      title,
      description,
      maleForSecondRound,
      femaleForSecondRound,
      leaderboardCandidate,
      active: true,
      round: "preview", // Default round
    },
  });

  console.log("⚙️ ~ Action ~ metadata:", metadata);

  return metadata;
}


export const getMetadata = async () => {
  try {
    const metadata = await prisma.metadata.findMany({
      orderBy: {
        updatedAt: "desc", // Sort by creation date, latest first
      },
    });
    console.log("🚀 ~ getMetadata ~ metadata:", [...metadata]);
    return [...metadata];
  } catch (err) {
    console.error("Error fetching metadata:", err);
    throw new Error("Failed to fetch metadata.");
  }
};

export const getActiveMetadata = async () => {
  try {
    const activeMetadata = await prisma.metadata.findMany({
      where: { active: true },
    });
    console.log("🚀 ~ getActiveMetadata ~ Activemetadata:", activeMetadata);
    return activeMetadata;
  } catch (err) {
    console.error("Error fetching activeMetadata:", err);
    throw new Error("Failed to fetch activeMetadata.");
  }
};
export async function setActiveMetadata(id: string) {
  // Check if the user is authenticated
  const sessionToken = (await cookies()).get("__session"); // Clerk's session cookie
  if (!sessionToken) {
    throw new Error("User not authenticated");
  }

  try {
    // Deactivate all existing active metadata
    await prisma.metadata.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // Activate the specified metadata
    const updatedMetadata = await prisma.metadata.update({
      where: { id: id },
      data: { active: true },
    });

    console.log("⚙️ ~ Updated Active Metadata:", updatedMetadata);

    return updatedMetadata;
  } catch (err) {
    console.error("Error setting active metadata:", err);
    throw new Error("Unable to set active metadata.");
  }
}

export const getAllCandidateImages = async () => {
  const activeMetadata = await prisma.metadata.findMany({
    where: { active: true },
  });
  if (!activeMetadata) {
    throw new Error("Metadata ID (roomId) is required");
  }

  try {
    // Fetch candidates belonging to the given roomId
    const candidates = await prisma.candidate.findMany({
      where: {
        roomId: activeMetadata[0].id,
      },
      select: {
        // profileImage: true,
        carouselImages: true,
      },
    });

    // Collect all images
    const allImages = candidates.flatMap(candidate => [
      // candidate.profileImage,
      ...candidate.carouselImages,
    ]);

    return allImages;
  } catch (error) {
    console.error("Error fetching candidate images:", error);
    throw new Error("Failed to fetch candidate images");
  }
};


type UpdateRoundInput = {
  id: string; // Metadata ID
  round: Round; // New Round Value
};

export async function updateRound({ id, round }: UpdateRoundInput) {
  if (!id || !round) {
    throw new Error("Invalid inputs to updateRound.");
  }

  console.log("⚠️⚠️⚠️⚠️⚠️⚠️ ~ updateRound ~ id, round:", id, round);

  try {
    const updatedMetadata = await prisma.metadata.update({
      where: { id: id },
      data: { round },
    });

    return updatedMetadata;
  } catch (error) {
    console.error("Failed to update round:", error);
    throw error; // Let the error propagate to the caller
  }
}
