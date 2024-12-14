import { Suspense } from 'react';
import { getTopCandidates } from "@/actions/candidate";
import { getMetadata } from "@/actions/metadata";
import Results from "@/components/Result";
import { winnerCandidate } from "@/types/types";
import { Crown, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Confetti from '@/components/Confetti';

async function ResultsContent() {
  const metadata = await getMetadata();

  if (metadata[0].round !== "result") {
    return (
      <Card className="w-full max-w-md mx-auto bg-romantic-bg/90 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-romantic-accent animate-pulse" />
          <h2 className="text-2xl font-bold text-romantic-primary mb-2">Results Not Available</h2>
          <p className="text-romantic-text">Selection is still in progress. Please check back later for the grand reveal!</p>
        </CardContent>
      </Card>
    );
  }

  const data = await getTopCandidates();

  const royaltyData: winnerCandidate[] = [
    { id: data.king.candidateId, name: data.king.name, title: "King", profileImage: data.king.profileImage, votes: data.king.totalVotes + data.king.totalRating },
    { id: data.queen.candidateId, name: data.queen.name, title: "Queen", profileImage: data.queen.profileImage, votes: data.queen.totalVotes + data.queen.totalRating },
    { id: data.prince.candidateId, name: data.prince.name, title: "Prince", profileImage: data.prince.profileImage, votes: data.prince.totalVotes + data.prince.totalRating },
    { id: data.princess.candidateId, name: data.princess.name, title: "Princess", profileImage: data.princess.profileImage, votes: data.princess.totalVotes + data.princess.totalRating },
  ];

  return (
    <>
      <Confetti />
      <Results results={royaltyData} />
    </>
  );
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-romantic-bg to-romantic-secondary">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-romantic-accent" />
          <p className="mt-4 text-romantic-text">Preparing the royal announcement...</p>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </main>
  );
}

