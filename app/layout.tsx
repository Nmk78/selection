import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import ConvexClientProvider from "./ConvexClientProvider";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

const quindelia = localFont({
  src: "./fonts/quindelia.regular.ttf",
  variable: "--font-quindelia",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000"),
  title: {
    default: "PU Selection - Vote for the Best!",
    template: "%s | PU Selection",
  },
  description:
    "Join the Polytechnic University Myeik Selection App to vote and help select the university's King, Queen, Prince, and Princess. Participate in two exciting voting rounds to make your voice heard!",
  keywords: [
    "Polytechnic University Myeik Selection",
    "Myeik Polytechnic University",
    "university selection",
    "voting",
  ],
  authors: [{ name: "Nay Myo Khant" }],
  creator: "Nay Myo Khant",
  publisher: "Nay Myo Khant",
  openGraph: {
    title: "Polytechnic University Myeik Selection - Engage and Vote!",
    description:
      "The Polytechnic University Myeik Selection App empowers students to choose their King, Queen, Prince, and Princess. Dive into two rounds of voting with unique criteria and be part of the decision!",
    url: process.env.BASE_URL || "http://localhost:3000",
    siteName: "Polytechnic University Myeik Selection",
    images: [
      {
        url: `${process.env.BASE_URL || "http://localhost:3000"}/logo.webp`,
        alt: "Polytechnic University Myeik Logo",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polytechnic University Myeik Selection - Be the Judge!",
    description:
      "Cast your votes for the King, Queen, Prince, and Princess in the Polytechnic University Myeik Selection App. Join the excitement now!",
    images: [`${process.env.BASE_URL || "http://localhost:3000"}/logo.webp`],
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
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: process.env.BASE_URL || "http://localhost:3000",
  },
  verification: {
    google: 'google-site-verification=hl50lR1LuO-kJssMwyclFm_cDIla_IV_ac0iwkqDS-4',
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${quindelia.variable} ${geistMono.variable} ${geistSans.variable} h-screen antialiased bg-background flex flex-col items-center`}
      >
        <ConvexClientProvider>
          <Nav />
          {children}
          <Toaster />
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
