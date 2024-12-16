import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";

type Params = Promise<{ archiveId: string; id: string }>;

export default async function CandidatePage({ params }: { params: Params }) {
  const resolvedParams = await params; // Await the promise to get the resolved values
  const { archiveId, id } = resolvedParams;

  return <ArchiveCandidateDetailPage id={id} archiveId={archiveId} />;
}
