"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Trophy } from "lucide-react";
import { winnerCandidate } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ResultsProps {
  results: winnerCandidate[];
}

export default function Results({ results }: ResultsProps) {
  const getTitleConfig = (title: string) => {
    switch (title) {
      case "King":
        return {
          gradient: "from-purple-300 to-purple-400",
          bg: "from-purple-50/50 to-white",
          border: "border-purple-200/50",
          text: "text-purple-700",
          accent: "text-purple-600",
        };
      case "Queen":
        return {
          gradient: "from-amber-300 to-amber-400",
          bg: "from-amber-50/50 to-white",
          border: "border-amber-200/50",
          text: "text-amber-700",
          accent: "text-amber-600",
        };
      case "Prince":
        return {
          gradient: "from-purple-200 to-purple-300",
          bg: "from-purple-50/30 to-white",
          border: "border-purple-200/50",
          text: "text-purple-700",
          accent: "text-purple-600",
        };
      case "Princess":
        return {
          gradient: "from-amber-200 to-amber-300",
          bg: "from-amber-50/30 to-white",
          border: "border-amber-200/50",
          text: "text-amber-700",
          accent: "text-amber-600",
        };
      default:
        return {
          gradient: "from-gray-600 to-gray-700",
          bg: "from-gray-50 to-white",
          border: "border-gray-200",
          text: "text-gray-700",
          accent: "text-gray-600",
        };
    }
  };

  const displayName = (name: string) => {
    const mainName = name.split("(")[0].trim();
    const suffix = name.includes("(") ? name.substring(name.indexOf("(")) : "";
    return { mainName, suffix };
  };

  const isTopTwo = (title: string) => title === "King" || title === "Queen";

  return (
    <div className="w-full mx-auto px-2 md:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {results.map((candidate, index) => {
          const config = getTitleConfig(candidate.title);
          const { mainName, suffix } = displayName(candidate.name);
          const topTwo = isTopTwo(candidate.title);

          return (
            <motion.div
              key={candidate.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden rounded-xl shadow-lg border ${config.border} bg-gradient-to-br ${config.bg} hover:shadow-xl transition-all duration-300 group`}
              >
                {/* Decorative gradient header */}
                <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

                <CardContent className="p-5 md:p-6 flex flex-col items-center">
                  {/* Profile Image */}
                  <div className="relative w-36 h-36 md:w-44 md:h-44 mb-5">
                    <div className={`relative w-full h-full rounded-full overflow-hidden border-[3px] border-white shadow-xl ring-2 ring-offset-2 ring-offset-white group-hover:ring-4 transition-all duration-300 ${
                      config.border.includes('purple') 
                        ? 'ring-purple-200/50 group-hover:ring-purple-300/50' 
                        : 'ring-amber-200/50 group-hover:ring-amber-300/50'
                    }`}>
                      <Image
                        src={candidate.profileImage}
                        alt={`${candidate.title} ${candidate.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Crown Badge */}
                    <div className={`absolute -top-2 -right-2 bg-gradient-to-br ${config.gradient} rounded-full p-2 shadow-lg border-2 border-white`}>
                      <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>

                    {/* Trophy for top two */}
                    {topTwo && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-lg border-2 border-white">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className={`mb-3 px-4 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} text-white`}>
                    <h2 className="text-sm md:text-base font-semibold">
                      {candidate.title}
                    </h2>
                  </div>

                  {/* Name */}
                  <Link
                    href={`/candidate/${candidate.id}`}
                    className="group/name text-center mb-3"
                  >
                    <h3
                      className={`text-xl md:text-2xl font-bold ${config.text} mb-1 group-hover/name:underline transition-all`}
                    >
                      {mainName}
                    </h3>
                    {suffix && (
                      <span className="text-xs md:text-sm text-gray-500">
                        {suffix}
                      </span>
                    )}
                  </Link>

                  {/* Score */}
                  {/* <div className={`mt-2 px-4 py-2 rounded-lg bg-gradient-to-r ${config.gradient} text-white text-sm font-semibold shadow-md`}>
                    {candidate.votes.toFixed(1)} Points
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
