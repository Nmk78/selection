import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./providers";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
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
