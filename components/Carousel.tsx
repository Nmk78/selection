"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllCandidateImages } from "@/actions/metadata";
import { plugin } from "postcss";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function CarouselComponent() {
  const {
    data: images,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["allImages"], // Caching key
    queryFn: async () => {
      const response = await getAllCandidateImages();
      return response; // Ensure it returns an array of image URLs
    },
  });

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error || !images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        Failed to load images. Please try again.
      </div>
    );
  }

  return (
    // <div
    //   className="relative w-full h-[60vh] overflow-hidden px-3 py-1"
    //   onMouseEnter={handleInteraction}
    //   onMouseLeave={handleMouseLeave}
    //   onTouchStart={handleInteraction}
    //   onTouchEnd={handleMouseLeave}
    // >
    //   <AnimatePresence initial={false}>
    //     <motion.div
    //       key={currentIndex}
    //       initial={{ opacity: 0 }}
    //       animate={{ opacity: 1 }}
    //       exit={{ opacity: 0 }}
    //       transition={{ duration: 0.5 }}
    //       className="absolute inset-0 h-full"
    //     >
    //       <Image
    //         src={images[currentIndex]} // Ensure images[currentIndex] is valid
    //         alt={`Full body image ${currentIndex + 1}`}
    //         layout="fill"
    //         objectFit="cover"
    //         className="w-full h-full"
    //         priority
    //       />
    //       <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30">
    //         <span className="text-red-800 font-bold text-lg relative inline-block">
    //           <span className="relative z-10">
    //             {currentIndex + 1} of {images.length}
    //           </span>
    //           <span className="absolute inset-0 animate-glare"></span>
    //         </span>
    //       </div>
    //     </motion.div>
    //   </AnimatePresence>
    // </div>
    <Carousel
      plugins={[plugin.current]}
      className="w-full mx-auto rounded-lg h-[75vh] md:h-auto" // Adjust height for larger screens
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-full h-full p-0">
        {images.map((url, index) => (
          <CarouselItem
            className="mx-auto md:basis-1/2 rounded-none relative"
            key={index}
          >
            <div className="w-full h-full mx-auto relative aspect-potriate">
              <Image
                src={url}
                alt={`Full-body Image ${index + 1} of ${name}`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-none mx-auto"
              />
            </div>
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30">
              <span className="text-red-800 font-bold text-lg relative inline-block">
                <span className="relative z-10">
                  {index + 1} of {images.length}
                </span>
                <span className="absolute inset-0 animate-glare"></span>
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
