"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function SpecialKeyManager({ userId }: { userId: string }) {
  const [specialKey, setSpecialKey] = useState("");

  const specialKeysData = useQuery(api.secretKeys.getAllSpecial);
  const addSpecialKey = useMutation(api.secretKeys.addSpecialKey);

  const isLoading = specialKeysData === undefined;
  const specialKeys = specialKeysData?.data ?? [];

  const addJudgeKey = async () => {
    if (!specialKey) {
      toast({
        title: "No Key Entered",
        description: "Please enter a judge key before adding.",
      });
      return;
    }

    if (specialKeys.includes(specialKey)) {
      toast({
        title: "Duplicate Key",
        description: "This judge key has already been added.",
      });
      return;
    }

    try {
      await addSpecialKey({ userId, specialSecretKey: specialKey });
      setSpecialKey("");
      toast({
        title: "Judge Key Added",
        description: "The judge key has been successfully added to the list.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while adding the key.",
      });
    }
  };

  return (
    <Card className="md:col-span-2 row-span-3 md:row-span-4 ">
      <CardHeader>
        <CardTitle className="w-full flex justify-between items-center">
          <span>Judge Keys</span>
          <Dialog>
            <DialogTrigger asChild>
              {!isLoading && (
                <button className=" p-2 text-blue-500 rounded-md">
                  View ({specialKeys.length})
                </button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Special Keys</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {specialKeys.map((key, index) => (
                  <div key={index} className="py-2 border-b last:border-b-0">
                    {key}
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-full">
          <div className="bg-gray-100 p-4 flex items-center rounded-lg shadow-sm space-x-3">
            <h3 className="text-lg font-bold text-end ">Total</h3>
            <div className="text-sm text-gray-500 font-semibold text-end">
              {isLoading ? "Loading.." : specialKeys.length}
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input
              value={specialKey}
              onChange={(e) => setSpecialKey(e.target.value)}
              placeholder="Enter Special Secret Key"
              className="w-full"
            />
            <Button
              onClick={addJudgeKey}
              className="w-full"
              disabled={!specialKey}
            >
              Add Special Key
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
