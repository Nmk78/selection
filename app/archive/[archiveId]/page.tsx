"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCandidatesWithStatsAndTitles } from "@/actions/archive";
import { useEffect, useState } from "react";

// Define the Candidate type
interface Candidate {
  id: string;
  name: string;
  title: "King" | "Queen" | "Prince" | "Princess";
  profileImage: string;
  details: string;
}

export default function YearArchivePage({
  params,
}: {
  params: { archiveId: string };
}) {
  const [pastCandidates, setPastCandidates] = useState<Candidate[]>([]);

  //TODO to use useQuery
  useEffect(() => {
    const fetchCandidates = async () => {
      const res = await getCandidatesWithStatsAndTitles(params.archiveId);
      if (res.success) {
        setPastCandidates(res.data); // Set the candidates data into state
      }
    };
    fetchCandidates();
  }, [params.archiveId]); // Fetch candidates when archiveId changes

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-gradient-2 text-4xl sm:text-5xl md:text-6xl font-script text-romantic-primary text-center mb-8 sm:mb-12 shadow-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Selected Students
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {pastCandidates.length > 0 ? (
          pastCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-80 md:w-96 mx-auto group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={candidate.profileImage}
                  alt={candidate.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h2 className="text-2xl sm:text-3xl font-script mb-2">
                    {candidate.name}
                  </h2>
                  <p className="font-semibold text-lg sm:text-xl mb-2">
                    {candidate.title}
                  </p>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-[500px] transition-all duration-500">
                    <p className="text-sm sm:text-base mb-4">
                      {candidate.details}
                    </p>
                    <p className="text-sm sm:text-base mb-4">
                      {/* Additional details */}
                      This is some extra hidden text that will appear on hover.
                    </p>
                    <Link
                      href={`/archive/${params.archiveId}/${candidate.id}`}
                      className="inline-flex items-center text-romantic-accent hover:text-romantic-primary transition-all duration-300 font-semibold text-lg"
                    >
                      More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-white text-xl text-center">No candidates available.</p>
        )}
      </div>
    </div>
  );
}
