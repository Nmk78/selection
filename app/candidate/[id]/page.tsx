import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CandidateDetails from "@/components/CandidateDetails";
import { LoaderCircle } from 'lucide-react';
import { getCandidateById } from '@/actions/candidate';

interface CandidatePageProps {
  params: {
    id: string;
  };
}

// This function handles the logic of fetching candidate data asynchronously.
async function CandidateContent({ id }: { id: string }) {
  const candidateData = await getCandidateById(id);

  if (!candidateData) {
    notFound(); // Redirect to 404 page if no candidate is found.
  }

  return <CandidateDetails {...candidateData} />; // Render the CandidateDetails component
}

// The main component that is responsible for rendering the page.
export default function CandidatePage({ params }: CandidatePageProps) {
  return (
    <div className="w-full min-h-screen bg-Cbackground px-0 py-0 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64 w-full">
            <LoaderCircle className="w-10 h-10 animate-spin text-Cprimary" />
          </div>
        }>
          {/* Pass params.id to the CandidateContent component */}
          <CandidateContent id={params.id} />
        </Suspense>
      </main>
    </div>
  );
}
