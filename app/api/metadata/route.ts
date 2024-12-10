import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const activeMetadata = await prisma.metadata.findMany({});
    console.log("🚀 ~ GET ~ activeMetadata:", activeMetadata)

    if (!activeMetadata || activeMetadata.length === 0) {
      return NextResponse.json({ error: "No Metadata found" }, { status: 404 });
    }

    return NextResponse.json(activeMetadata);
  } catch (err) {
    console.error("Error fetching metadata:", err);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
