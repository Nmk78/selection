import { Suspense } from "react";
import { notFound } from "next/navigation";
import CandidateDetails from "@/components/CandidateDetails";
import { LoaderCircle } from "lucide-react";
import { getCandidateById } from "@/actions/candidate";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
        <Suspense
          fallback={
            <Card className="w-full max-w-4xl mx-auto bg-Cbackground rounded-none shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Section Skeleton */}
                  <div className="w-full md:w-1/2 space-y-4">
                    {/* Profile Image Skeleton */}
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-300 animate-pulse"></div>
                  </div>

                  {/* Right Section Skeleton */}
                  <div className="w-full md:w-1/2 space-y-4">
                    {/* Name Skeleton */}
                    <div className="h-8 bg-gray-300 animate-pulse rounded-md w-1/2"></div>

                    {/* Major, Age, Height, Weight Skeletons */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                    </div>

                    {/* About Section Skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-300 animate-pulse rounded-md w-1/2"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                    </div>

                    {/* Hobbies Section Skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-300 animate-pulse rounded-md w-1/2"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                      <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4"></div>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Full-body Image Carousel Skeleton */}
              <div className="w-full px-4 md:px-6 pb-4 md:pb-6">
                <div className="w-full mx-auto rounded-lg overflow-hidden bg-gray-300 animate-pulse h-72"></div>
              </div>

              {/* Footer Skeleton */}
              <CardFooter className="flex justify-center p-4 md:p-6 bg-romantic-Csecondary bg-opacity-30">
                <div className="w-full md:w-1/2 h-10 bg-gray-300 animate-pulse rounded-md"></div>
              </CardFooter>
            </Card>
          }
        >
          {/* Pass params.id to the CandidateContent component */}
          <CandidateContent id={params.id} />
        </Suspense>
      </main>
    </div>
  );
}
