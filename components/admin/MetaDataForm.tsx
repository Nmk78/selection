"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { addMetadata } from "@/actions/metadata";

export default function MetadataForm({ closeModal }: any) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    // Ensure e.currentTarget is not null
    if (!e.currentTarget) {
      toast({ title: "Error", description: "Form submission failed." });
      return;
    }
    const formData = new FormData(e.currentTarget);

    // Wrap your async operation inside startTransition for smooth updates
    startTransition(async () => {
      try {
        // Add metadata logic
        await addMetadata(formData);

        // Show success toast notification
        toast({
          title: "Success",
          description: "Metadata saved successfully.",
        });

        // Close the modal after success
        closeModal();
      } catch (err) {
        // Show error toast notification if something goes wrong
        toast({
          title: "Error",
          //@ts-ignore
          description: err?.message || "Failed to save metadata.",
        });
      }
    });
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
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          required
          aria-required="true"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Save Metadata"}
      </Button>
    </form>
  );
}
