import { getAllCandidateImages } from "@/actions/metadata";
import CandidateSelection from "@/components/CandidateCardContainer";
import CarouselComponent from "@/components/Carousel";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  return (
    <div className="max-w-full px-0 sm:px-0 lg:px-4 mx-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="w-full max-w-full mx-auto">
          <CarouselComponent />
        </div>

        <a href="/results" id="results" className="block text-Caccent font-quindelia text-2xl text-center mx-auto">
          Check results
        </a>

        <CandidateSelection />

        <Footer />
      </div>
    </div>
  );
}

