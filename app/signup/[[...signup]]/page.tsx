"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Signup is disabled - redirect to signin (invite-only)
export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signin");
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-Cprimary" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
