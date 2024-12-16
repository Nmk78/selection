// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error


import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";

interface CandidatePageProps {
  params: {
    archiveId: string;
    id: string;
  };
}

export default function CandidatePage({ params: { archiveId, id } }: CandidatePageProps) {
  return <ArchiveCandidateDetailPage archiveId={archiveId} id={id} />;
}
