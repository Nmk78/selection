"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { addMetadata } from "@/actions/metadata";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function MetadataForm({ closeModal }: any) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: async (formData: FormData) => {
      // Your API call for adding metadata
      await addMetadata(formData);
    },
    onSuccess: () => {
      // Show success toast notification
      toast({
        title: "Success",
        description: "Metadata saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["metadata"] });


      // Close the modal after success
      closeModal();
    },
    onError: (err: { message: any; }) => {
      // Show error toast notification
      toast({
        title: "Error",
        //@ts-ignore
        description: err?.message || "Failed to save metadata.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    if (!e.currentTarget) {
      toast({ title: "Error", description: "Form submission failed." });
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Wrap the mutation call inside startTransition for smooth UI updates
    startTransition(() => {
      mutate(formData);
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
