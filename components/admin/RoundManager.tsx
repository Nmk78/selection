"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Unlock, Users, Trophy, Crown, LoaderCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMetadata, updateRound } from "@/actions/metadata";
import { Metadata, Round } from "@prisma/client";

export default function RoundManager() {
  const [round, setRoundState] = useState<Round>("preview");
  const [updating, setUpdating] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: metadata,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["metadata"],
    queryFn: async () => {
      const response = await getMetadata();
      return Array.isArray(response) && response.length > 0
        ? response[0]
        : null;
    },
  });

  const isValidRound = (round: any): round is Round => {
    const validRounds: Round[] = ["preview", "first", "second", "result"];
    return validRounds.includes(round);
  };

  useEffect(() => {
    if (metadata && isValidRound(metadata.round)) {
      setRoundState(metadata.round);
    }
  }, [metadata]);

  const { mutate: updateRoundState } = useMutation({
    mutationFn: async ({ id, round }: { id: string; round: Round }) => {
      setUpdating(true);
      await updateRound({ id, round });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Round state updated successfully.",
      });
      // setRoundState(newState);
      queryClient.invalidateQueries({ queryKey: ["metadata"] });
      setUpdating(false);
    },
    onError: (error) => {
      console.error("Failed to update round state:", error);
      toast({
        title: "Error",
        description: "Failed to update the round state. Try again.",
      });
      setUpdating(false);
    },
  });

  const advanceRound = () => {
    const nextState: Record<Round, Round> = {
      preview: "first",
      first: "second",
      second: "result",
      result: "preview",
    };
    if (metadata) {
      const newState = nextState[round];
      updateRoundState({ id: metadata.id, round: newState });
    }
  };

  const getStateIcon = (state: Round) => {
    switch (state) {
      case "preview":
        return <Lock className="w-12 h-12 text-gray-500" />;
      case "first":
        return <Users className="w-12 h-12 text-blue-500" />;
      case "second":
        return <Trophy className="w-12 h-12 text-yellow-500" />;
      case "result":
        return <Crown className="w-12 h-12 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60 w-full">
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-60 w-full text-red-500">
        Failed to load metadata. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col-reverse md:flex-row justify-around">
        <div className="space-y-4 md:w-[50%] flex flex-col justify-start mt-5 md:mt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="first-round">First Round</Label>
              <Switch
                className=" cursor-not-allowed"
                id="first-round"
                checked={round === "first"}
                // onCheckedChange={() =>
                //   toggleRound(metadata, round === "first" ? "preview" : "first")
                // }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="second-round">Second Round</Label>
              <Switch
                className=" cursor-not-allowed"
                id="second-round"
                checked={round === "second"}
                // onCheckedChange={() =>
                //   toggleRound(metadata, round === "second" ? "first" : "second")
                // }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-results">Show Results</Label>
              <Switch
                className=" cursor-not-allowed"
                id="show-results"
                checked={round === "result"}
                // onCheckedChange={() =>
                //   // toggleRound(metadata, round === "result" ? "preview" : "result")
                // }
              />
            </div>
          </div>
          <Button
            className="mt-10 md:mt-0 text-xs md:w-auto"
            onClick={advanceRound}
          >
            {updating
              ? "Updating"
              : round === "result"
              ? "Close Voting"
              : round === "preview"
              ? "Open First Round"
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
          ) : (
            <div className="flex flex-grow h-32 items-center justify-between bg-gray-100 p-2 rounded-lg">
              <div className="flex items-center space-x-4">
                {getStateIcon(round)}
                <span className="text-lg font-semibold capitalize">
                  {round === "result" ? round : `${round} Round`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
