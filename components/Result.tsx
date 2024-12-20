import Image from "next/image";
import { Crown } from "lucide-react";
import { winnerCandidate } from "@/types/types";


interface ResultsProps {
  results: winnerCandidate[];
}

export default function Results({ results }: ResultsProps) {
  console.log("🚀 ~ Results ~ results:", results)
  const getTitleColor = (title: string) => {
    switch (title) {
      case "King":
        return "text-blue-600";
      case "Queen":
        return "text-pink-600";
      case "Prince":
        return "text-green-600";
      case "Princess":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="w-full mx-auto p-4 bg-gradient-to-b from-romantic-bg to-romantic-secondary">
      <h1 className="text-gradient text-4xl md:text-6xl lg:text-7xl font-script text-center text-romantic-primary mb-8">
        PU Selection Results
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {results.map((candidate) => (
          <div key={candidate.title} className="flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 mb-4">
              <Image
                src={candidate.profileImage}
                alt={`${candidate.title} ${candidate.name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-romantic-primary shadow-lg"
              />
              <div className="absolute -top-4 -right-4 md:right-4 bg-romantic-bg rounded-full p-2 shadow-md">
                <Crown
                  className={`w-8 h-8 ${getTitleColor(candidate.title)}`}
                />
              </div>
            </div>
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-script ${getTitleColor(
                candidate.title
              )} mb-2`}
            >
              {candidate.title}
            </h2>
            <a href={`candidate/${candidate.id}`} className="text-xl md:text-2xl lg:text-3xl font-semibold text-romantic-text mb-2">
              {candidate.name}
            </a>
            {/* <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-romantic-accent" />
              <span className="text-lg text-romantic-text">
                {candidate.votes} votes
              </span>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
