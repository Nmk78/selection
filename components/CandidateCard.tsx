// import { Crown } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Candidate as BaseCandidate } from "@/types/types";

// export interface Candidate extends BaseCandidate {
//   id: string; // Add the ID property
// }

// const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md select-none overflow-hidden">
//       <div className="relative h-64 sm:h-80">
//         <Image
//           src={candidate.profileImage}
//           alt={candidate.name}
//           layout="fill"
//           objectFit="cover"
//           className="transition-transform duration-300 hover:scale-105"
//         />
//       </div>
//       <Link href={`candidate/${candidate.id}`}>
//         <div className="p-4 sm:p-6">
//           <div className="flex items-center space-x-3">
//             {" "}
//             <h2 className="text-2xl font-bold text-Cprimary mb-2">
//               {candidate.name}
//               {}
//             </h2>
//             <div>{true && <Crown className="text-Caccent w-6 h-6" />}</div>
//           </div>
//           <p className="text-Caccent font-semibold mb-2">{candidate.major}</p>
//           <p className="text-gray-600 text-sm mb-2">{candidate.age}</p>
//           <div className="flex justify-between text-sm text-gray-600 mb-3">
//             <span>Height: {candidate.height}</span>
//             <span>Weight: {candidate.weight}</span>
//           </div>
//           <p className="text-gray-700 mb-4">{candidate.intro}</p>
//           <div className="mb-4">
//             <h3 className="font-semibold text-Cprimary mb-2">Hobbies:</h3>
//             <div className="flex flex-wrap gap-2">
//               {candidate.hobbies.map((hobby, index) => (
//                 <span
//                   key={index}
//                   className="bg-Csecondary text-Cprimary px-2 py-1 rounded-full text-sm"
//                 >
//                   {hobby}
//                 </span>
//               ))}
//             </div>
//           </div>
//           {/* <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//             {candidate.carouselImages.map((url, index) => (
//               <Image
//                 key={index}
//                 src={url}
//                 alt={`${candidate.name} - Image ${index + 1}`}
//                 width={80}
//                 height={80}
//                 objectFit="cover"
//                 className="rounded-md"
//               />
//             ))}
//           </div> */}
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default CandidateCard;

import Image from "next/image";
import Link from "next/link";
import { Candidate as BaseCandidate } from "@/types/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface Candidate extends BaseCandidate {
  id: string;
}

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  return (
    // <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
    //   <Link href={`candidate/${candidate.id}`}>
    //     <CardHeader className="p-0">
    //       <AspectRatio ratio={4/3}>
    //         <Image
    //           src={candidate.profileImage}
    //           alt={candidate.name}
    //           fill
    //           className="object-cover transition-transform duration-300 hover:scale-105"
    //         />
    //       </AspectRatio>
    //     </CardHeader>
    //     <CardContent className="p-4 sm:p-6">
    //       <div className="flex items-center justify-between mb-2">
    //         <h2 className={`${candidate.gender === "male" ? "text-Cprimary " : "text-Caccent "} text-xl font-bold  truncate`}>
    //           {candidate.name}
    //         </h2>
    //         {true && <Crown className="text-Caccent w-6 h-6 flex-shrink-0" />}
    //       </div>
    //       <p className="text-Caccent font-semibold text-sm mb-1">{candidate.major}</p>
    //       <p className="text-gray-600 text-sm mb-2">Age: {candidate.age}</p>
    //       <div className="flex justify-between text-sm text-gray-600 mb-3">
    //         <span>Height: {candidate.height}</span>
    //         <span>Weight: {candidate.weight}</span>
    //       </div>
    //       <p className="text-gray-700 text-sm mb-4 line-clamp-3">{candidate.intro}</p>
    //       <div className="mb-4">
    //         <h3 className="font-semibold text-Cprimary text-sm mb-2">Hobbies:</h3>
    //         <div className="flex flex-wrap gap-2">
    //           {candidate.hobbies.map((hobby, index) => (
    //             <Badge 
    //               key={index} 
    //               variant="secondary" 
    //               className="bg-Csecondary text-Cprimary px-2 py-1 text-sm"
    //             >
    //               {hobby}
    //             </Badge>
    //           ))}
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Link>
    // </Card>
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
    <Link href={`candidate/${candidate.id}`}>
      <CardHeader className="p-0">
        <AspectRatio ratio={4/3}>
          <Image
            src={candidate.profileImage}
            alt={candidate.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`${candidate.gender === "male" ? "text-Cprimary" : "text-Caccent"} text-xl font-bold truncate`}>
            {candidate.name}
      </h2>
        </div>
        <p className="text-green-500 font-semibold text-sm mb-1">{candidate.major}</p>
        <p className="text-gray-600 text-sm mb-2">Age: {candidate.age}</p>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Height: {candidate.height}</span>
          <span>Weight: {candidate.weight}</span>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">{candidate.intro}</p>
        <div>
          <div className="flex flex-wrap gap-2">
          <h3 className="font-semibold text-Cprimary text-sm mb-2">Hobbies:</h3>

            {candidate.hobbies.map((hobby, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-Csecondary text-Cprimary px-2 py-1 text-xs"
              >
                {hobby}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Link>
  </Card>
  );
};

export default CandidateCard;

