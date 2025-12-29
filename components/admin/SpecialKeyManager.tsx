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
import { Id } from "@/convex/_generated/dataModel";
import {
  Key,
  Eye,
  Plus,
  Loader2,
  Copy,
  CheckCircle2,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SpecialKeyManager({ userId }: { userId: Id<"users"> }) {
  const [specialKey, setSpecialKey] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const specialKeysData = useQuery(api.secretKeys.getAllSpecial);
  const addSpecialKey = useMutation(api.secretKeys.addSpecialKey);

  const isLoading = specialKeysData === undefined;
  const specialKeys = specialKeysData?.data ?? [];

  const addJudgeKey = async () => {
    if (!specialKey.trim()) {
      toast({
        title: "No Key Entered",
        description: "Please enter a judge key before adding.",
        variant: "destructive",
      });
      return;
    }

    if (specialKeys.includes(specialKey.trim())) {
      toast({
        title: "Duplicate Key",
        description: "This judge key has already been added.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addSpecialKey({ userId, specialSecretKey: specialKey.trim() });
      setSpecialKey("");
      toast({
        title: "Success!",
        description: "The judge key has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while adding the key.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (key: string, index: number) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Key copied to clipboard",
      });
    } catch (error) {
      console.log("🚀 ~ copyToClipboard ~ error:", error)
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 row-span-3 md:row-span-4 border-2 shadow-lg overflow-hidden flex flex-col w-full min-h-[400px] md:min-h-0">
      <CardHeader className="bg-gradient-to-r py-3 pb-0 flex-shrink-0">
        <CardTitle className="w-full py-0 flex justify-between items-center">
          <div className="flex flex-col items-start gap-3 min-w-0">
            <h3 className="text-xl font-bold text-gray-800">Judge Keys</h3>
            {/* <p className="text-sm text-gray-500 font-normal">Manage special access keys</p> */}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              {!isLoading && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-2 hover:border-blue-400 hover:bg-blue-50 transition-colors flex-shrink-0"
                >
                  <span>{specialKeys.length}</span>

                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-w-[calc(100vw-2rem)]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Key className="w-6 h-6 text-blue-600" />
                  All Special Keys
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full rounded-md border-2 p-4 mt-4">
                {specialKeys.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Hash className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      No keys added yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add your first key to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pr-2">
                    {specialKeys.map((key, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 min-w-0"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                          <div className="p-1.5 bg-blue-100 rounded-md flex-shrink-0">
                            <Key className="w-4 h-4 text-blue-600" />
                          </div>
                          <code className="text-sm font-mono text-gray-700 break-words flex-1 min-w-0">
                            {key}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key, index)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Statistics Card */}
          <Card className="bg-gradient-to-br from-candidate-male-50/50 to-candidate-female-50/50 border-candidate-male-200/50 overflow-hidden relative">
            <CardContent className="p-4 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none" />
              <div className="flex flex-row items-center justify-between z-10 mb-1">
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <Key className="w-5 h-5 text-candidate-male-600 flex-shrink-0" />
                  <p className="text-xl font-bold text-candidate-male-600 truncate">
                    Total Keys
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-2xl text-candidate-male-600 font-bold">
                    {specialKeys.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Add Key Form */}
          <form
            className="space-y-4 flex-shrink-0"
            onSubmit={(e) => {
              e.preventDefault();
              addJudgeKey();
            }}
          >
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  value={specialKey}
                  onChange={(e) => setSpecialKey(e.target.value)}
                  placeholder="Enter judge key..."
                  className="w-full pl-10 pr-4 py-6 border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button
              type="submit"
              onClick={addJudgeKey}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 shadow-md hover:shadow-lg transition-all duration-200"
              disabled={!specialKey.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Special Key
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
