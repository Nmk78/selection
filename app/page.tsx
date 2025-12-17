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
import { Crown } from "lucide-react";

function HomeContent() {
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
            {round === "first" && (
              <div className="bg-purple-600 text-white py-4 px-4 md:py-5 md:px-6 shadow-md text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    First Round Now Open!
                  </h2>
                </div>
                <p className="text-sm md:text-base text-white/90">
                  Cast your votes for the selection
                </p>
              </div>
            )}
            {round === "result" && (
              <div className="bg-amber-600 text-white py-4 px-4 md:py-5 md:px-6 shadow-md text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-200" />
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Results Available Now!
                  </h2>
                </div>
                <Link
                  prefetch
                  href="/results"
                  id="results"
                  className="inline-block mt-2 bg-white/20 hover:bg-white/30 text-white font-medium text-base md:text-lg px-4 py-2 rounded-lg border border-white/30 transition-colors"
                >
                  View Winners →
                </Link>
              </div>
            )}
          </div>

          <CandidateSelection filter={filter} />

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
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
      <HomeContent />
    </Suspense>
  );
}
