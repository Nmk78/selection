"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, Minus, BadgeInfo } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

interface NumberInputWithControlsProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
}

interface MetadataFormData {
  _id?: Id<"metadata">;
  title: string;
  description: string;
  maleForSecondRound: number;
  femaleForSecondRound: number;
  leaderBoardCandidates: number;
}

function NumberInputWithControls({
  id,
  label,
  value,
  onChange,
  minValue = 2,
}: NumberInputWithControlsProps) {
  const increment = () => onChange(Math.max(minValue, value + 1));
  const decrement = () => onChange(Math.max(minValue, value - 1));

  return (
    <div>
      <label htmlFor={id} className="block font-medium mb-2">
        {label}
      </label>
      <div className="flex items-center">
        <Button type="button" variant="outline" size="icon" onClick={decrement}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={id}
          name={id}
          type="number"
          value={value}
          readOnly
          className="mx-2 w-20 text-center"
        />
        <Button type="button" variant="outline" size="icon" onClick={increment}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function MetadataForm({
  closeModal,
  initialData,
}: {
  closeModal: () => void;
  initialData?: MetadataFormData | null;
}) {
  const [isPending, setIsPending] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maleForSecondRound, setMaleForSecondRound] = useState(5);
  const [femaleForSecondRound, setFemaleForSecondRound] = useState(5);
  const [candidatesForLeaderboard, setCandidatesForLeaderboard] = useState(5);

  const createMetadata = useMutation(api.metadata.create);
  const editMetadata = useMutation(api.metadata.edit);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setMaleForSecondRound(initialData.maleForSecondRound);
      setFemaleForSecondRound(initialData.femaleForSecondRound);
      setCandidatesForLeaderboard(initialData.leaderBoardCandidates);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (initialData && initialData._id) {
        // Editing existing metadata
        await editMetadata({
          id: initialData._id,
          title: title || undefined,
          description: description || undefined,
          maleForSecondRound: maleForSecondRound,
          femaleForSecondRound: femaleForSecondRound,
          leaderBoardCandidates: candidatesForLeaderboard,
        });

        toast({
          title: "Success",
          description: "Metadata updated successfully.",
        });
      } else {
        // Creating new metadata
        await createMetadata({
          title,
          description,
          maleForSecondRound,
          femaleForSecondRound,
          leaderBoardCandidates: candidatesForLeaderboard,
        });

        toast({
          title: "Success",
          description: "Metadata saved successfully.",
        });
      }
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save metadata.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-required="true"
        />
      </div>

      <div id="count" className="grid grid-cols-3 gap-4">
        <NumberInputWithControls
          id="maleForSecondRound"
          label="Male Count"
          value={maleForSecondRound}
          onChange={setMaleForSecondRound}
        />
        <NumberInputWithControls
          id="femaleForSecondRound"
          label="Female Count"
          value={femaleForSecondRound}
          onChange={setFemaleForSecondRound}
        />
        <div className="mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <BadgeInfo className="w-8 h-8 text-blue-600" />
              </TooltipTrigger>
              <TooltipContent className="border-2 p-2 rounded-md bg-white">
                <p>Bring to next round</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div id="leaderboard" className="grid grid-cols-3 gap-4">
        <NumberInputWithControls
          id="leaderboardCandidate"
          label="Leaderboard Top"
          value={candidatesForLeaderboard}
          onChange={setCandidatesForLeaderboard}
          minValue={1}
        />
        <div className="col-span-2 mt-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <BadgeInfo className="w-8 h-8 text-blue-600" />
              </TooltipTrigger>
              <TooltipContent className="border-2 p-2 rounded-md bg-white">
                <p>Number of top candidates to show on leaderboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          aria-required="true"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : initialData ? "Update Metadata" : "Save Metadata"}
      </Button>
    </form>
  );
}