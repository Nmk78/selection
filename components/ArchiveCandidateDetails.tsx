"use client";

import Head from "next/head"; // Import Head for metadata management

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getArchivedCandidateById } from "@/actions/archive";
import {
  Key
} from "react";

interface candidate {
  id: string;
  roomId?: string; // Make roomId optional
  title: string | null;
  room: string | null;
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

interface CandidateDetailPageProps {
  archiveId: string;
  id: string;
  candidateDetails: candidate | undefined;
}

// export function ArchiveCandidateDetailPage({
//   archiveId,
//   id,
// }: CandidateDetailPageProps) {
//   // React Query to fetch candidate data
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["archiveCandidate", id],
//     queryFn: async () => {
//       const response = await getArchivedCandidateById(id);
//       if (!response.success) {
//         throw new Error(response.message || "Failed to fetch candidate data");
//       }
//       return response.data;
//     },
//     refetchOnWindowFocus: false,
//   });


//   if (isLoading) {
//     return <CandidateDetailSkeleton />;
//   }
//   console.log("🚀 ~ data:", data)

//   if (isError || !data) {
//     return (
//       <div className="min-h-[75vh] w-full flex items-center justify-center px-4">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Candidate not found
//           </h1>
//           <Link href={`/archive/${archiveId}`}>
//             <Button variant="outline" className="text-sm sm:text-base">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Archive
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[75vh] w-full bg-gradient-to-b from-romantic-bg to-romantic-secondary py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Main Content */}
//         <div className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
//           {/* Profile Section */}
//           <div className="relative aspect-[3/4] sm:aspect-[16/9] rounded-t-lg overflow-hidden">
//             <Image
//               src={data.profileImage}
//               alt={data.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
//             <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
//               <h1 className="text-3xl sm:text-4xl md:text-5xl font-script mb-2 text-white drop-shadow-lg">
//                 {data.name}
//               </h1>
//               {data.title && (
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-3 drop-shadow-md">
//                   {data.title}
//                 </h2>
//               )}
//               <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//                 <Badge variant="secondary" className="text-xs sm:text-sm bg-white bg-opacity-20 text-white">
//                   {data.gender?.toUpperCase()}
//                 </Badge>
//                 <Badge variant="secondary" className="text-xs sm:text-sm bg-white bg-opacity-20 text-white">
//                   Room {data.room}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           {/* Details Section */}
//           <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
//             {/* Basic Info */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
//               <InfoItem title="Age" value={`${data.age} years`} />
//               <InfoItem title="Major" value={data.major} />
//               <InfoItem title="Height" value={`${data.height} cm`} />
//               <InfoItem title="Weight" value={`${data.weight} kg`} />
//             </div>

//             {/* Introduction */}
//             <Section title="Introduction" content={data.intro} />

//             {/* Hobbies */}
//             {data.hobbies.length > 0 && (
//               <Section title="Hobbies">
//                 <div className="flex flex-wrap gap-2 sm:gap-3">
//                   {data.hobbies.map((hobby: string, index: Key) => (
//                     <Badge
//                       key={index}
//                       variant="secondary"
//                       className="text-xs sm:text-sm px-3 py-1"
//                     >
//                       {hobby}
//                     </Badge>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {/* Gallery */}
//             {data.carouselImages.length > 0 && (
//               <Section title="Gallery">
//                 <Carousel className="w-full max-w-2xl mx-auto">
//                   <CarouselContent className="-ml-2 md:-ml-4">
//                     {data.carouselImages.map((image: string, index: number) => (
//                       <CarouselItem key={index} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/4">
//                         <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-gray-100">
//                           <Image
//                             src={image}
//                             alt={`${data.name} - Image ${index + 1}`}
//                             fill
//                             className="object-cover"
//                             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                           />
//                         </div>
//                       </CarouselItem>
//                     ))}
//                   </CarouselContent>
//                   {/* <CarouselPrevious className="hidden sm:flex -left-12 sm:-left-6" />
//                   <CarouselNext className="hidden sm:flex -right-12 sm:-right-6" /> */}
//                 </Carousel>
//               </Section>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Candidate Interface
interface candidate {
  id: string;
  roomId?: string;
  title: string | null;
  room: string | null;
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



export function ArchiveCandidateDetailPage({ archiveId, id }: CandidateDetailPageProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["archiveCandidate", id],
    queryFn: async () => {
      const response = await getArchivedCandidateById(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch candidate data");
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <CandidateDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="min-h-[75vh] w-full flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Candidate not found
          </h1>
          <Link prefetch href={`/archive/${archiveId}`}>
            <Button variant="outline" className="text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archive
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Metadata */}
      <Head>
        <title>{data.name} - Candidate Profile</title>
        <meta
          name="description"
          content={`Explore the profile of ${data.name}, a candidate from the ${data.major} major.`}
        />
        <meta property="og:title" content={`${data.name} - Candidate Profile`} />
        <meta
          property="og:description"
          content={`Get to know ${data.name}'s achievements, hobbies, and background.`}
        />
        <meta property="og:image" content={data.profileImage} />
        <meta property="og:url" content={`https://example.com/archive/${archiveId}/candidate/${id}`} />
        <meta name="keywords" content={`candidate, ${data.major}, ${data.name}`} />
      </Head>

      {/* Page Content */}
      <div className="min-h-[75vh] w-full bg-gradient-to-b from-romantic-bg to-romantic-secondary py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
            {/* Profile Section */}
            <div className="relative aspect-[3/4] sm:aspect-[16/9] rounded-t-lg overflow-hidden">
              <Image
                src={data.profileImage}
                alt={data.name}
                fill
                className="object-cover md:object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-script mb-2 text-white drop-shadow-lg">
                  {data.name}
                </h1>
                {data.title && (
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-3 drop-shadow-md">
                    {data.title}
                  </h2>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge variant="secondary" className="text-xs sm:text-sm bg-white bg-opacity-20 text-white">
                    {data.gender?.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm bg-white bg-opacity-20 text-white">
                    Room {data.room}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <InfoItem title="Age" value={`${data.age} years old`} />
                <InfoItem title="Major" value={data.major} />
                <InfoItem title="Height" value={`${data.height} cm`} />
                <InfoItem title="Weight" value={`${data.weight} lb`} />
              </div>

              {/* Introduction */}
              <Section title="Introduction" content={data.intro} />

              {/* Hobbies */}
              {data.hobbies.length > 0 && (
                <Section title="Hobbies">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {data.hobbies.map((hobby: string, index: Key) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs sm:text-sm px-3 py-1"
                      >
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {/* Gallery */}
              {data.carouselImages.length > 0 && (
                <Section title="Gallery">
                  <Carousel className="w-full max-w-2xl mx-auto">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {data.carouselImages.map((image: string, index: number) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-3/4 md:basis-1/2 lg:basis-1/4">
                          <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={image}
                              alt={`${data.name} - Image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </Section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function CandidateDetailSkeleton() {
  return (
    <div className="min-h-[75vh] p-4 sm:p-6 lg:p-8">
      {/* Skeleton content here */}
      <Skeleton className="h-10 w-1/3 mb-4" />
      <Skeleton className="h-[300px] w-full mb-6" />
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

interface InfoItemProps {
  title: string;
  value: string;
}

function InfoItem({ title, value }: InfoItemProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-sm sm:text-base font-semibold">{value}</p>
    </div>
  );
}

interface SectionProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
}

function Section({ title, content, children }: SectionProps) {
  return (
    <div className="border-t border-gray-200 pt-6 sm:pt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">{title}</h2>
      {content ? (
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {content}
        </p>
      ) : (
        children
      )}
    </div>
  );
}

