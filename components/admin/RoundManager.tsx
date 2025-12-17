"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, ShieldBan, Users, Trophy, Crown } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Round = "preview" | "first" | "firstVotingClosed" | "secondPreview" | "second" | "secondVotingClosed" | "result";

export default function RoundManager() {
  const [round, setRoundState] = useState<Round>("preview");
  const [updating, setUpdating] = useState(false);

  const metadata = useQuery(api.metadata.getActive);
  const updateRoundMutation = useMutation(api.metadata.updateRound);

  const isLoading = metadata === undefined;

  const isValidRound = (round: string): round is Round => {
    const validRounds: Round[] = [
      "preview",
      "first",
      "firstVotingClosed",
      "secondPreview",
      "second",
      "secondVotingClosed",
      "result",
    ];
    return validRounds.includes(round as Round);
  };

  useEffect(() => {
    if (metadata && isValidRound(metadata.round)) {
      setRoundState(metadata.round);
    }
  }, [metadata]);

  const advanceRound = async () => {
    const nextState: Record<Round, Round> = {
      preview: "first",
      first: "firstVotingClosed",
      firstVotingClosed: "secondPreview",
      secondPreview: "second",
      second: "secondVotingClosed",
      secondVotingClosed: "result",
      result: "preview",
    };
    if (metadata) {
      setUpdating(true);
      try {
        const newState = nextState[round];
        await updateRoundMutation({ id: metadata._id, round: newState });
        toast({
          title: "Success",
          description: "Round state updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update round state:", error);
        toast({
          title: "Error",
          description: "Failed to update the round state. Try again.",
        });
      } finally {
        setUpdating(false);
      }
    }
  };

  const getStateIcon = (state: Round) => {
    switch (state) {
      case "preview":
        return <Lock className="w-12 h-12 text-gray-500" />;
      case "first":
        return <Users className="w-12 h-12 text-blue-500" />;
      case "firstVotingClosed":
        return <ShieldBan className="w-12 h-12 text-red-500" />;
      case "secondPreview":
        return <Lock className="w-12 h-12 text-gray-500" />;
      case "second":
        return <Trophy className="w-12 h-12 text-yellow-500" />;
      case "secondVotingClosed":
        return <ShieldBan className="w-12 h-12 text-red-500" />;
      case "result":
        return <Crown className="w-12 h-12 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="row-span-4 md:col-span-3 md:row-span-3">
        <CardHeader>
          <CardTitle>Selection Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col-reverse md:flex-row justify-around">
              <div className="space-y-4 md:w-[50%] flex flex-col justify-start mt-5 md:mt-0">
                <div className="space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="w-full md:w-[45%]">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="row-span-4 md:col-span-3 md:row-span-3">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          Selection Rounds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col-reverse md:flex-row justify-around">
            <div className="space-y-4 md:w-[50%] flex flex-col justify-start mt-5 md:mt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="first-round">First Round</Label>
                  <Switch
                    className="cursor-not-allowed text-red-600 bg-red-600"
                    id="first-round"
                    checked={round === "first" || round === "firstVotingClosed"}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="second-round">Second Round</Label>
                  <Switch
                    className="cursor-not-allowed"
                    id="second-round"
                    checked={
                      round === "second" ||
                      round === "secondPreview" ||
                      round === "secondVotingClosed"
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-results">Show Results</Label>
                  <Switch
                    className="cursor-not-allowed"
                    id="show-results"
                    checked={round === "result"}
                  />
                </div>
              </div>
              <Button
                className="mt-10 md:mt-0 text-xs md:w-auto"
                onClick={advanceRound}
                disabled={updating}
              >
                {updating
                  ? "Updating"
                  : round === "result"
                  ? "Back to first round"
                  : round === "firstVotingClosed"
                  ? "Open Second Round Preview"
                  : round === "secondVotingClosed"
                  ? "Show Results"
                  : "Advance to Next Round"}
              </Button>
            </div>
            <div className="w-full md:w-[45%]">
              {round === "preview" ? (
                <div className="flex flex-grow p-2 items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <Lock className="w-12 h-12 text-gray-400" />
                  <span className="ml-2 text-gray-500 text-center">
                    Voting is currently closed
                  </span>
                </div>
              ) : round === "first" ? (
                <div className="flex flex-grow h-32 items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStateIcon(round)}
                    <span className="text-lg font-semibold capitalize">
                      {round} Round
                    </span>
                  </div>
                </div>
              ) : round === "firstVotingClosed" ? (
                <div className="flex flex-grow p-2 items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <span className="ml-2 text-gray-500 text-center">
                    First round voting has ended.
                  </span>
                </div>
              ) : round === "secondPreview" ? (
                <div className="flex flex-grow p-2 items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <span className="ml-2 text-gray-500 text-center">
                    Second round preview
                  </span>
                </div>
              ) : round === "second" ? (
                <div className="flex flex-grow h-32 items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStateIcon(round)}
                    <span className="text-lg font-semibold capitalize">
                      {round} Round
                    </span>
                  </div>
                </div>
              ) : round === "secondVotingClosed" ? (
                <div className="flex flex-grow p-2 items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <span className="ml-2 text-gray-500 text-center">
                    Second round voting has ended.
                  </span>
                </div>
              ) : round === "result" ? (
                <div className="flex flex-grow p-2 items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <Crown className="w-12 h-12 text-pink-500" />
                  <span className="ml-2 text-gray-500 text-center">
                    The final results are displaying
                  </span>
                </div>
              ) : (
                <div className="flex flex-grow p-2 items-center justify-center h-32 bg-gray-100 rounded-lg">
                  <span className="ml-2 text-gray-500 text-center">
                    Unknown round state
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
