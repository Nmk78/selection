"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User } from "lucide-react"; // Added User icon for fallback
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  peers,
  candidate,
}: {
  peers: number;
  candidate: LeaderboardCandidate;
}) {
  return (
    <Link href={`/candidate/${candidate._id}`} className="flex flex-grow items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
      <div className="relative w-10 h-10 min-w-10 rounded-full overflow-hidden">
        <Image
          src={candidate.profileImage || "/user.png"}
          alt={candidate.name}
          fill
          className="object-cover rounded-full"
        />
      </div>

      <div className={`flex-grow min-w-0 ${peers > 2 ? "w-1" : ""}`}>
        <h3 className="font-semibold text-gray-800 truncate">
          {candidate.name} {candidate.combinedScore}
        </h3>
        <p className="text-sm text-gray-500 truncate">{candidate.major}</p>
        {/* <p className="text-sm text-gray-500 truncate">{candidate.combinedScore}</p> */}
      </div>
    </Link>
  );
}

// --- Leaderboard Column ---

function LeaderboardColumn({
  title,
  candidates,
  icon,
}: {
  title: string;
  candidates: LeaderboardCandidate[];
  icon: React.ReactNode;
}) {
  // 1. Sort by score
  const sorted = [...candidates].sort(
    (a, b) => b.combinedScore - a.combinedScore
  );

  // 2. Group ties (logic remains robust)
  const groups: LeaderboardCandidate[][] = [];
  sorted.forEach((c) => {
    if (
      groups.length === 0 ||
      groups[groups.length - 1][0].combinedScore !== c.combinedScore
    ) {
      groups.push([c]);
    } else {
      groups[groups.length - 1].push(c);
    }
  });

  const allZero =
    candidates.length > 0 && candidates.every((c) => c.combinedScore === 0);

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-700">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 flex flex-col justify-start">
        {candidates.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No candidates yet</p>
        ) : allZero ? (
          <p className="text-center text-gray-400 py-8">
            Ranking isn&apos;t available yet
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {groups.map((group, index) => {
              return (
                <motion.div
                  key={group.map((c) => c._id).join("-")}
                  // Apply layout only to the ranking group container for smoother reordering (less lag)
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    height: 0, // Animates height for smooth removal
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    layout: { duration: 0.4 }, // Fine-tune layout transition speed
                  }}
                  className={`m-0 transition-all duration-300`}
                >
                  {/* Tied candidates appear side-by-side with wrapping */}
                  <div className="flex flex-row justify-center items-center flex-wrap gap-2">
                    <span className=" font-quindelia text-primary">{index + 1}</span>

                    {group.map((candidate) => (
                      <motion.div
                        layout
                        layoutId={candidate._id}
                        key={candidate._id}
                        className="flex-grow"
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 20,
                        }}
                      >
                        <CandidateCard
                          peers={group.length}
                          candidate={candidate}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <main className="container max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8 flex items-center justify-center gap-3 font-quindelia">
        <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 font-quindelia">
          Live Leaderboard
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <LeaderboardColumn
          title="Male Candidates"
          candidates={males}
          icon={<User className="w-6 h-6 text-blue-500" />}
        />
        <LeaderboardColumn
          title="Female Candidates"
          candidates={females}
          icon={<User className="w-6 h-6 text-pink-500" />}
        />
      </div>
    </main>
  );
}