"use server"

import { metadataSchema } from "@/lib/validations";
import { cookies } from "next/headers";
const prisma = require("@prisma/client");

export async function addMetadata(data: FormData) {

    const sessionToken = (await cookies()).get('__session'); // Clerk's session cookie

    if (!sessionToken) {
      throw new Error('User not authenticated');
    }
    
  const db = new prisma.PrismaClient();
  const formValues = Object.fromEntries(data.entries());
  const parsedData = metadataSchema.safeParse(formValues);

  if (!parsedData.success) {
    throw new Error(
      parsedData.error.issues.map((issue) => issue.message).join(", ")
    );
  }

  const { title, description } = parsedData.data;

  // Automatically set  default round
  const metadata = await db.metadata.create({
    data: {
      title,
      description,
      round: "preview", // Default round
    },
  });
  console.log("⚙️ ~ Action ~ metadata:", metadata);

  return metadata;
}
