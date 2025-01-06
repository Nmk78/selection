'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getArchiveMetadatasById, getCandidatesWithStatsAndTitles } from '@/actions/archive';
import { Skeleton } from '@/components/ui/skeleton'; // ShadCN Skeleton



export default function YearArchivePage() {
  const { archiveId } = useParams(); // Extract archiveId from URL

  // Use React Query to fetch candidates
  const {data} = useQuery({
    queryKey: ['room', archiveId],
    queryFn: async () => {
      const res = await getArchiveMetadatasById(String(archiveId));
      if (!res.success) {
        throw new Error('Failed to fetch metadata');
      }
      return res.data; // Return candidates data
    },
    enabled: !!archiveId, 
  });  
  console.log("🚀 ~ YearArchivePage ~ data:", data)

  const query = useQuery({
    queryKey: ['candidates', archiveId],
    queryFn: async () => {
      const res = await getCandidatesWithStatsAndTitles(String(archiveId));
      if (!res.success) {
        throw new Error('Failed to fetch candidates');
      }
      return res.data; // Return candidates data
    },
    enabled: !!archiveId, // Ensure query runs only when archiveId is defined
  });

  const { data: pastCandidates = [], isLoading, isError } = query;

  // Render skeletons during loading
  if (isLoading && !data) {
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

  // Render error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load candidates.</p>
      </div>
    );
  }

  // const shuffledCandidates =       pastCandidates.sort(() => Math.random() - 0.5);
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
        {data && `Selected Students of ${data[0].title}`}
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-20">
        {shuffledCandidates.length > 0 ? (
          shuffledCandidates.map((candidate, index) => (
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
                      {candidate.intro.slice(0,200)}....
                    </p>
                    <Link
                      href={`/archive/${archiveId}/${candidate.id}`}
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
