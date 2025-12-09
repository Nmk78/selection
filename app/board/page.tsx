"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeaderboardCandidates } from "@/actions/candidate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Trophy, Medal, Loader2 } from "lucide-react";
import Image from "next/image";

interface LeaderboardCandidate {
  id: string;
  name: string;
  gender: string;
  profileImage: string;
  major: string;
  totalVotes: number;
  totalRating: number;
  combinedScore: number;
}

interface LeaderboardData {
  topMales: LeaderboardCandidate[];
  topFemales: LeaderboardCandidate[];
  leaderboardCandidate: number;
  title?: string;
  error?: string;
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Trophy className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center font-bold text-Cprimary">{rank}</span>;
  }
}

function getRankBgColor(rank: number) {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300";
    case 2:
      return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300";
    case 3:
      return "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300";
    default:
      return "bg-white border-gray-200";
  }
}

function CandidateCard({ candidate, rank }: { candidate: LeaderboardCandidate; rank: number }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRankBgColor(rank)}`}
    >
      <div className="flex-shrink-0">
        {getRankIcon(rank)}
      </div>
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-Cprimary">
        <Image
          src={candidate.profileImage || "/user.png"}
          alt={candidate.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-Ctext truncate">{candidate.name}</h3>
        <p className="text-sm text-Csecondary truncate">{candidate.major}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-Cprimary">{candidate.combinedScore}</p>
        <p className="text-xs text-Csecondary">points</p>
      </div>
    </div>
  );
}

function LeaderboardColumn({ title, candidates, icon }: { title: string; candidates: LeaderboardCandidate[]; icon: React.ReactNode }) {
  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidates.length === 0 ? (
          <p className="text-center text-Csecondary py-8">No candidates yet</p>
        ) : (
          candidates.map((candidate, index) => (
            <CandidateCard key={candidate.id} candidate={candidate} rank={index + 1} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function LeaderboardPage() {
  const { data, isLoading, error } = useQuery<LeaderboardData>({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboardCandidates,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    refetchIntervalInBackground: true,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-Cprimary" />
        <p className="mt-4 text-Csecondary">Loading leaderboard...</p>
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Crown className="w-16 h-16 text-Caccent animate-pulse" />
        <h2 className="text-2xl font-bold text-Cprimary mt-4">Leaderboard Unavailable</h2>
        <p className="text-Csecondary mt-2">{data?.error || "Unable to load leaderboard data"}</p>
      </div>
    );
  }

  return (
    <main className="container max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-Cprimary font-quindelia">
          Live Leaderboard
        </h1>
        {data?.title && (
          <p className="text-Csecondary mt-2">{data.title}</p>
        )}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Updates
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <LeaderboardColumn
          title="Top Male Candidates"
          candidates={data?.topMales || []}
          icon={<Crown className="w-6 h-6 text-blue-500" />}
        />
        <LeaderboardColumn
          title="Top Female Candidates"
          candidates={data?.topFemales || []}
          icon={<Crown className="w-6 h-6 text-pink-500" />}
        />
      </div>

      <div className="text-center mt-8 text-sm text-Csecondary">
        <p>Updates automatically every 5 seconds</p>
      </div>
    </main>
  );
}
