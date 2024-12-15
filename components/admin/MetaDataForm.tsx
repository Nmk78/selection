// "use client";

// import { useTransition } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/hooks/use-toast";
// import { addMetadata } from "@/actions/metadata";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// export default function MetadataForm({ closeModal }: any) {
//   const [isPending, startTransition] = useTransition();
//   const queryClient = useQueryClient();

//   const {mutate} = useMutation({
//     mutationFn: async (formData: FormData) => {
//       // Your API call for adding metadata
//       await addMetadata(formData);
//     },
//     onSuccess: () => {
//       // Show success toast notification
//       toast({
//         title: "Success",
//         description: "Metadata saved successfully.",
//       });
//       queryClient.invalidateQueries({ queryKey: ["metadata"] });

//       // Close the modal after success
//       closeModal();
//     },
//     onError: (err: { message: any; }) => {
//       // Show error toast notification
//       toast({
//         title: "Error",
//         //@ts-ignore
//         description: err?.message || "Failed to save metadata.",
//       });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Prevent default form submission

//     if (!e.currentTarget) {
//       toast({ title: "Error", description: "Form submission failed." });
//       return;
//     }

//     const formData = new FormData(e.currentTarget);

//     // Wrap the mutation call inside startTransition for smooth UI updates
//     startTransition(() => {
//       mutate(formData);
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
//       <div>
//         <label htmlFor="title" className="block font-medium">
//           Title
//         </label>
//         <Input
//           id="title"
//           name="title"
//           type="text"
//           required
//           aria-required="true"
//         />
//       </div>
//       <div>
//         <label htmlFor="description" className="block font-medium">
//           Description
//         </label>
//         <Textarea
//           id="description"
//           name="description"
//           rows={4}
//           required
//           aria-required="true"
//         />
//       </div>
//       <Button type="submit" disabled={isPending} className="w-full">
//         {isPending ? "Saving..." : "Save Metadata"}
//       </Button>
//     </form>
//   );
// }

"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { addMetadata } from "@/actions/metadata";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
}

function NumberInputWithControls({
  id,
  label,
  value,
  onChange,
}: NumberInputWithControlsProps) {
  const increment = () => onChange(Math.max(2, value + 1));
  const decrement = () => onChange(Math.max(2, value - 1));

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
}: {
  closeModal: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [maleForSecondRound, setMaleForSecondRound] = useState(2);
  const [femaleForSecondRound, setFemaleForSecondRound] = useState(2);

  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      await addMetadata(formData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Metadata saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["metadata", "archive"] });
      closeModal();
    },
    onError: (err: { message: any }) => {
      toast({
        title: "Error",
        description: err?.message || "Failed to save metadata.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!e.currentTarget) {
      toast({ title: "Error", description: "Form submission failed." });
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("maleForSecondRound", maleForSecondRound.toString());
    formData.append("femaleForSecondRound", femaleForSecondRound.toString());

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
