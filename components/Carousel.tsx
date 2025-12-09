"use client";

import { useRef } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

export default function CarouselComponent() {
  const images = useQuery(api.candidates.getAllImages);

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  if (!images) {
    return (
      <div className="w-full max-w-7xl md:mt-2 mx-auto overflow-hidden">
        <div className="p-0 ">
          <Carousel className="w-full rounded-none md:rounded-xl">
            <CarouselContent>
              {[...Array(4)].map((_, index) => (
                <CarouselItem key={index} className="relative rounded-none pl-0 md:basis-1/2 lg:basis-1/5">
                  <div className="aspect-[3/4] w-full relative">
                    <Skeleton className="w-full h-full absolute inset-0" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
                    <Skeleton className="w-16 h-6" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-60 text-red-500">
          Failed to load images. Please try again.
        </CardContent>
      </Card>
    );
  }

  // Randomize the images array
  const randomImages = [...images].sort(() => Math.random() - 0.5);

  return (
    <Card className="w-full max-w-7xl rounded-none md:mt-2 mx-auto overflow-hidden">
      <CardContent className="p-0 rounded-none md:rounded-xl">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full rounded-none md:rounded-xl"
        >
          <CarouselContent className="rounded-none">
            {randomImages.map((url, index) => (
              <CarouselItem key={index} className="relative rounded-none pl-0 md:basis-1/2 lg:basis-1/5">
                <div className="aspect-[3/4] w-full rounded-none relative">
                  <Image
                    src={url}
                    alt={`Full-body Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className=" rounded-none"
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
                  <span className="text-white font-thin font-quindelia text-sm sm:text-base relative inline-block px-2 py-1 bg-gray-600 bg-opacity-20 rounded">
                    {index + 1} of {randomImages.length}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );
}