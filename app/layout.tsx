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
  title: "PU Selection - Vote for the Best!",
  description:
    "Join the PU Selection App to vote and help select the university's King, Queen, Prince, and Princess. Participate in two exciting voting rounds to make your voice heard!",

  openGraph: {
    title: "PU Selection - Engage and Vote!",
    description:
      "The PU Selection App empowers students to choose their King, Queen, Prince, and Princess. Dive into two rounds of voting with unique criteria and be part of the decision!",
    url: process.env.BASE_URL || "https://example.com",
    images: [
      {
        url: `${process.env.BASE_URL || "https://example.com"}/logo.webp`,
        alt: "PU Selection App Logo",
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
    images: [`${process.env.BASE_URL || "https://example.com"}/logo.webp`],
  },

  icons: {
    icon: "/favicon.ico",
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
