"use client";

import Image from "next/image";
import Link from "next/link";
import { Candidate as BaseCandidate } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export interface Candidate extends BaseCandidate {
  id: string;
  slug: string;
}

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  const isMale = candidate.gender === "male";
  const [isMobile, setIsMobile] = useState(false);
  const [showGlass, setShowGlass] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  console.log("🚀 ~ CandidateCard ~ isInViewport:", isInViewport);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer for viewport detection
  useEffect(() => {
    if (!cardRef.current) return;

    let timer: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            // On mobile, slide up when in viewport with delay
            if (isMobile) {
              // Clear any existing timer
              if (timer) clearTimeout(timer);
              timer = setTimeout(() => setShowGlass(true), 300);
            }
          } else {
            // Reset on mobile when out of viewport
            if (isMobile) {
              if (timer) clearTimeout(timer);
              setIsInViewport(false);
              setShowGlass(false);
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the card is visible
        rootMargin: "0px",
      }
    );

    observer.observe(cardRef.current);

    return () => {
      if (timer) clearTimeout(timer);
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isMobile]);

  return (
    <Link prefetch href={`candidate/${candidate.slug}`}>
      <motion.div
        ref={cardRef}
        className="group relative h-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-candidate-male-100/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => !isMobile && setShowGlass(true)}
        onMouseLeave={() => !isMobile && setShowGlass(false)}
      >
        {/* Image Section - Portrait Ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={candidate.profileImage}
              alt={candidate.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Gender badge */}
          {/* <div className="absolute top-2 right-2 z-20">
            <div
              className={`rounded-full p-1.5 shadow-md ${
                isMale
                  ? "bg-gradient-to-br from-purple-600 to-purple-700"
                  : "bg-gradient-to-br from-amber-500 to-amber-600"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-white" />
            </div>
          </div> */}

          {/* Liquid Glass Effect Overlay */}
          <AnimatePresence>
            {showGlass && (
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                  delay: isMobile ? 0.4 : 0,
                }}
                className="absolute bottom-0 left-0 right-0 z-10"
              >
                {/* Glassmorphism background */}
                <div className="relative backdrop-blur-xl bg-white/5 md:bg-white/10 border-t border-white/10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.05)]">
                  {/* Liquid glass effect with gradient */}
                  <div
                    className={`absolute inset-0 opacity-20 ${
                      isMale
                        ? "bg-gradient-to-b from-candidate-male-500/10 via-candidate-male-400/5 to-transparent"
                        : "bg-gradient-to-b from-candidate-female-500/10 via-candidate-female-400/5 to-transparent"
                    }`}
                  />

                  {/* Content */}
                  <div className="relative p-4 space-y-2.5">
                    {/* Name */}
                    <h2
                      className={`text-lg font-bold truncate ${
                        isMale
                          ? "bg-gradient-to-r from-candidate-male-600 to-candidate-male-800 bg-clip-text text-transparent"
                          : "bg-gradient-to-r from-candidate-female-600 to-candidate-female-800 bg-clip-text text-transparent"
                      }`}
                    >
                      {candidate.name}
                    </h2>

                    {/* Major */}
                    {/* <div className="flex items-center gap-1.5">
                      <GraduationCap
                        className={`w-3.5 h-3.5 ${
                          isMale
                            ? "text-candidate-male-500"
                            : "text-candidate-female-500"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          isMale
                            ? "text-candidate-male-700"
                            : "text-candidate-female-700"
                        }`}
                      >
                        {candidate.major}
                      </p>
                    </div> */}
                    <div className="flex items-center justify-between">
                      {/* Stats - Compact */}
                      <div className="flex items-center gap-3 text-xs text-gray-700">
                        <span>{candidate.age} yrs</span>
                        <span>•</span>
                        <span>{candidate.height} cm</span>
                        <span>•</span>
                        <span>{candidate.weight} lb</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <GraduationCap
                          className={`w-3.5 h-3.5 ${
                            isMale
                              ? "text-candidate-male-500"
                              : "text-candidate-female-500"
                          }`}
                        />
                        <p
                          className={`text-sm font-medium ${
                            isMale
                              ? "text-candidate-male-700"
                              : "text-candidate-female-700"
                          }`}
                        >
                          {candidate.major}
                        </p>
                      </div>
                    </div>
                    {/* Intro */}
                    <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed">
                      {candidate.intro}
                    </p>

                    {/* Hobbies - Compact */}
                    {candidate.hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {candidate.hobbies.slice(0, 2).map((hobby, index) => (
                          <span
                            key={index}
                            className={`px-2 py-0.5 rounded-md text-xs font-medium backdrop-blur-sm ${
                              isMale
                                ? "bg-candidate-male-100/80 text-candidate-male-700 border border-candidate-male-200/50"
                                : "bg-candidate-female-100/80 text-candidate-female-700 border border-candidate-female-200/50"
                            }`}
                          >
                            {hobby}
                          </span>
                        ))}
                        {candidate.hobbies.length > 2 && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100/80 text-gray-700 border border-gray-200/50 backdrop-blur-sm">
                            +{candidate.hobbies.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover accent */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
            isMale
              ? "bg-gradient-to-r from-candidate-male-500 to-candidate-female-400"
              : "bg-gradient-to-r from-candidate-female-500 to-candidate-male-400"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30`}
        />
      </motion.div>
    </Link>
  );
};

export default CandidateCard;
