import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface KeyStatusProps {
  status: {
    isValid: boolean;
    maleVoteFirstRound: boolean;
    femaleVoteFirstRound: boolean;
    maleVoteSecondRound: boolean;
    femaleVoteSecondRound: boolean;
  };
}

export function KeyStatus({ status }: KeyStatusProps) {
  const StatusIcon = ({ isActive }: { isActive: boolean }) =>
    isActive ? (
      <XCircle className="text-red-500" />
    ) : (
      <CheckCircle className="text-green-500" />
    );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-Cprimary">
          Key Status
        </CardTitle>
        <CardDescription>
          {status.isValid ? "Your key is valid." : "Your key is invalid."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-Cprimary">Key Validity</span>
            {status.isValid ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <XCircle className="text-red-500" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-Cprimary">First Round</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-Cprimary">Male Vote</span>
                <StatusIcon isActive={status.maleVoteFirstRound} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-Cprimary">Female Vote</span>
                <StatusIcon isActive={status.femaleVoteFirstRound} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-Cprimary">Second Round</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-Cprimary">Male Vote</span>
                <StatusIcon isActive={status.maleVoteSecondRound} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-Cprimary">Female Vote</span>
                <StatusIcon isActive={status.femaleVoteSecondRound} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
