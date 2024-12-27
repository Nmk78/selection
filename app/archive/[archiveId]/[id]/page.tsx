"use client";

import { useParams } from "next/navigation"; // Import useParams
import { useQuery } from "@tanstack/react-query";
import { ArchiveCandidateDetailPage } from "@/components/ArchiveCandidateDetails";
import { getArchivedCandidateById } from "@/actions/archive";
import { getCandidateById } from "@/actions/candidate";

type Params = Promise<{ id: string }>;

async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;

  // Fetch the candidate data using the ID
  const candidate = await getCandidateById(id);

  if (!candidate) {
    return {
      title: "Candidate Not Found",
      description: "The requested candidate could not be found.",
    };
  }

  // Generate metadata dynamically
  return {
    title: `${candidate.name} - Candidate Profile`,
    description: `Explore the profile of ${candidate.name}, a participant in the selection process. Learn more about their hobbies, major, and achievements.`,
    openGraph: {
      title: `${candidate.name}'s Profile`,
      description: `Discover ${candidate.name}'s journey in the selection process.`,
      url: `${process.env.BASE_URL}/candidates/${id}`,
      images: [
        {
          url: candidate.profileImage, // Use the candidate's profile image
          alt: `${candidate.name}'s profile image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${candidate.name}'s Profile`,
      description: `Check out ${candidate.name}'s details and achievements in the selection process.`,
      images: [candidate.profileImage],
    },
  };
}

export default function CandidatePage() {
  const { archiveId, id } = useParams(); // Extract route parameters

  // Use React Query to fetch candidate details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["candidateDetails", id],
    queryFn: async () => {
      if (!id) throw new Error("Candidate ID is missing"); // Guard against invalid parameters
      return getArchivedCandidateById(String(id));
    },
    enabled: !!id, // Ensure the query runs only when `id` is defined
    retry: 1, // Retry failed requests once
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <p className="text-gray-600">Loading candidate details...</p>
      </div>
    );
  }

  // Handle error state
  if (isError || !data?.success) {
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
      archiveId={String(archiveId)}
      id={String(id)}
      candidateDetails={data.data} // Pass only the candidate data
    />
  );
}
