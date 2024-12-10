"use server";

import { metadataSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { NextApiRequest, NextApiResponse } from 'next';
import { Metadata } from "@/types/types";
import { NextResponse } from "next/server";

const prisma = require("@prisma/client");
const db = new prisma.PrismaClient();

export async function addMetadata(data: FormData) {
  "use server"
  const sessionToken = (await cookies()).get("__session"); // Clerk's session cookie

  if (!sessionToken) {
    throw new Error("User not authenticated");
  }
  const formValues = Object.fromEntries(data.entries());
  const parsedData = metadataSchema.safeParse(formValues);

  if (!parsedData.success) {
    throw new Error(
      parsedData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { title, description } = parsedData.data;

  await db.metadata.updateMany({
    where: {
      active: true, // Ensure you're only updating metadata that is currently active
    },
    data: {
      active: false, // Set active to false for all active metadata entries
    },
  });
  
  // Automatically set  default round
  const metadata = await db.metadata.create({
    data: {
      title,
      description,
      active: true,
      round: "preview", // Default round
    },
  });
  console.log("⚙️ ~ Action ~ metadata:", metadata);

  return metadata;
}



export const getMetadata = async () => {
  try {
    const metadata = await db.metadata.findMany({
      // where: { active: true },
    });
    console.log("🚀 ~ getMetadata ~ metadata:", metadata)
    return metadata;
  } catch (err) {
    console.error("Error fetching metadata:", err);
    throw new Error("Failed to fetch metadata.");
  }
};


export async function setActiveMetadata(id:string) {
  // Check if the user is authenticated
  const sessionToken = (await cookies()).get("__session"); // Clerk's session cookie
  if (!sessionToken) {
    throw new Error("User not authenticated");
  }

  try {
    // Deactivate all existing active metadata
    await db.metadata.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // Activate the specified metadata
    const updatedMetadata = await db.metadata.update({
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