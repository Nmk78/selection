"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import CandidateDetailsComponent from "@/components/CandidateDetails";
import { LoaderCircle } from "lucide-react";

export default function CandidatePage() {
  const { id } = useParams();
  const candidateId = id as Id<"candidates">;

  const candidate = useQuery(api.candidates.getById, { id: candidateId });

  if (candidate === undefined) {
    return (
      <div className="w-full min-h-screen bg-Cbackground flex items-center justify-center">
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="w-full min-h-screen bg-Cbackground flex items-center justify-center">
        <p className="text-red-500">Candidate not found</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-Cbackground px-0 py-0 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-Cbackground md:my-5 rounded-none shadow-lg">
          <CandidateDetailsComponent
            id={candidate._id}
            name={candidate.name}
            major={candidate.major}
            age={candidate.age}
            gender={candidate.gender}
            height={candidate.height}
            weight={candidate.weight}
            intro={candidate.intro}
            hobbies={candidate.hobbies}
            carouselImages={candidate.carouselImages}
            profileImage={candidate.profileImage}
          />
        </div>
      </main>
    </div>
  );
}
