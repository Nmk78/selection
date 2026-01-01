import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArchiveCandidatePageClient from "./ArchiveCandidatePageClient";
import { getArchivedCandidateBySlug } from "@/lib/convex-server";

type Props = {
  params: Promise<{ slug: string; candidateSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, candidateSlug } = await params;
  const candidate = await getArchivedCandidateBySlug(candidateSlug, slug);

  if (!candidate) {
    return {
      title: "Candidate Not Found - PU Selection Archive",
      description: "The archived candidate you're looking for doesn't exist.",
    };
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const title = candidate.title 
    ? `${candidate.name} - ${candidate.title} | PU Selection Archive`
    : `${candidate.name} - PU Selection Archive Candidate`;
  
  const description = candidate.intro
    ? `${candidate.intro.substring(0, 155)}${candidate.intro.length > 155 ? "..." : ""}`
    : `Meet ${candidate.name}${candidate.title ? `, the ${candidate.title}` : ""}, a ${candidate.major} student from ${candidate.room || "PU Selection"} archive.`;

  const profileImage = candidate.profileImage || `${baseUrl}/user.png`;
  const pageUrl = `${baseUrl}/archive/${slug}/${candidateSlug}`;

  return {
    title,
    description,
    keywords: [
      candidate.name,
      candidate.major,
      candidate.title || "",
      candidate.room || "",
      "PU Selection",
      "Archive",
      candidate.gender === "male" ? "King Prince" : "Queen Princess",
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: profileImage,
          alt: `${candidate.name} - PU Selection Archive Candidate`,
          width: 1200,
          height: 630,
        },
      ],
      type: "profile",
      siteName: "PU Selection",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [profileImage],
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ArchiveCandidatePage({ params }: Props) {
  const { slug, candidateSlug } = await params;
  const candidate = await getArchivedCandidateBySlug(candidateSlug, slug);

  if (!candidate) {
    notFound();
  }

  return <ArchiveCandidatePageClient archiveId={slug} slug={candidateSlug} />;
}

