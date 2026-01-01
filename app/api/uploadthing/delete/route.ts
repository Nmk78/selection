import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/app/server/uploadthing";

export async function POST(request: NextRequest) {
  try {
    const { fileKeys } = await request.json();

    if (!fileKeys || !Array.isArray(fileKeys) || fileKeys.length === 0) {
      return NextResponse.json(
        { error: "File keys are required" },
        { status: 400 }
      );
    }

    // Delete files from UploadThing
    const result = await utapi.deleteFiles(fileKeys);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting files from UploadThing:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 }
    );
  }
}

