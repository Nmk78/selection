import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";

interface CandidatePageProps {
  params: {
    archiveId: string;
    id: string;
  };
}

export default function CandidatePage({ params }: CandidatePageProps) {
  const { archiveId, id } = params;
  return <ArchiveCandidateDetailPage archiveId={archiveId} id={id} />;
}
