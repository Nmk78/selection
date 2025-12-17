"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Results from "@/components/Result";
import { winnerCandidate } from "@/types/types";
import { Crown, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Confetti from '@/components/Confetti';

export default function ResultsPage() {
  const metadata = useQuery(api.metadata.getActive);
  const topCandidates = useQuery(api.candidates.getTopCandidates);

  if (metadata === undefined || topCandidates === undefined) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <LoaderCircle className="w-12 h-12 animate-spin text-purple-600" />
          <p className="mt-4 text-gray-600 font-medium">
            Hang tight! The announcement is on its way...
          </p>
        </div>
      </main>
    );
  }

  if (!metadata || metadata.round !== "result") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-lg mx-auto rounded-lg shadow-md border border-gray-200">
          <CardHeader className="bg-purple-600 pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold text-white">
              <Crown className="w-5 h-5" />
              <span>Results Not Available</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Selection in Progress</h2>
            <p className="text-gray-600 text-sm">
              Selection is still in progress. Please check back later for the grand reveal!
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { king, queen, prince, princess } = topCandidates;

  if (!king || !queen || !prince || !princess) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-lg mx-auto rounded-lg shadow-md border border-gray-200">
          <CardHeader className="bg-purple-600 pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold text-white">
              <Crown className="w-5 h-5" />
              <span>Results Not Available</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Insufficient Data</h2>
            <p className="text-gray-600 text-sm">
              Not enough candidates to determine winners.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const winners: winnerCandidate[] = [
    { id: king.id, name: king.name, title: "King", profileImage: king.profileImage, votes: king.combinedScore },
    { id: queen.id, name: queen.name, title: "Queen", profileImage: queen.profileImage, votes: queen.combinedScore },
    { id: prince.id, name: prince.name, title: "Prince", profileImage: prince.profileImage, votes: prince.combinedScore },
    { id: princess.id, name: princess.name, title: "Princess", profileImage: princess.profileImage, votes: princess.combinedScore },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center py-6 md:py-10 px-4 bg-gray-50">
      <Confetti />
      
      {/* Header */}
      <div className="text-center mb-6 md:mb-8 w-full max-w-7xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
            PU Selection Winners
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          The grand reveal of our champions
        </p>
      </div>

      {/* Results */}
      <div className="w-full max-w-7xl pb-6">
        <Results results={winners} />
      </div>
    </main>
  );
}
