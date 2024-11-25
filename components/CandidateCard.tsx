import { Candidate } from "@/types/types";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md select-none overflow-hidden">
      <div className="relative h-64 sm:h-80">
        <Image
          src={candidate.profilePic}
          alt={candidate.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <Link href={`candidate/${candidate.id}`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            {" "}
            <h2 className="text-2xl font-bold text-Cprimary mb-2">
              {candidate.name}
              {}
            </h2>
            <div>{true && <Crown className="text-Caccent w-6 h-6" />}</div>
          </div>
          <p className="text-Caccent font-semibold mb-2">{candidate.major}</p>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Height: {candidate.height}</span>
            <span>Weight: {candidate.weight}</span>
          </div>
          <p className="text-gray-700 mb-4">{candidate.intro}</p>
          <div className="mb-4">
            <h3 className="font-semibold text-Cprimary mb-2">Hobbies:</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-Csecondary text-Cprimary px-2 py-1 rounded-full text-sm"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
          {/* <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {candidate.imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`${candidate.name} - Image ${index + 1}`}
                width={80}
                height={80}
                objectFit="cover"
                className="rounded-md"
              />
            ))}
          </div> */}
        </div>
      </Link>
    </div>
  );
};

export default CandidateCard;
