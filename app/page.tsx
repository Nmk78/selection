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

function HomeContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "mix";

  const metadata = useQuery(api.metadata.getActive);

  const round = metadata?.round;

  return (
    <div className="relative min-h-screen">
      <LivelyBackground />
      <div className="max-w-full px-0 sm:px-0 lg:px-4 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto ">
          <div className="w-full md:rounded-xl overflow-hidden max-w-full mx-auto">
            <CarouselComponent />
            {round === "first" ? (
              <div className="bg-Caccent text-white py-4 px-6 shadow-md text-center animate-pulse">
                <h2 className="text-3xl font-bold font-quindelia">
                  First Round Now Open!
                </h2>
                <p className="mt-2 text-lg">
                  Cast your votes for the selection
                </p>
              </div>
            ) : round === "result" ? (
              <div className="bg-Caccent  text-white py-4 px-6  shadow-md text-center animate-pulse">
                <h2 className="text-3xl font-bold font-quindelia">
                  Result is available now!
                </h2>
                <Link
                  prefetch
                  href="/results"
                  id="results"
                  className="mt-2 block text-white font-quindelia text-2xl text-center mx-auto hover:underline transition-all duration-300"
                >
                  Check results
                </Link>
              </div>
            ) : (
              ""
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
