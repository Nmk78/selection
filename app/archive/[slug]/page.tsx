"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function YearArchivePage() {
  const { slug } = useParams();
  const metadataSlug = String(slug);

  const metadata = useQuery(api.archive.getArchiveMetadataBySlug, {
    slug: metadataSlug,
  });
  const candidatesData = useQuery(
    api.archive.getCandidatesWithStatsAndTitlesBySlug,
    { slug: metadataSlug }
  );

  const isLoading = metadata === undefined || candidatesData === undefined;
  const isError =
    metadata?.success === false || candidatesData?.success === false;
  const metadataNotFound =
    metadata?.success === false && metadata?.message === "Metadata not found.";
  const pastCandidates = candidatesData?.data ?? [];

  // Render skeletons during loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-gradient-2 text-4xl sm:text-5xl md:text-6xl font-script text-romantic-primary text-center mb-8 sm:mb-12 shadow-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Selected Students of ....
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-80 md:w-96 mx-auto group"
            >
              <Skeleton className="h-[300px] w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render 404 state if metadata not found
  if (metadataNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-romantic-bg to-romantic-secondary">
        <div className="text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-romantic-primary mb-4">
            404
          </h1>
          <p className="text-xl text-gray-700 mb-6">Archive not found</p>
          <p className="text-gray-600 mb-8">
            The archive you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-romantic-primary text-white rounded-lg hover:bg-romantic-accent transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-romantic-bg to-romantic-secondary">
        <div className="text-center px-4">
          <p className="text-red-500 text-lg mb-4">Failed to load archive.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-romantic-primary text-white rounded-lg hover:bg-romantic-accent transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const shuffledCandidates = [
    ...pastCandidates.filter((candidate) => candidate.title !== null),
    ...pastCandidates
      .filter((candidate) => candidate.title === null)
      .sort(() => Math.random() - 0.5),
  ];

  // Render candidates data
  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-gradient-2 text-4xl sm:text-5xl md:text-6xl font-script text-romantic-primary text-center mb-8 sm:mb-12 shadow-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {metadata?.data && `Selected Students of ${metadata.data.title}`}
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-20">
        {shuffledCandidates.length > 0 ? (
          shuffledCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.slug}
              className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-80 md:w-96 mx-auto group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/archive/${metadataSlug}/${candidate.slug}`}>
                <div className="relative aspect-[3/4]">
                  <Image
                    src={candidate.profileImage}
                    alt={candidate.name}
                    fill
                    style={{ objectFit: "cover" }}
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
                      <p className="text-sm sm:text-base mb-0">
                        {candidate.intro.slice(0, 200)}....
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="text-white text-xl text-center">
            No candidates available.
          </p>
        )}
      </div>
    </div>
  );
}
