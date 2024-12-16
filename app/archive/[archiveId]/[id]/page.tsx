import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArchiveCandidateDetailPage } from '@/components/ArchiveCandidateDetails';

export default function CandidatePage() {
  // Use the useRouter hook to access query parameters
  const router = useRouter();
  
  // Get the dynamic route parameters (archiveId and id)
  const { archiveId, id } = router.query;
  
  // Loading state to handle the asynchronous nature of route parameters
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If both parameters are available, stop the loading state
    if (archiveId && id) {
      setLoading(false);
    }
  }, [archiveId, id]);

  // Show loading state until the params are available
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the ArchiveCandidateDetailPage with the params
  return <ArchiveCandidateDetailPage archiveId={String(archiveId)} id={String(id)} />;
}
