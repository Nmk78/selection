import { Metadata } from "next";
import { notFound } from "next/navigation";
import CandidatePageClient from "./CandidatePageClient";
import { getCandidateBySlug } from "@/lib/convex-server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const candidate = await getCandidateBySlug(slug);

  if (!candidate) {
    return {
      title: "Candidate Not Found - PU Selection",
      description: "The candidate you're looking for doesn't exist.",
    };
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const title = `${candidate.name} - PU Selection Candidate`;
  const description = candidate.intro
    ? `${candidate.intro.substring(0, 155)}${candidate.intro.length > 155 ? "..." : ""}`
    : `Meet ${candidate.name}, a ${candidate.major} student running for ${candidate.gender === "male" ? "King/Prince" : "Queen/Princess"} in PU Selection.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/candidate/${slug}`,
      images: [
        {
          url: candidate.profileImage || `${baseUrl}/user.png`,
          alt: `${candidate.name} - PU Selection Candidate`,
          width: 1200,
          height: 630,
        },
      ],
      type: "profile",
      siteName: "PU Selection",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [candidate.profileImage || `${baseUrl}/user.png`],
    },
    alternates: {
      canonical: `${baseUrl}/candidate/${slug}`,
    },
  };
}

export default async function CandidatePage({ params }: Props) {
  const { slug } = await params;
  const candidate = await getCandidateBySlug(slug);

  if (!candidate) {
    notFound();
  }

  return <CandidatePageClient candidate={{ ...candidate, slug }} />;
}
