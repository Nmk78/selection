"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import JudgeVoting from "@/components/JudgeVoting";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Gavel, Crown, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function JudgeVotingPage() {
  const metadata = useQuery(api.metadata.getActive);
  const candidatesData = useQuery(api.candidates.getForJudge);

  if (metadata === undefined || candidatesData === undefined) {
    return (
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gavel className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-amber-600 to-purple-600 bg-clip-text text-transparent">
              Judge Voting Panel
            </h1>
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
          </div>
        </motion.div>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="space-y-4 w-full max-w-md">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0 space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
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
          <span className="text-xs text-gray-400" title="This indicator will only seen in development env">
            Development Log: Round {round}
          </span>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gavel className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-amber-600 to-purple-600 bg-clip-text text-transparent">
              Judge Voting Panel
            </h1>
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
          </div>
          <Card className="max-w-2xl mx-auto mt-8 bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200/50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-100 to-amber-100">
                  <Crown className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Round Not Available
              </h2>
              <p className="text-gray-600">
                The judge voting will be available in the second round. Please wait
                for the round to start.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const candidates = [...candidatesData.topMales, ...candidatesData.topFemales];

  return (
    <div className="container mx-auto py-6 md:py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gavel className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-amber-600 to-purple-600 bg-clip-text text-transparent">
            Judge Voting Panel
          </h1>
          <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          <p className="text-sm md:text-base text-gray-600">
            Rate candidates on Dressing, Performance, and Q&A (1-10 scale)
          </p>
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        </div>
      </motion.div>
      <JudgeVoting candidates={candidates} />
    </div>
  );
}
