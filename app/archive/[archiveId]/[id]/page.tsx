import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";

interface CandidatePageProps {
  params: Promise<{ archiveId: string; id: string }>;
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const resolvedParams = await params;
  const { archiveId, id } = resolvedParams;

  return <ArchiveCandidateDetailPage archiveId={archiveId} id={id} />;
}
