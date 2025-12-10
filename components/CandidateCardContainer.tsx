"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CandidateCard from "./CandidateCard";
import FilterDropdown from "./FilterDropDown";
import { LoaderCircle } from "lucide-react";

export interface Candidate {
  id: string;
  name: string;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string;
  carouselImages: string[];
  height: number;
  age: number;
  weight: number;
  hobbies: string[];
}

interface Props {
  filter?: string;
}

export default function CandidateSelection({ filter = "mix" }: Props) {
  const allCandidates = useQuery(api.candidates.getAll);

  if (allCandidates === undefined) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!allCandidates || allCandidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        No candidates found. Please try again later.
      </div>
    );
  }

  // Filter and sort candidates
  const males = allCandidates.filter((candidate) => candidate.gender === "male");
  const females = allCandidates.filter((candidate) => candidate.gender === "female");

  let candidates;
  if (filter === "male-first") {
    candidates = [...males, ...females];
  } else if (filter === "female-first") {
    candidates = [...females, ...males];
  } else {
    // Mix - randomize order
    candidates = [...allCandidates].sort(() => Math.random() - 0.5);
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia">
        PU Selection
      </h1>

      {/* Filter Dropdown */}
      <div className="flex justify-end mb-6">
        <FilterDropdown defaultValue={filter} />
      </div>

      {/* Render candidates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            candidate={{
              id: candidate._id,
              name: candidate.name,
              intro: candidate.intro,
              gender: candidate.gender,
              major: candidate.major,
              profileImage: candidate.profileImage,
              carouselImages: candidate.carouselImages,
              height: candidate.height,
              age: candidate.age,
              weight: candidate.weight,
              hobbies: candidate.hobbies,
            }}
          />
        ))}
      </div>
    </div>
  );
}
