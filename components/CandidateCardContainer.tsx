// "use client"
// import { Candidate } from "@/types/types"
// import CandidateCard from "./CandidateCard"
// import { useQuery } from "@tanstack/react-query";
// import { getAllCandidates } from "@/actions/candidate";
// import { LoaderCircle } from "lucide-react";

// export default function CandidateSelection() {

// const {
//   data: candidates,
//   error,
//   isLoading,
// } = useQuery({
//   queryKey: ["allCandidates"], // Caching key
//   queryFn: async () => {
//     const response = await getAllCandidates();
//     return response; // Ensure it returns an array of image URLs
//   },
// });

// if (isLoading) {
//   return (
//     <div className="flex items-center justify-center h-[60vh]">
//       <LoaderCircle className="w-10 h-10 animate-spin" />
//     </div>
//   );
// }

// if (error || !candidates || candidates.length === 0) {
//   return (
//     <div className="flex items-center justify-center h-[60vh] text-red-500">
//       Failed to load candidates. Please try again.
//     </div>
//   );
// }

//   return (
//     <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
//       <h1 className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia">PU Selection</h1>
//       <div className="space-y-6 sm:space-y-8">
//         {candidates.map((candidate) => (
//           <CandidateCard key={candidate.id} candidate={candidate} />
//         ))}
//       </div>
//     </div>
//   )
// }
// INFO SSR
import CandidateCard from "./CandidateCard";
import {
  getAllCandidates,
  getCandidatesForSecondRound,
} from "@/actions/candidate";
import { getMetadata } from "@/actions/metadata";
import { Candidate as BaseCandidate } from "@/types/types";
import FilterDropdown from "./FilterDropDown";
import { Metadata } from "@prisma/client";

export interface Candidate extends BaseCandidate {
  id: string; // Add the ID property
}

interface Props {
  searchParams?: { filter?: string };
}

export default async function CandidateSelection({ searchParams }: Props) {
  const filter = searchParams?.filter || "mix"; // Default to 'mix'
  console.log("🚀 ~ CandidateSelection ~ filter:", filter);
  let candidates: Candidate[] = [];
  let topMale: any[] = [];
  let topFemale: any[] = [];
  let eligibleCandidates: Candidate[] = [];
  let isSecondRound = false;

  try {
    // Fetch metadata to determine the current round
    const metadata: Metadata[] = await getMetadata();
    isSecondRound = metadata[0].round === "second";

    let secondRoundData;
    if (isSecondRound) {
      try {
        secondRoundData = await getCandidatesForSecondRound();
      } catch (error) {
        console.error("Error fetching candidates for second round:", error);
        // Handle fallback or retry logic if necessary
      }
      if (!secondRoundData) {
        return;
      }

      topMale = secondRoundData.topMales;
      topFemale = secondRoundData.topFemales;

      // Apply filtering logic for second round
      if (filter === "male-first") {
        eligibleCandidates = [...topMale, ...topFemale];
        console.log("🚀 Male first", eligibleCandidates);
      } else if (filter === "female-first") {
        eligibleCandidates = [...topFemale, ...topMale];
        console.log("🚀 female first", eligibleCandidates);
      } else {
        eligibleCandidates = [...topMale, ...topFemale];
        eligibleCandidates = eligibleCandidates.sort(() => Math.random() - 0.5); // Randomize order
      }
      console.log(
        "🚀 ~ CandidateSelection ~ eligibleCandidates:",
        eligibleCandidates
      );
    } else {
      const allCandidates = await getAllCandidates();
      const males = allCandidates.filter(
        (candidate) => candidate.gender === "male"
      );
      const females = allCandidates.filter(
        (candidate) => candidate.gender === "female"
      );
      // Apply filtering logic for first round
      if (filter === "male-first") {
        candidates = [...males, ...females]
      } else if (filter === "female-first") {
        candidates = [...females, ...males]

      } else {
         candidates = allCandidates.sort(() => Math.random() - 0.5);
      }
    }
  } catch (error) {
    console.error("Error fetching candidates or metadata:", error);
  }

  // Handle no candidates found for first or second round
  if (!isSecondRound && (!candidates || candidates.length === 0)) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        No candidates found. Please try again later.
      </div>
    );
  }

  if (isSecondRound && eligibleCandidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        No second-round candidates found. Please try again later.
      </div>
    );
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

      {/* Render candidates based on current round and filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {(isSecondRound ? eligibleCandidates : candidates).map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
