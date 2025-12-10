"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import JudgeVoting from "@/components/JudgeVoting";
import { Skeleton } from "@/components/ui/skeleton";

export default function JudgeVotingPage() {
  const metadata = useQuery(api.metadata.getActive);
  const candidatesData = useQuery(api.candidates.getForJudge);

  if (metadata === undefined || candidatesData === undefined) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Judge Voting Panel
        </h1>
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
      </div>
    );
  }

  const round = metadata?.round ?? null;

  if (round !== "second" && round !== "secondPreview") {
    return (
      <div className="container mx-auto py-8 px-4 mt-60 md:mt-52">
        {process.env.NODE_ENV !== "production" && (
          <span title="This indicator will only seen in development env">
          Development Log:  Round {round}
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

  const candidates = [...candidatesData.topMales, ...candidatesData.topFemales];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        Judge Voting Panel
      </h1>
      <JudgeVoting candidates={candidates} />
    </div>
  );
}
