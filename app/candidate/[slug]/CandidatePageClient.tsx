"use client";

import CandidateDetailsComponent from "@/components/CandidateDetails";


interface Candidate {
  _id: string;
  name: string;
  major: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  intro: string;
  hobbies: string[];
  carouselImages: string[];
  profileImage: string;
  slug?: string;
}

export default function CandidatePageClient({ candidate }: { candidate: Candidate }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const slug = candidate.slug || "";

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.name,
    description: candidate.intro || `Meet ${candidate.name}, a ${candidate.major} student.`,
    image: candidate.profileImage || `${baseUrl}/user.png`,
    jobTitle: candidate.gender === "male" ? "King/Prince Candidate" : "Queen/Princess Candidate",
    affiliation: {
      "@type": "Organization",
      name: "PU Selection",
    },
    url: `${baseUrl}/candidate/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full min-h-screen bg-Cbackground px-0 py-0 sm:px-6 lg:px-8">
        <main className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl mx-auto bg-Cbackground md:my-5 rounded-none shadow-lg">
            <CandidateDetailsComponent
              id={candidate._id}
              name={candidate.name}
              major={candidate.major}
              age={candidate.age}
              gender={candidate.gender}
              height={candidate.height}
              weight={candidate.weight}
              intro={candidate.intro}
              hobbies={candidate.hobbies}
              carouselImages={candidate.carouselImages}
              profileImage={candidate.profileImage}
            />
          </div>
        </main>
      </div>
    </>
  );
}

