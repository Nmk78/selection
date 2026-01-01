"use client";

import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";

interface ArchiveCandidatePageClientProps {
  archiveId: string;
  slug: string;
}

export default function ArchiveCandidatePageClient({ 
  archiveId, 
  slug 
}: ArchiveCandidatePageClientProps) {
  return (
    <ArchiveCandidateDetailPage
      archiveId={archiveId}
      slug={slug}
    />
  );
}

