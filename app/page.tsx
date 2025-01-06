import { getMetadata } from "@/actions/metadata";
import CandidateSelection from "@/components/CandidateCardContainer";
import CarouselComponent from "@/components/Carousel";
import Footer from "@/components/Footer";
import LivelyBackground from "@/components/LivelyBackground";
import Link from "next/link";

type SearchParams = Promise<{ filter?: string }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Await the searchParams to resolve
  const resolvedSearchParams = await searchParams;

  // Access the filter parameter if available
  const filter = resolvedSearchParams?.filter || "mix";

  const metadata = await getMetadata();

  const { round } = metadata[0];

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
            ) 
            // : round === "second" ? (
            //   <div className="bg-Caccent  text-white py-4 px-6  shadow-md text-center animate-pulse">
            //     <h2 className="text-3xl font-bold font-quindelia">
            //       Second Round Now Open!
            //     </h2>
            //     <p className="mt-2 text-lg">
            //       Cast your votes for the final selection
            //     </p>
            //   </div>
            // )
            :round === "result" ? (
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

          <CandidateSelection searchParams={{ filter }} />

          <Footer />
        </div>
      </div>
    </div>
  );
}
