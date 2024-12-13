"use client";

import { useRef } from "react";
import Image from "next/image";
import { LoaderCircle } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getAllCandidateImages } from "@/actions/metadata";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function CarouselComponent() {
  const {
    data: images,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["allImages"],
    queryFn: async () => {
      const response = await getAllCandidateImages();
      return response;
    },
  });

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60 w-full">
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error || !images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 w-full text-red-500">
        Failed to load images. Please try again.
      </div>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full overflow-hidden"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((url, index) => (
          <CarouselItem key={index} className="relative -pl-1">
            <div className="aspect-[3/4] w-full relative">
              <Image
                src={url}
                alt={`Full-body Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                className=""
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
              <span className="text-white font-bold text-sm sm:text-base relative inline-block px-2 py-1 bg-black bg-opacity-50 ">
                {index + 1} of {images.length}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

