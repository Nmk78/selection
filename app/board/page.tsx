"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Crown, Trophy, Sparkles, GraduationCap } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader } from "@/components/ui/table";

interface LeaderboardCandidate {
  _id: string;
  // id: string;
  name: string;
  gender: string;
  profileImage: string;
  major: string;
  totalVotes: number;
  totalRating: number;
  combinedScore: number; // Retained in interface but hidden in UI
}

function CandidateCard({
  candidate,
  rank,
  isMale,
}: {
  candidate: LeaderboardCandidate;
  rank: number;
  isMale: boolean;
}) {
  console.log("🚀 ~ CandidateCard ~ rank:", rank)
  return (
    <Link
      href={`/candidate/${candidate._id}`}
      className="group relative flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex-shrink-0"
    >
      {/* Photo */}
      <div className="relative w-10 h-10 md:w-14 md:h-14 min-w-10 md:min-w-14 rounded-full overflow-hidden border-2 border-white shadow-md">
        <Image
          src={candidate.profileImage || "/user.png"}
          alt={candidate.name}
          fill
          className="object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0 flex flex-col w-16 md:w-2/3">
        <h3
          className={`font-semibold text-xs md:text-sm truncate ${
            isMale
              ? "bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent"
          }`}
        >
          {candidate.name}
        </h3>
        <div className="flex items-center gap-1 md:gap-2 mt-0.5">
          <GraduationCap className={`w-3 h-3 ${isMale ? "text-purple-500" : "text-amber-500"}`} />
          <p className="text-xs text-gray-600 truncate">{candidate.major}</p>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
          isMale
            ? "bg-gradient-to-r from-purple-500 to-purple-700"
            : "bg-gradient-to-r from-amber-500 to-amber-700"
        }`}
      />
    </Link>
  );
}

function CandidateCell({
  candidates,
  rank,
  isMale,
}: {
  candidates: LeaderboardCandidate[];
  rank: number;
  isMale: boolean;
}) {
  if (!candidates || candidates.length === 0) {
    return (
      <TableCell className="p-2">
        <div className="flex items-center justify-center min-h-[60px] md:min-h-[80px]">
          <span className="text-gray-400 text-sm">-</span>
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell className="p-2">
      {/* <div className="flex flex-wrap gap-2 md:gap-3 items-start"> */}
      <div className={`grid grid-cols-${candidates.length} gap-1 md:gap-2`}>
        {candidates.map((candidate, index) => (
          <div key={index} className="col-span-1">
            <CandidateCard
              candidate={candidate}
              rank={rank}
              isMale={isMale}
            />
          </div>
        ))}
      </div>
    </TableCell>
  );
}

// --- Leaderboard Table ---

function LeaderboardTable({
  males,
  females,
}: {
  males: LeaderboardCandidate[];
  females: LeaderboardCandidate[];
}) {
  // Sort and rank males separately
  const sortedMales = [...males].sort((a, b) => b.combinedScore - a.combinedScore);
  const maleRanked: Array<{ rank: number; candidates: LeaderboardCandidate[] }> = [];
  let maleCurrentRank = 1;
  
  sortedMales.forEach((candidate, index) => {
    if (candidate.combinedScore === 0) return;
    
    if (index === 0 || sortedMales[index - 1].combinedScore !== candidate.combinedScore) {
      // New score group - calculate rank
      if (index > 0) {
        maleCurrentRank += maleRanked[maleRanked.length - 1].candidates.length;
      }
      maleRanked.push({ rank: maleCurrentRank, candidates: [candidate] });
    } else {
      // Same score - add to current group
      maleRanked[maleRanked.length - 1].candidates.push(candidate);
    }
  });

  // Sort and rank females separately
  const sortedFemales = [...females].sort((a, b) => b.combinedScore - a.combinedScore);
  const femaleRanked: Array<{ rank: number; candidates: LeaderboardCandidate[] }> = [];
  let femaleCurrentRank = 1;
  
  sortedFemales.forEach((candidate, index) => {
    if (candidate.combinedScore === 0) return;
    
    if (index === 0 || sortedFemales[index - 1].combinedScore !== candidate.combinedScore) {
      // New score group - calculate rank
      if (index > 0) {
        femaleCurrentRank += femaleRanked[femaleRanked.length - 1].candidates.length;
      }
      femaleRanked.push({ rank: femaleCurrentRank, candidates: [candidate] });
    } else {
      // Same score - add to current group
      femaleRanked[femaleRanked.length - 1].candidates.push(candidate);
    }
  });

  // Create a map for quick lookup by rank
  const maleByRank: { [rank: number]: LeaderboardCandidate[] } = {};
  maleRanked.forEach((group) => {
    maleByRank[group.rank] = group.candidates;
  });

  const femaleByRank: { [rank: number]: LeaderboardCandidate[] } = {};
  femaleRanked.forEach((group) => {
    femaleByRank[group.rank] = group.candidates;
  });

  // Get all unique ranks from both genders
  const allRanks = new Set<number>();
  maleRanked.forEach((group) => allRanks.add(group.rank));
  femaleRanked.forEach((group) => allRanks.add(group.rank));
  const sortedRanks = Array.from(allRanks).sort((a, b) => a - b);

  const allZero = (males.length === 0 && females.length === 0) || 
    (males.every((c) => c.combinedScore === 0) && females.every((c) => c.combinedScore === 0));

  return (
    <Card className="w-full rounded-2xl shadow-xl border-2 border-gray-200/50 overflow-hidden bg-gradient-to-br from-white to-gray-50/30">
      <CardHeader className="bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 pb-4">
        <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
          <Crown className="w-5 h-5 md:w-6 md:h-6" />
          <span>Live Leaderboard</span>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 w-auto overflow-y-auto">
        {allZero ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm md:text-base">
              Ranking isn&apos;t available yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-gradient-to-r from-purple-50 to-amber-50 z-10 border-b-2 border-gray-200">
              {/* <TableRow className="hover:bg-transparent flex flex-row justify-center">
                <TableHead className="w-16 md:w-20 text-center pt-2 font-bold text-purple-700">
                  Rank
                </TableHead>
                <TableHead className="font-bold w-1/2 text-center pt-2 text-purple-700 border-l-2 border-gray-200">
                  Male Candidates
                </TableHead>
                <TableHead className="font-bold w-1/2 text-center pt-2 text-amber-700 border-l-2 border-gray-200">
                  Female Candidates
                </TableHead>
              </TableRow> */}
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {sortedRanks.map((rank) => {
                  const maleCandidates = maleByRank[rank] || [];
                  const femaleCandidates = femaleByRank[rank] || [];

                  return (
                    <motion.tr
                      key={`rank-${rank}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 20,
                        layout: { duration: 0.4 },
                      }}
                      className="border-b border-gray-100 flex flex-row justify-start hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Rank Cell */}
                      <TableCell
                        className="text-center align-middle flex justify-center p-1 md:p-4"
                        rowSpan={1}
                      >
                        <div className="flex items-center justify-center my-auto">
                          <div
                            className={`w-8 h-8 md:w-12 md:h-12 rounded-full my-auto flex items-center justify-center font-bold text-sm md:text-base shadow-lg ${
                              rank === 1
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                                : rank === 2
                                ? "bg-gradient-to-br from-green-200 to-green-400 text-white"
                                : rank === 3
                                ? "bg-gradient-to-br from-blue-300 to-blue-500 text-white"
                                : "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700"
                            }`}
                          >
                            {rank === 1 ? (
                              <Trophy className="w-4 h-4 md:w-6 md:h-6" />
                            ) : (
                              rank
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Male Candidates - All tied candidates side by side */}
                      {/* <TableCell className=" m-0 p-0 flex justify-center"> */}
                      <CandidateCell
                        candidates={maleCandidates}
                        rank={rank}
                        isMale={true}
                      />
                      {/* </TableCell> */}

                      {/* Female Candidates - All tied candidates side by side */}
                      {/* <TableCell className=" m-0 p-0 flex justify-center"> */}
                      <CandidateCell
                        candidates={femaleCandidates}
                          rank={rank}
                          isMale={false}
                        />
                      {/* </TableCell> */}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main Page Component ---

export default function LeaderboardPage() {
  // Note: Using a fallback array [] if query is null/undefined
  const candidatesQuery = useQuery(api.candidates.getWithStats);
  const candidates: LeaderboardCandidate[] = candidatesQuery || [];
  const isLoading = candidatesQuery === undefined;

  const males = candidates.filter((c) => c.gender === "male");
  const females = candidates.filter((c) => c.gender === "female");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <main className="container w-auto mx-auto px-2 md:px-4 py-4 md:py-8">
      {/* Header */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 md:mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse absolute"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></span>
          </div>
          <h1 className="text-2xl md:text-4xl px-3 font-bold bg-gradient-to-r from-purple-600 via-amber-600 to-purple-600 bg-clip-text text-transparent font-quindelia">
            Live Leaderboard
          </h1>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-500 animate-pulse" />
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Real-time rankings based on votes and ratings
        </p>
      </motion.div> */}

      {/* Single Table with Two Columns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <LeaderboardTable males={males} females={females} />
      </motion.div>
    </main>
  );
}