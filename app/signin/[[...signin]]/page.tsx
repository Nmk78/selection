"use client";

import SignInForm from "@/components/auth/SignInForm";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Unauthenticated>
        <SignInContent onSuccess={handleSuccess} />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedRedirect />
      </Authenticated>
    </div>
  );
}

function SignInContent({ onSuccess }: { onSuccess: () => void }) {
  const hasUsers = useQuery(api.users.hasUsers);

  if (hasUsers === undefined) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-Cprimary" />
      </div>
    );
  }

  // No users exist - show first admin setup
  if (!hasUsers) {
    return <FirstAdminSetup />;
  }

  return <SignInForm onSuccess={onSuccess} />;
}

function FirstAdminSetup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createFirstAdminInvite = useMutation(api.users.createFirstAdminInvite);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await createFirstAdminInvite({ email });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="w-full max-w-md mx-auto shadow-xl border-green-200 bg-green-50/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-green-800">
              Invite Created!
            </CardTitle>
            <CardDescription className="text-green-700">
              You can now sign in with Google using {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-xl border-Cprimary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-Cprimary">
            Welcome!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Set up your first admin account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-Cprimary">
                Your Google Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the Gmail address you&apos;ll use to sign in
              </p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-Cprimary hover:bg-Cprimary/90"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </motion.div>
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
