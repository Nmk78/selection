import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        
          {status.isValid ? (
            <div className="space-y-4">
            <div className="flex items-center justify-start space-x-3">
              <span className="font-medium text-Cprimary">Key Validity</span>
              {status.isValid ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
            </div>
            {/* <div className="grid grid-cols-2 gap-4"> */}
              <div className="space-y-2 flex justify-between items-center" title="green means you are legit to vote and red cross meant it was already voted">
                {/* <h3 className="font-semibold text-Cprimary">First Round</h3> */}
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-sm text-Cprimary" >Male Vote</span>
                  <StatusIcon isActive={status.maleVoteFirstRound} />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-sm text-Cprimary">Female Vote</span>
                  <StatusIcon isActive={status.femaleVoteFirstRound} />
                </div>
              </div>
              {/* <div className="space-y-2">
                <h3 className="font-semibold text-Cprimary">Second Round</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-Cprimary">Male Vote</span>
                  <StatusIcon isActive={status.maleVoteSecondRound} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-Cprimary">Female Vote</span>
                  <StatusIcon isActive={status.femaleVoteSecondRound} />
                </div>
              </div> */}
            {/* </div> */}
            </div>

          ) : (
            <div className="flex items-center justify-between">
              <span className="font-medium text-Cprimary">Key Validity</span>
              {status.isValid ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}
