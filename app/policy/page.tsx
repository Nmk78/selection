import { Metadata } from "next";
import PolicyPage from "@/components/Policy";

export const metadata: Metadata = {
  title: "Voting Policy - PU Selection",
  description:
    "Understand how the PU Selection voting process works. Learn about the two-round voting system, judge scoring, and how winners are determined.",
  openGraph: {
    title: "Voting Policy - PU Selection",
    description:
      "Understand how the PU Selection voting process works - from first round to final results.",
    url: `${process.env.BASE_URL || "http://localhost:3000"}/policy`,
    type: "website",
    siteName: "PU Selection",
  },
  twitter: {
    card: "summary",
    title: "Voting Policy - PU Selection",
    description: "Understand how the selection process works",
  },
  alternates: {
    canonical: `${process.env.BASE_URL || "http://localhost:3000"}/policy`,
  },
};



export default function Page(){
  return <PolicyPage />;
}