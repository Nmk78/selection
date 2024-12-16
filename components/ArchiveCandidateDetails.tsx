'use client'

import { useQuery } from '@tanstack/react-query'
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { getArchivedCandidateById } from '@/actions/archive';

interface Candidate {
  id: string;
  name: string;
  gender: string;
  title: string;
  room: string;
  profileImage: string;
  carouselImages: string[];
  intro: string;
  major: string;
  height: number;
  weight: number;
  hobbies: string[];
  age: number;
}

interface CandidateDetailPageProps {
  archiveId: string;
  id: string;
}

export function ArchiveCandidateDetailPage({ archiveId, id }: CandidateDetailPageProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['archiveCandidate', id],
    queryFn: () => getArchivedCandidateById(id),
  });

  if (isLoading) {
    return <CandidateDetailSkeleton />;
  }

  const candidateData = data?.data;

  if (isError || !data || !data.success || !candidateData) {
    return (
      <div className="min-h-[75vh] w-full flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Candidate not found</h1>
          <Link href={`/archive/${archiveId}`}>
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
    <div className="min-h-[75vh] w-full bg-gradient-to-b from-romantic-bg to-romantic-secondary py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link href={`/archive/${archiveId}`}>
            <Button variant="outline" className="bg-white bg-opacity-90 text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archive
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
          {/* Profile Section */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9]">
            <Image
              src={candidateData.profileImage}
              alt={candidateData.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-script mb-2 text-white">
                {candidateData.name}
              </h1>
              {candidateData.title && (
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
                  {candidateData.title}
                </h2>
              )}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {candidateData.gender?.toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Room {candidateData.room}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {candidateData.title && (
                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1 text-sm sm:text-base font-semibold">{candidateData.title}</p>
                </div>
              )}
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Age</h3>
                <p className="mt-1 text-sm sm:text-base">{candidateData.age} years</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Major</h3>
                <p className="mt-1 text-sm sm:text-base">{candidateData.major}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Height</h3>
                <p className="mt-1 text-sm sm:text-base">{candidateData.height} cm</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Weight</h3>
                <p className="mt-1 text-sm sm:text-base">{candidateData.weight} kg</p>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Introduction</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {candidateData.intro}
              </p>
            </div>

            {/* Hobbies */}
            {candidateData.hobbies && candidateData.hobbies.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Hobbies</h2>
                <div className="flex flex-wrap gap-2">
                  {/* @ts-expect-error */}
                  {candidateData.hobbies.map((hobby, index) => (
                    <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Image Carousel */}
            {candidateData.carouselImages && candidateData.carouselImages.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Gallery</h2>
                <Carousel className="w-full max-w-sm sm:max-w-md mx-auto">
                  <CarouselContent>
                    {/* @ts-expect-error */}
                    {candidateData.carouselImages.map((image, index) => (
                      <CarouselItem key={index} className=" md:basis-1/4 lg:basis-1/5">
                        <div className=" aspect-potriate relative rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${candidateData.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateDetailSkeleton() {
  return (
    <div className="w-full bg-gradient-to-b from-romantic-bg to-romantic-secondary py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
          <Skeleton className="aspect-[4/3] sm:aspect-[16/9] w-full" />
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-6 w-16" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="aspect-[3/4] w-full max-w-sm sm:max-w-md mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
