"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CandidateSelection from "@/components/CandidateCardContainer";
import CarouselComponent from "@/components/Carousel";
import Footer from "@/components/Footer";
import LivelyBackground from "@/components/LivelyBackground";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function HomeContentInner() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "mix";

  const metadata = useQuery(api.metadata.getActive);

  const round = metadata?.round;

  return (
    <div className="relative min-h-screen">
      {/* <LivelyBackground /> */}
      <div className="max-w-full px-0 sm:px-0 lg:px-4 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto ">
          <div className="w-full md:rounded-xl overflow-hidden max-w-full mx-auto">
            <CarouselComponent />
            {round === "first" ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative overflow-hidden bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 text-white py-5 px-4 md:py-6 md:px-6 shadow-lg text-center"
              >
                {/* Animated shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center gap-3 mb-2"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></span>
                    </motion.div>
                    <h2 className="text-xl md:text-2xl font-bold drop-shadow-md">
                      First Round Open Now!
                    </h2>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm md:text-base text-white/95 font-medium"
                  >
                    Cast your votes for the selection
                  </motion.p>
                </div>
              </motion.div>
            ) : round === "second" ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative overflow-hidden bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 text-white py-5 px-4 md:py-6 md:px-6 shadow-lg text-center"
              >
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center gap-3 mb-2"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></span>
                    </motion.div>
                    <h2 className="text-xl md:text-2xl font-bold drop-shadow-md">
                      Second Round Open Now!
                    </h2>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm md:text-base text-white/95 font-medium"
                  >
                    Cast your votes for the selection
                  </motion.p>
                </div>
              </motion.div>
            ) : round === "result" ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative overflow-hidden bg-gradient-to-r from-candidate-male-600 via-candidate-female-600 to-candidate-male-600 text-white py-6 px-4 md:py-8 md:px-6 shadow-xl text-center"
              >
                {/* Animated shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center gap-3 mb-3"
                  >
                    <div className="relative">
                      <Crown className="w-6 h-6 md:w-7 md:h-7 text-white/90 drop-shadow-lg" />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0"
                      >
                        <Crown className="w-6 h-6 md:w-7 md:h-7 text-white/20" />
                      </motion.div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold drop-shadow-md">
                      Results Available Now!
                    </h2>
                    {/* Decorative sparkles */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white/50" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-base text-white/95 mb-4 font-medium"
                  >
                    Discover the champions of PU Selection
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      prefetch
                      href="/results"
                      id="results"
                      className="group relative inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-base md:text-lg px-6 py-3 md:px-8 md:py-3.5 rounded-xl border-2 border-white/40 hover:border-white/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10">View Winners</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative z-10"
                      >
                        →
                      </motion.span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-3xl text-center pt-6 font-bold font-quindelia bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
              >
                PU Selection
              </motion.h1>
            )}
          </div>

          <CandidateSelection filter={filter} />

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function HomeContent() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen">
          <LivelyBackground />
          <div className="max-w-full px-0 sm:px-0 lg:px-4 mx-auto relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-pulse text-lg">Loading...</div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <HomeContentInner />
    </Suspense>
  );
}

