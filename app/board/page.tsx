"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardCandidate {
  id: string;
  name: string;
  gender: "male" | "female";
  major: string;
  profileImage: string | null;
  totalVotes: number;
  totalRating: number;
  combinedScore: number;
}

const rankIcons = [
  <Crown key="1" className="w-6 h-6 text-yellow-500" />,
  <Trophy key="2" className="w-6 h-6 text-gray-400" />,
  <Medal key="3" className="w-6 h-6 text-amber-600" />,
  <Award key="4" className="w-6 h-6 text-blue-500" />,
  <Award key="5" className="w-6 h-6 text-purple-500" />,
];

const rankColors = [
  "bg-gradient-to-r from-yellow-400 to-yellow-600",
  "bg-gradient-to-r from-gray-300 to-gray-500",
  "bg-gradient-to-r from-amber-400 to-amber-600",
  "bg-gradient-to-r from-blue-400 to-blue-600",
  "bg-gradient-to-r from-purple-400 to-purple-600",
];

export default function LeaderboardPage() {
  const [candidates, setCandidates] = useState<LeaderboardCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource("/api/leaderboard/stream");

        eventSource.onopen = () => {
          console.log("Connected to leaderboard stream");
          setIsLoading(false);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.type === "initial" || message.type === "update") {
              setCandidates(message.data || []);
              setIsLoading(false);
              setError(null);
            } else if (message.type === "error") {
              setError(message.message || "An error occurred");
              setIsLoading(false);
            }
          } catch (err) {
            console.error("Error parsing SSE message:", err);
            setError("Failed to parse update");
          }
        };

        eventSource.onerror = (err) => {
          console.error("SSE error:", err);
          setError("Connection error. Attempting to reconnect...");
          setIsLoading(false);
          
          // Close and reconnect after a delay
          if (eventSource) {
            eventSource.close();
          }
          
          setTimeout(() => {
            connect();
          }, 3000);
        };
      } catch (err) {
        console.error("Error setting up SSE:", err);
        setError("Failed to connect to leaderboard");
        setIsLoading(false);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Live Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Top 5 Candidates - Updates in Real-Time
          </p>
        </div>

        {isLoading && candidates.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
          </div>
        )}

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden border-2 ${
                    index < 3 ? "shadow-lg" : "shadow-md"
                  }`}
                >
                  <CardContent className="p-0">
                    <div
                      className={`${rankColors[index]} p-4 flex items-center gap-4`}
                    >
                      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                        {rankIcons[index]}
                      </div>

                      <div className="flex-shrink-0 w-20 h-20 relative rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                        <Image
                          src={candidate.profileImage || "/user.png"}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl md:text-2xl font-bold text-white truncate">
                            #{index + 1} {candidate.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-white/30"
                          >
                            {candidate.gender === "male" ? "Male" : "Female"}
                          </Badge>
                        </div>
                        <p className="text-white/90 text-sm md:text-base truncate">
                          {candidate.major}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[120px]">
                          <div className="flex items-center gap-1 justify-end mb-1">
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <span className="text-white font-bold text-lg">
                              {candidate.combinedScore}
                            </span>
                          </div>
                          <div className="text-white/80 text-xs space-y-0.5">
                            <div>Votes: {candidate.totalVotes}</div>
                            <div>Rating: {candidate.totalRating}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isLoading && candidates.length === 0 && !error && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No candidates found. The leaderboard will appear here once voting begins.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
            Live updates enabled
          </p>
        </div>
      </div>
    </div>
  );
}
