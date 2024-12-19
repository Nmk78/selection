// import { Suspense } from "react";
// import { getCandidatesForJudge } from "@/actions/candidate";
// import { getMetadata } from "@/actions/metadata";
// import JudgeVoting from "@/components/JudgeVoting";

// type Candidate = {
//   id: string;
//   name: string;
//   age: number;
//   gender: "male" | "female";
//   height: number;
//   weight: number;
//   major: string;
//   intro: string;
//   hobbies: string[]; // Array of hobbies as strings
//   profileImage: string; // URL to the profile image
//   carouselImages: string[]; // Array of image URLs for the carousel
// };

// export default async function JudgeVotingPage() {
//   let candidates: Candidate[] = [];
//   let round: string | null = null;

//   try {
//     // Fetch round metadata
//     const metadata = await getMetadata();
//     round = metadata[0]?.round ?? null;
//     console.log("🚀 ~ JudgeVotingPage ~ round:", round)

//     // Check if it's the second round
//     if (round === "second") {
//       // Fetch data dynamically for the second round
//       const { topMales, topFemales } = await getCandidatesForJudge();
//       candidates = [...topMales, ...topFemales];
//     }
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//   }

//   // Display a message if it's not the second round
//   if (round !== "second") {
//     return (
//       <div className="container mx-auto py-8 px-4 mt-60 md:mt-52">
//         <h1 className="text-3xl font-bold text-center mb-8">
//           Judge Voting Panel
//         </h1>
//         <p className="text-center text-gray-500">
//           The judge voting will be available in the second round. Please wait
//           for the round to start.
//         </p>
//       </div>
//     );
//   }

//   console.log("🚀 ~ JudgeVotingPage ~ candidates:", candidates)

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold text-center mb-8">
//         Judge Voting Panel
//       </h1>
//       <Suspense fallback={<div>Loading...</div>}>
//         {/* Pass candidates dynamically */}
//         <JudgeVoting candidates={candidates} />
//       </Suspense>
//     </div>
//   );
// }

import { Suspense } from "react";
import { getCandidatesForJudge } from "@/actions/candidate";
import { getMetadata } from "@/actions/metadata";
import JudgeVoting from "@/components/JudgeVoting";
import { Skeleton } from "@/components/ui/skeleton";

type Candidate = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  major: string;
  intro: string;
  hobbies: string[];
  profileImage: string;
  carouselImages: string[];
};

export default async function JudgeVotingPage() {
  let candidates: Candidate[] = [];
  let round: string | null = null;

  try {
    const metadata = await getMetadata();
    round = metadata[0]?.round ?? null;
    console.log("🚀 ~ JudgeVotingPage ~ round:", round);

    if (round === "second") {
      const { topMales, topFemales } = await getCandidatesForJudge();
      candidates = [...topMales, ...topFemales];
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  if (round !== "second") {
    return (
      <div className="container mx-auto py-8 px-4 mt-60 md:mt-52">
        <h1 className="text-3xl font-bold text-center mb-8">
          Judge Voting Panel
        </h1>
        <p className="text-center text-gray-500">
          The judge voting will be available in the second round. Please wait
          for the round to start.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Judge Voting Panel
      </h1>
      <Suspense
        fallback={
          <div className="space-y-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <JudgeVoting candidates={candidates} />
      </Suspense>
    </div>
  );
}
