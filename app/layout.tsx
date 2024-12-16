import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./providers";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Metadata } from "next";

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
  title: 'PU Selection',
  description: 'The PU Selection App allows users to vote and select students for various positions, including king, queen, prince, and princess. The app features two rounds of voting based on different criteria for each position.',
  
  // Open Graph Tags for social media sharing
  openGraph: {
    title: 'PU Selection App',
    description: 'A platform for university students to vote and select the king, queen, prince, and princess. Participate in the first and second rounds of voting!',
    url: process.env.BASE_URL,
    // image: 'URL_to_image.jpg',
    type: 'website',
  },

  // Twitter Card Tags
  twitter: {
    card: 'summary_large_image',
    title: 'PU Selection App',
    description: 'Vote for the king, queen, prince, and princess in the PU Selection App!',
    // image: 'URL_to_image.jpg',
  },

  // Favicon
  icons: {
    icon: '/favicon.ico',
  },

  // Canonical URL
  // canonical: process.env.BASE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang="en">
          <body
            className={`${quindelia.variable} ${geistMono.variable} ${geistSans.variable} h-screen antialiased bg-background flex flex-col items-center`}
          >
            <Nav isAdmin={true} />
            {children}
            <Toaster />
            {process.env.NODE_ENV !== "production" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
