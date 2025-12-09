"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KeyStatus } from "@/components/key/KeyStatus";
import { KeyInputForm } from "@/components/key/Secretkeyform";

function CheckContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "";

  const status = useQuery(
    api.secretKeys.validate,
    key ? { key } : "skip"
  );

  if (key && status === undefined) {
    return (
      <div className="min-h-[75vh] w-full bg-Cbackground flex flex-col items-center justify-center p-4 px-10">
        <div className="mt-20 w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-center text-Cprimary">
            Key Status Check
          </h1>
          <LoaderCircle className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] w-full bg-Cbackground flex flex-col items-center justify-center p-4 px-10">
      <div className="mt-20 w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center text-Cprimary">
          Key Status Check
        </h1>
        {(!key || !status) && <KeyInputForm />}
        {key && status && <KeyStatus status={status} />}
      </div>
    </div>
  );
}

export default function KeyStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] w-full bg-Cbackground flex flex-col items-center justify-center p-4 px-10">
          <div className="mt-20 w-full max-w-md space-y-8">
            <h1 className="text-3xl font-bold text-center text-Cprimary">
              Key Status Check
            </h1>
            <LoaderCircle className="w-8 h-8 animate-spin mx-auto" />
          </div>
        </div>
      }
    >
      <CheckContent />
    </Suspense>
  );
}
