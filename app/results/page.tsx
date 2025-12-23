import { Metadata } from "next";
import ResultsContent from "./ResultsContent";

export const metadata: Metadata = {
  title: "PU Selection Winners - Results",
  description:
    "View the winners of PU Selection! See who won the titles of King, Queen, Prince, and Princess. The grand reveal of our champions.",
  openGraph: {
    title: "PU Selection Winners - Results",
    description:
      "The grand reveal of the PU Selection champions - King, Queen, Prince, and Princess.",
    url: `${process.env.BASE_URL || "http://localhost:3000"}/results`,
    type: "website",
    siteName: "PU Selection",
  },
  twitter: {
    card: "summary_large_image",
    title: "PU Selection Winners - Results",
    description: "The grand reveal of our champions",
  },
  alternates: {
    canonical: `${process.env.BASE_URL || "http://localhost:3000"}/results`,
  },
};

export default function ResultsPage() {
  return <ResultsContent />;
}
