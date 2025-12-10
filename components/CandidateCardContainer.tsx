"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CandidateCard from "./CandidateCard";
import FilterDropdown from "./FilterDropDown";
import { CandidateGridSkeleton } from "./ui/skeleton";
import { motion } from "framer-motion";
import { useMemo } from "react";

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

  // Memoize filtered and sorted candidates
  const candidates = useMemo(() => {
    if (!allCandidates) return [];

    const males = allCandidates.filter(
      (candidate) => candidate.gender === "male"
    );
    const females = allCandidates.filter(
      (candidate) => candidate.gender === "female"
    );

    if (filter === "male-first") {
      return [...males, ...females];
    } else if (filter === "female-first") {
      return [...females, ...males];
    } else {
      // Mix - create a deterministic shuffle based on candidate IDs
      return [...allCandidates].sort((a, b) => {
        const aHash = a._id.charCodeAt(0) + a._id.charCodeAt(1);
        const bHash = b._id.charCodeAt(0) + b._id.charCodeAt(1);
        return aHash - bHash;
      });
    }
  }, [allCandidates, filter]);

  if (allCandidates === undefined) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia">
          PU Selection
        </h1>
        <div className="flex justify-end mb-6">
          <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <CandidateGridSkeleton count={8} />
      </div>
    );
  }

  if (!allCandidates || allCandidates.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia">
          PU Selection
        </h1>
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
          <p className="text-lg">No candidates found.</p>
          <p className="text-sm mt-2">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-Cprimary mb-6 text-center font-quindelia"
      >
        PU Selection
      </motion.h1>

      {/* Filter Dropdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-end mb-6"
      >
        <FilterDropdown defaultValue={filter} />
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
