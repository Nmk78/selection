"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CandidateCard from "./CandidateCard";
import FilterDropdown from "./FilterDropDown";
import { CandidateGridSkeleton } from "./ui/skeleton";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

export interface Candidate {
  id: string;
  name: string;
  intro: string;
  gender: "male" | "female";
  major: string;
  profileImage: string;
  carouselImages: string[];
  height: number;
  age: number;
  weight: number;
  hobbies: string[];
}

interface Props {
  filter?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function CandidateSelection({ filter = "mix" }: Props) {
  const allCandidates = useQuery(api.candidates.getAll);
  const [cachedCandidates, setCachedCandidates] = useState<typeof allCandidates>(undefined);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Update cache when we have new data
  useEffect(() => {
    if (allCandidates !== undefined) {
      setCachedCandidates(allCandidates);
      setIsInitialLoad(false);
    }
  }, [allCandidates]);

  // Use cached data if available, otherwise use current data
  const displayCandidates = allCandidates ?? cachedCandidates;

  // Memoize filtered and sorted candidates
  const candidates = useMemo(() => {
    if (!displayCandidates) return [];

    const males = displayCandidates.filter(
      (candidate) => candidate.gender === "male"
    );
    const females = displayCandidates.filter(
      (candidate) => candidate.gender === "female"
    );

    if (filter === "male-first") {
      return [...males, ...females];
    } else if (filter === "female-first") {
      return [...females, ...males];
    } else {
      // Mix - create a deterministic shuffle based on candidate IDs
      return [...displayCandidates].sort((a, b) => {
        const aHash = a._id.charCodeAt(0) + a._id.charCodeAt(1);
        const bHash = b._id.charCodeAt(0) + b._id.charCodeAt(1);
        return aHash - bHash;
      });
    }
  }, [displayCandidates, filter]);

  // Only show loading skeleton on initial load
  if (isInitialLoad && allCandidates === undefined) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="flex justify-end mb-6">
          <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <CandidateGridSkeleton count={8} />
      </div>
    );
  }

  if (!displayCandidates || displayCandidates.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
          <p className="text-lg">No candidates found.</p>
          <p className="text-sm mt-2">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">

      {/* Filter Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex justify-end mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-candidate-male-50/50 to-candidate-female-50/50 border border-candidate-male-200/50 shadow-sm">
          <FilterDropdown defaultValue={filter} />
        </div>
      </motion.div>

      {/* Render candidates with staggered animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
      >
        {candidates.map((candidate) => (
          <motion.div key={candidate._id} variants={itemVariants}>
            <CandidateCard
              candidate={{
                id: candidate._id,
                name: candidate.name,
                slug: candidate.slug,
                intro: candidate.intro,
                gender: candidate.gender,
                major: candidate.major,
                profileImage: candidate.profileImage,
                carouselImages: candidate.carouselImages,
                height: candidate.height,
                age: candidate.age,
                weight: candidate.weight,
                hobbies: candidate.hobbies,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
