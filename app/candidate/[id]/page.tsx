// import { notFound } from "next/navigation";
// import CandidateDetails from "@/components/CandidateDetails";
// import { getCandidateById } from "@/actions/candidate";

// // Generate metadata for each candidate
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const candidateId = params.id;

//   // Fetch the candidate data using the ID
//   const candidate = await getCandidateById(candidateId);

//   if (!candidate) {
//     return {
//       title: "Candidate Not Found",
//       description: "The requested candidate could not be found.",
//     };
//   }

//   // Generate metadata dynamically
//   return {
//     title: `${candidate.name} - Candidate Profile`,
//     description: `Explore the profile of ${candidate.name}, a participant in the selection process. Learn more about their hobbies, major, and achievements.`,
//     openGraph: {
//       title: `${candidate.name}'s Profile`,
//       description: `Discover ${candidate.name}'s journey in the selection process.`,
//       url: `${process.env.BASE_URL}/candidates/${candidateId}`,
//       images: [
//         {
//           url: candidate.profileImage, // Use the candidate's profile image
//           alt: `${candidate.name}'s profile image`,
//         },
//       ],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `${candidate.name}'s Profile`,
//       description: `Check out ${candidate.name}'s details and achievements in the selection process.`,
//       images: [candidate.profileImage],
//     },
//   };
// }

// // Define the type for the page props
// export default async function CandidatePage({ params }: { params: { id: string } }) {
//   const { id } = params; // Correct: params is an object, not a Promise
//   const candidateData = await getCandidateById(id); // Fetch the candidate data
//   console.log("🚀 ~ CandidatePage ~ candidateData:", candidateData);

//   if (!candidateData) {
//     notFound(); // Redirect to a 404 page if no candidate is found
//   }

//   return (
//     <div className="w-full min-h-screen bg-Cbackground px-0 py-0 sm:px-6 lg:px-8">
//       <main className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
//         <div className="w-full max-w-4xl mx-auto bg-Cbackground md:my-5 rounded-none shadow-lg">
//           <CandidateDetails {...candidateData} />
//         </div>
//       </main>
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import CandidateDetails from "@/components/CandidateDetails";
import { getCandidateById } from "@/actions/candidate";

// Define the type for the page props with params
type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const candidateId = params.id;

  // Fetch the candidate data using the ID
  const candidate = await getCandidateById(candidateId);

  if (!candidate) {
    return {
      title: "Candidate Not Found",
      description: "The requested candidate could not be found.",
    };
  }

  // Generate metadata dynamically
  return {
    title: `${candidate.name} - Candidate Profile`,
    description: `Explore the profile of ${candidate.name}, a participant in the selection process. Learn more about their hobbies, major, and achievements.`,
    openGraph: {
      title: `${candidate.name}'s Profile`,
      description: `Discover ${candidate.name}'s journey in the selection process.`,
      url: `${process.env.BASE_URL}/candidates/${candidateId}`,
      images: [
        {
          url: candidate.profileImage, // Use the candidate's profile image
          alt: `${candidate.name}'s profile image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${candidate.name}'s Profile`,
      description: `Check out ${candidate.name}'s details and achievements in the selection process.`,
      images: [candidate.profileImage],
    },
  };
}

export default async function CandidatePage({ params }: { params: Params }) {
  const { id } = await params;
  const candidateData = await getCandidateById(id); // Fetch the candidate data
  console.log("🚀 ~ CandidatePage ~ candidateData:", candidateData);

  if (!candidateData) {
    notFound(); // Redirect to a 404 page if no candidate is found
  }

  return (
    <div className="w-full min-h-screen bg-Cbackground px-0 py-0 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto bg-Cbackground md:my-5 rounded-none shadow-lg">
          <CandidateDetails {...candidateData} />
        </div>
      </main>
    </div>
  );
}
