"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

// Cookie-based storage for auth tokens
const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${key}=`));
    if (!cookie) return null;
    return decodeURIComponent(cookie.split("=")[1] || "");
  },
  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return;
    // Set cookie with 30 day expiry, secure settings
    const maxAge = 60 * 60 * 24 * 30; // 30 days
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },
  removeItem: (key: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; path=/; max-age=0`;
  },
};

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convex = useMemo(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
    []
  );

  return (
    <ConvexAuthProvider client={convex} storage={cookieStorage}>
      {children}
    </ConvexAuthProvider>
  );
}
