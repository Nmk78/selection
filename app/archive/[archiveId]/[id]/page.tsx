import { getCandidatesWithStatsAndTitles } from "@/actions/archive";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Candidate {
  id: string;
  name: string;
  year: number;
  title: "King" | "Queen" | "Prince" | "Princess";
  imageUrl: string;
  details: string;
}

const pastCandidates: Candidate[] = [];

export default async function CandidateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pastCandidate = await getCandidatesWithStatsAndTitles(params.id);

  if (!pastCandidate) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-romantic-bg to-romantic-secondary py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-xl">
        <div className="relative aspect-video">
          <Image
            src={candidate.profileImage}
            alt={candidate.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-script mb-2">
              {candidate.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold">
              {candidate.title} of {candidate.year}
            </p>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-lg sm:text-xl mb-6">{candidate.details}</p>
          <Link
            href={`/archive/${year}`}
            className="inline-flex items-center text-romantic-primary hover:text-romantic-accent transition-colors duration-300 font-semibold text-lg sm:text-xl"
          >
            <span className="mr-2">Back to {year} Royalty</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
