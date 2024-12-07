import localFont from "next/font/local";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";

// Import fonts
const quindelia = localFont({
  src: "./fonts/quindelia.regular.ttf",
  variable: "--font-quindelia",
});

const geistMono = localFont({
  src: "./fonts/geistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900", // Specify weights if the font is variable
});

const geistSans = localFont({
  src: "./fonts/geistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Export layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body
        className={`${quindelia.variable} ${geistMono.variable} ${geistSans.variable} h-screen antialiased bg-background flex flex-col items-center `}
      >
        <Nav isAdmin={true}/>
        {children}
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
