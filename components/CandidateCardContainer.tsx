// "use client"
// import { Candidate } from "@/types/types"
// import CandidateCard from "./CandidateCard"
// import { useQuery } from "@tanstack/react-query";
// import { getAllCandidates } from "@/actions/candidate";
// import { LoaderCircle } from "lucide-react";

// // const candidates: Candidate[] = [
// //   {
// //     id: '1',
// //     name: 'Emma Johnson',
// //     gender: "female",
// //     major: 'Computer Science',
// //     height: '5\'6"',
// //     weight: '130 lbs',
// //     intro: 'Passionate about technology and community service',
// //     hobbies: ['Coding', 'Volunteering', 'Photography'],
// //     imageUrls: ['/untrack/myat1.jpg', '/untrack/myat.jpg', '/untrack/myat1.jpg'],
// //     profilePic: '/untrack/myat.jpg',
// //   },
// //   {
// //     id: '2',
// //     name: 'Michael Chen',
// //     gender: "female",
// //     major: 'Business Administration',
// //     height: '5\'10"',
// //     weight: '160 lbs',
// //     intro: 'Aspiring entrepreneur with a love for campus activities',
// //     hobbies: ['Basketball', 'Public Speaking', 'Chess'],
// //     imageUrls: ['/untrack/myat1.jpg', '/untrack/myat.jpg', '/untrack/myat1.jpg'],
// //     profilePic: '/untrack/myat.jpg',
// //   },
// //   // Add more candidates as needed
// // ]
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

//SSR
import CandidateCard from "./CandidateCard";
import { getAllCandidates } from "@/actions/candidate"; // Import your action
import { Candidate as BaseCandidate } from "@/types/types";

export interface Candidate extends BaseCandidate {
  id: string; // Add the ID property
}

export default async function CandidateSelection() {
  let candidates: Candidate[] = [];

  try {
    candidates = await getAllCandidates(); // Fetch data using your action
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        No candidates found. Please try again later.
      </div>
    );
  }

  candidates = candidates.sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia">
        PU Selection
      </h1>
      <div className="space-y-6 sm:space-y-8">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
