"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
import { getArchivedCandidateById } from "@/actions/archive";
import { useEffect, useState } from "react";

type CandidateResponse = 
  | { success: true; data: { 
        id: string;
        name: string;
        age: number;
        height: number;
        weight: number;
        title: string | null;
        room: string | null;
        intro: string;
        gender: string;
        major: string;
        profileImage: string;
        carouselImages: string[];
        hobbies: string[];
      }; 
    message?: undefined; 
  }
  | { success: false; message: string; data?: undefined };

interface CandidateDetailPageProps {
  archiveId: string;
  id: string;
}

export function ArchiveCandidateDetailPage({
  archiveId,
  id,
}: CandidateDetailPageProps) {
  const [candidateData, setCandidateData] = useState<
    CandidateResponse["data"] | null
  >(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["archiveCandidate", id],
    queryFn: async () => {
      const response = await getArchivedCandidateById(id);
      return response;
    },
    refetchOnWindowFocus: false,
  });

  // Set data to state once the query is successful
  useEffect(() => {
    if (data && data.success) {
      setCandidateData(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <Skeleton className="w-full h-80" />;
  }

  if (error || (data && !data.success)) {
    return (
      <div className="text-red-500">
        {data?.message || "Error fetching candidate data"}
      </div>
    );
  }

  

  if (isLoading) {
    return <CandidateDetailSkeleton />;
  }

  if (error || !data || !data.success || !data.data || !candidateData) {
    return (
      <div className="min-h-[75vh] w-full flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Candidate not found
          </h1>
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
            <Button
              variant="outline"
              className="bg-white bg-opacity-90 text-sm sm:text-base"
            >
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
              <InfoItem title="Age" value={`${candidateData.age} years`} />
              <InfoItem title="Major" value={candidateData.major} />
              <InfoItem title="Height" value={`${candidateData.height} cm`} />
              <InfoItem title="Weight" value={`${candidateData.weight} kg`} />
            </div>

            {/* Introduction */}
            <Section title="Introduction" content={candidateData.intro} />

            {/* Hobbies */}
            {candidateData.hobbies.length > 0 && (
              <Section title="Hobbies">
                <div className="flex flex-wrap gap-2">
                  {candidateData.hobbies.map((hobby, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs sm:text-sm"
                    >
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}

            {/* Gallery */}
            {candidateData.carouselImages.length > 0 && (
              <Section title="Gallery">
                <Carousel className="w-full max-w-sm sm:max-w-md mx-auto">
                  <CarouselContent>
                    {candidateData.carouselImages.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/4 lg:basis-1/5"
                      >
                        <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
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
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateDetailSkeleton() {
  return (
    <div className="min-h-[75vh] p-4 sm:p-6 lg:p-8">
      {/* Skeleton content here */}
    </div>
  );
}

interface InfoItemProps {
  title: string;
  value: string;
}

function InfoItem({ title, value }: InfoItemProps) {
  return (
    <div>
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-sm sm:text-base">{value}</p>
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
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{title}</h2>
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
