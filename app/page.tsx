import { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "PU Selection - Be The Judge!",
  description:
    "Join the PU Selection App to vote and help select the university's King, Queen, Prince, and Princess. Participate in two exciting voting rounds to make your voice heard!",
  openGraph: {
    title: "PU Selection - Engage and Vote!",
    description:
      "The PU Selection App empowers students to choose their King, Queen, Prince, and Princess. Dive into two rounds of voting with unique criteria and be part of the decision!",
    url: process.env.BASE_URL || "http://localhost:3000",
    images: [
      {
        url: `${process.env.BASE_URL || "http://localhost:3000"}/logo.webp`,
        alt: "PU Selection App Logo",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "PU Selection",
  },
  twitter: {
    card: "summary_large_image",
    title: "PU Selection - Be the Judge!",
    description:
      "Cast your votes for the King, Queen, Prince, and Princess in the PU Selection App. Join the excitement now!",
    images: [`${process.env.BASE_URL || "http://localhost:3000"}/logo.webp`],
  },
  alternates: {
    canonical: process.env.BASE_URL || "http://localhost:3000",
  },
};

export default function Home() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PU Selection",
    description: "Vote for the university's King, Queen, Prince, and Princess",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?filter={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
