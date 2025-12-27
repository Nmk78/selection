"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle, Key, Sparkles, Crown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KeyStatus } from "@/components/key/KeyStatus";
import { KeyInputForm } from "@/components/key/Secretkeyform";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

function CheckContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "";

  const status = useQuery(
    api.secretKeys.validate,
    key ? { key } : "skip"
  );

  if (key && status === undefined) {
    return (
      <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-4 px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg space-y-8"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Key className="w-6 h-6 md:w-8 md:h-8 text-candidate-male-600" />
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-candidate-male-600 via-candidate-female-600 to-candidate-male-600 bg-clip-text text-transparent">
                Key Status Check
              </h1>
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-candidate-female-600" />
            </div>
          </div>
          <Card className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200/50 rounded-2xl shadow-xl">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <LoaderCircle className="w-12 h-12 animate-spin text-candidate-male-600 mb-4" />
              <p className="text-gray-600">Validating your key...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-4 px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg space-y-6"
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Key className="w-6 h-6 md:w-8 md:h-8 text-candidate-male-600" />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-candidate-male-600 via-candidate-female-600 to-candidate-male-600 bg-clip-text text-transparent">
              Key Status Check
            </h1>
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-candidate-female-600" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Sparkles className="w-4 h-4 text-candidate-male-500 animate-pulse" />
            <p className="text-sm md:text-base text-gray-600">
              Verify your voting key status
            </p>
            <Sparkles className="w-4 h-4 text-candidate-female-500 animate-pulse" />
          </div>
        </div>
        {(!key || !status) && <KeyInputForm />}
        {key && status && <KeyStatus status={status} />}
      </motion.div>
    </div>
  );
}

export default function KeyStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-4 px-10">
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Key className="w-6 h-6 md:w-8 md:h-8 text-candidate-male-600" />
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-candidate-male-600 via-candidate-female-600 to-candidate-male-600 bg-clip-text text-transparent">
                  Key Status Check
                </h1>
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-candidate-female-600" />
              </div>
            </div>
            <Card className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200/50 rounded-2xl shadow-xl">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <LoaderCircle className="w-12 h-12 animate-spin text-candidate-male-600 mb-4" />
                <p className="text-gray-600">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <CheckContent />
    </Suspense>
  );
}
