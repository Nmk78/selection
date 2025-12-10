"use client";

import SignInForm from "@/components/auth/SignInForm";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Unauthenticated>
        <SignInForm onSuccess={handleSuccess} />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedRedirect />
      </Authenticated>
    </div>
  );
}

function AuthenticatedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-Cprimary" />
      <p className="text-muted-foreground">Redirecting to dashboard...</p>
    </div>
  );
}
