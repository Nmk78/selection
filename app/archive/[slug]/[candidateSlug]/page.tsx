"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";

export default function CandidatePage() {
  const { slug, candidateSlug } = useParams();
  const metadataSlug = String(slug);
  const candidateSlugStr = String(candidateSlug);

  const data = useQuery(api.archive.getArchivedCandidateBySlug, { 
    slug: candidateSlugStr,
    metadataSlug: metadataSlug
  });

  // Handle loading state
  if (data === undefined) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <p className="text-gray-600">Loading candidate details...</p>
      </div>
    );
  }

  // Handle error state
  if (!data?.success) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            {data?.message || "Failed to load candidate details. Please try again later."}
          </h1>
        </div>
      </div>
    );
  }

  // Pass the fetched candidate details to the `ArchiveCandidateDetailPage`
  return (
    <ArchiveCandidateDetailPage
      archiveId={metadataSlug}
      slug={candidateSlugStr}
      // candidateDetails={data.data}
    />
  );
}

