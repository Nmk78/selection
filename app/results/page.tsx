"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Results from "@/components/Result";
import { winnerCandidate } from "@/types/types";
import { Crown, LoaderCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Confetti from '@/components/Confetti';

export default function ResultsPage() {
  const metadata = useQuery(api.metadata.getActive);
  const topCandidates = useQuery(api.candidates.getTopCandidates);

  if (metadata === undefined || topCandidates === undefined) {
    return (
      <main className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-romantic-bg to-romantic-secondary">
        <div className="flex flex-col items-center justify-center">
          <LoaderCircle className="w-12 h-12 animate-spin text-romantic-accent" />
          <p className="mt-4 text-romantic-text animate-pulse">
            Hang tight! The announcement is on its way...
          </p>
        </div>
      </main>
    );
  }

  if (!metadata || metadata.round !== "result") {
    return (
      <main className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-romantic-bg to-romantic-secondary">
        <Card className="w-full max-w-md mt-24 mx-auto backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-Caccent animate-pulse" />
            <h2 className="text-2xl font-bold text-Cprimary mb-2">Results Not Available</h2>
            <p className="text-Csecondary">Selection is still in progress. Please check back later for the grand reveal!</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { king, queen, prince, princess } = topCandidates;

  if (!king || !queen || !prince || !princess) {
    return (
      <main className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-romantic-bg to-romantic-secondary">
        <Card className="w-full max-w-md mt-24 mx-auto backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-Caccent animate-pulse" />
            <h2 className="text-2xl font-bold text-Cprimary mb-2">Results Not Available</h2>
            <p className="text-Csecondary">Not enough candidates to determine winners.</p>
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
    <main className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-romantic-bg to-romantic-secondary">
      <Confetti />
      <Results results={winners} />
    </main>
  );
}
