import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';

const quindelia = localFont({
  src: "./fonts/quindelia.regular.ttf", // Correct lowercase
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

  // Open Graph Tags for social media sharing
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
    locale: "en_US", // Add appropriate locale
    siteName: "PU Selection",
  },

  // Twitter Card Tags
  twitter: {
    card: "summary_large_image",
    title: "PU Selection - Be the Judge!",
    description:
      "Cast your votes for the King, Queen, Prince, and Princess in the PU Selection App. Join the excitement now!",
    images: [`${process.env.BASE_URL || "https://example.com"}/logo.webp`],
  },

  // Favicon
  icons: {
    icon: "/favicon.ico",
  },

  // Canonical URL
  // canonical: process.env.BASE_URL || "https://example.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <ReactQueryProvider>
        <html lang="en">
          <body
            // className={` h-screen antialiased bg-background flex flex-col items-center`}
            className={`${quindelia.variable} ${geistMono.variable} ${geistSans.variable} h-screen antialiased bg-background flex flex-col items-center`}
          >
            <Nav />
            {children}
            <Toaster />
            {process.env.NODE_ENV !== "production" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
            <Analytics />
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
