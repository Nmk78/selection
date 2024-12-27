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

export const revalidate = 0; // Disable caching entirely for this page

export default async function JudgeVotingPage() {
  let candidates: Candidate[] = [];
  let round: string | null = null;

  try {
    const metadata = await getMetadata();
    round = metadata[0]?.round ?? null;
    console.log("🚀 ~ JudgeVotingPage ~ round:", round);

    if (round === "second" || round === "secondPreview") {
      const { topMales, topFemales } = await getCandidatesForJudge();
      candidates = [...topMales, ...topFemales];
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  console.log("🚀 ~ JudgeVotingPage ~ round:", round);

  if (round !== "second" && round !== "secondPreview") {
    console.log("🚀 ~ JudgeVotingPage ~ round:", round);

    return (
      <div className="container mx-auto py-8 px-4 mt-60 md:mt-52">
        {process.env.NODE_ENV !== "production" && (
          <span title="This indicator will only seen in development env">
            Round {round}
          </span>
        )}
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

  console.log("🚀 ~ JudgeVotingPage ~ round:", round);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        Judge Voting Panel
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
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
          </div>
        }
      >
        <JudgeVoting candidates={candidates} />
      </Suspense>
    </div>
  );
}
