"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Unlock, Users, Trophy, Crown } from "lucide-react";
import { ScrollArea } from "../scroll-area";

type RoundState = "closed" | "first" | "second" | "results";

interface Candidate {
  id: string;
  name: string;
  votes: number;
}

// Mock data for candidates
const mockCandidates: Candidate[] = [
  { id: "1", name: "Alice", votes: 120 },
  { id: "2", name: "Bob", votes: 110 },
  { id: "3", name: "Charlie", votes: 100 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
  { id: "4", name: "Diana", votes: 95 },
];

export default function RoundManager() {
  const [roundState, setRoundState] = useState<RoundState>("closed");

  const toggleRound = (newState: RoundState) => {
    setRoundState(newState);
    toast({
      title: `Round State Changed`,
      description: `The selection is now in the ${newState} state.`,
      variant: "round",
    });
  };

  const advanceRound = () => {
    const nextState: Record<RoundState, RoundState> = {
      closed: "first",
      first: "second",
      second: "results",
      results: "closed",
    };
    toggleRound(nextState[roundState]);
  };

  const getStateIcon = (state: RoundState) => {
    switch (state) {
      case "closed":
        return <Lock className="w-12 h-12 text-gray-500" />;
      case "first":
        return <Users className="w-12 h-12 text-blue-500" />;
      case "second":
        return <Trophy className="w-12 h-12 text-yellow-500" />;
      case "results":
        return <Crown className="w-12 h-12 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse md:flex-row justify-around">
        <div className="space-y-4 flex flex-col justify-around mt-3">
          <div className="space-y-4">
          {/* <h3 className="text-lg font-semibold mb-4"></h3> */}

            <div className="flex items-center justify-between">
              <Label htmlFor="first-round">First Round</Label>
              <Switch
                id="first-round"
                checked={roundState === "first"}
                onCheckedChange={() =>
                  toggleRound(roundState === "first" ? "closed" : "first")
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="second-round">Second Round</Label>
              <Switch
                id="second-round"
                checked={roundState === "second"}
                onCheckedChange={() =>
                  toggleRound(roundState === "second" ? "first" : "second")
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-results">Show Results</Label>
              <Switch
                id="show-results"
                checked={roundState === "results"}
                onCheckedChange={() =>
                  toggleRound(roundState === "results" ? "second" : "results")
                }
              />
            </div>
          </div>
          <Button
            className=" mt-10 text-xs md:text-lg md:w-auto"
            onClick={advanceRound}
          >
            {roundState === "results"
              ? "Close Voting"
              : roundState === "closed"
              ? "Open First Round"
              : "Advance to Next Round"}
          </Button>
        </div>

        <div className="w-full md:w-1/2">
          {/* <h3 className="text-lg font-semibold mb-4">Candidate Display</h3> */}
          {roundState === "closed" ? (
            <div className="flex flex-grow p-2 items-center justify-center h-40 bg-gray-100 rounded-lg">
              <Lock className="w-12 h-12 text-gray-400" />
              <span className="ml-2 text-gray-500 text-center">
                Voting is currently closed
              </span>
            </div>
          ) : (
            <div className="flex flex-grow h-40 items-center justify-between bg-gray-100 p-2 rounded-lg">
              <div className="flex  items-center space-x-4">
                {getStateIcon(roundState)}
                <span className="text-lg font-semibold capitalize">
                  {roundState === "results" ? roundState : roundState + "Round"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
