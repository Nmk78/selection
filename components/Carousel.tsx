"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  images: string[];
  interval?: number;
}

export default function Carousel({ images, interval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlaying) {
      intervalId = setInterval(nextSlide, interval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, interval, nextSlide]);

  const handleInteraction = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <div
      className="relative w-full h-[60vh] overflow-hidden px-3 py-1"
      onMouseEnter={handleInteraction}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleInteraction}
      onTouchEnd={handleMouseLeave}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full"
        >
          <Image
            src={images[currentIndex]}
            alt={`Full body image ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className=" w-full h-full"
            priority
          />
          <div className="absolute font-quindelia bottom-5 left-1/2 transform -translate-x-1/2 z-30">
            <span className="text-red-800 font-bold text-lg relative inline-block">
              <span className="relative z-10">
                {currentIndex + 1} of {images.length}
              </span>
              <span className="absolute inset-0 animate-glare"></span>
            </span>
          </div>{" "}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
