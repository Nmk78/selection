// Import the useRouter hook from Next.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArchiveCandidateDetailPage } from '@/components/ArchiveCandidateDetails';

export default function CandidatePage() {
  // Get the router object with useRouter hook
  const router = useRouter();
  const { archiveId, id } = router.query; // Destructure params from the query object

  // Optional: Set up state to handle loading or fallback UI
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (archiveId && id) {
      setLoading(false); // Once the params are available, stop loading
    }
  }, [archiveId, id]); // Re-run when the params change

  // If params are not available yet, you can show a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // Pass the params to the ArchiveCandidateDetailPage component
  return <ArchiveCandidateDetailPage archiveId={String(archiveId)} id={String(id)} />;
}
