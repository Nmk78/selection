"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, Minus, BadgeInfo, Loader2, Save, X } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface NumberInputWithControlsProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  disabled?: boolean;
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
  disabled = false,
}: NumberInputWithControlsProps) {
  const increment = () => onChange(Math.max(minValue, value + 1));
  const decrement = () => onChange(Math.max(minValue, value - 1));

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={disabled || value <= minValue}
          className="h-9 w-9"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={id}
          name={id}
          type="number"
          value={value}
          readOnly
          disabled={disabled}
          className="w-20 text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={disabled}
          className="h-9 w-9"
        >
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
          description: "Room updated successfully.",
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
          description: "Room created successfully.",
        });
      }
      closeModal();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isPending}
          placeholder="Enter room title"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
        <NumberInputWithControls
          id="maleForSecondRound"
          label="Male Count"
          value={maleForSecondRound}
          onChange={setMaleForSecondRound}
          disabled={isPending}
        />
        <NumberInputWithControls
          id="femaleForSecondRound"
          label="Female Count"
          value={femaleForSecondRound}
          onChange={setFemaleForSecondRound}
          disabled={isPending}
        />
        <div className="flex items-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <BadgeInfo className="w-6 h-6 text-blue-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Number of candidates to advance to the second round
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
        <NumberInputWithControls
          id="leaderboardCandidate"
          label="Leaderboard Top"
          value={candidatesForLeaderboard}
          onChange={setCandidatesForLeaderboard}
          minValue={1}
          disabled={isPending}
        />
        <div className="col-span-2 flex items-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <BadgeInfo className="w-6 h-6 text-blue-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Number of top candidates to display on the leaderboard
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isPending}
          placeholder="Enter room description"
          className="w-full resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {initialData ? "Update Room" : "Create Room"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isPending}
          className="flex-1 sm:flex-none sm:min-w-[100px]"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
