import { CheckCircle, XCircle, Shield, Vote } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface KeyStatusProps {
  status: {
    isValid: boolean;
    maleVoteFirstRound?: boolean;
    femaleVoteFirstRound?: boolean;
    maleVoteSecondRound?: boolean;
    femaleVoteSecondRound?: boolean;
  };
}

export function KeyStatus({ status }: KeyStatusProps) {
  const StatusIcon = ({ isActive }: { isActive: boolean | undefined }) =>
    isActive ? (
      <XCircle className="w-5 h-5 text-red-500" />
    ) : (
      <CheckCircle className="w-5 h-5 text-green-500" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg rounded-2xl shadow-xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden">
        <CardHeader
          className={`pb-4 ${
            status.isValid
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          }`}
        >
          <CardTitle className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-white">
            <Shield className="w-5 h-5 md:w-6 md:h-6" />
            <span>Key Status</span>
          </CardTitle>
          <CardDescription className="text-white/90 text-center">
            {status.isValid
              ? "Your key is valid and ready to use."
              : "Your key is invalid or has expired."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {status.isValid ? (
            <div className="space-y-6">
              {/* Key Validity Badge */}
              <div className="flex items-center justify-center">
                <Badge
                  className={`px-4 py-2 text-base ${
                    status.isValid
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }`}
                >
                  {status.isValid ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Valid Key
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Invalid Key
                    </>
                  )}
                </Badge>
              </div>

              {/* Voting Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Vote className="w-5 h-5 text-purple-600" />
                  First Round Voting Status
                </h3>
                <div className="space-y-3">
                  <div
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200"
                    title="Green check means you can vote, red X means already voted"
                  >
                    <span className="font-medium text-purple-700">Male Vote</span>
                    <StatusIcon isActive={status.maleVoteFirstRound} />
                  </div>
                  <div
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200"
                    title="Green check means you can vote, red X means already voted"
                  >
                    <span className="font-medium text-amber-700">Female Vote</span>
                    <StatusIcon isActive={status.femaleVoteFirstRound} />
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700 text-center">
                  <strong>Note:</strong> Green check means you are eligible to vote. Red X means
                  you have already voted.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-lg font-semibold text-gray-700">
                Invalid Key
              </p>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Please check your key and try again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
