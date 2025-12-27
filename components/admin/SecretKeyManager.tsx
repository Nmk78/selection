"use client";

import { useState, useMemo } from "react";
import { Key, Loader2, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function SecretKeyManager() {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [keyAmount, setKeyAmount] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = useMutation(api.secretKeys.generateAndInsert);
  const keysData = useQuery(api.secretKeys.getAll);
  const keysWithUsage = useQuery(api.secretKeys.getAllWithUsage);
  
  const totalKeys = keysData?.success ? keysData.data.length : 0;
  
  // Calculate usage statistics
  const stats = useMemo(() => {
    if (!keysWithUsage?.success) {
      return {
        firstRoundUsed: 0,
        firstRoundMale: 0,
        firstRoundFemale: 0,
        secondRoundUsed: 0,
        secondRoundMale: 0,
        secondRoundFemale: 0,
      };
    }

    const keys = keysWithUsage.data;
    const firstRoundMale = keys.filter(k => k.firstRoundMale).length;
    const firstRoundFemale = keys.filter(k => k.firstRoundFemale).length;
    const secondRoundMale = keys.filter(k => k.secondRoundMale).length;
    const secondRoundFemale = keys.filter(k => k.secondRoundFemale).length;

    return {
      firstRoundUsed: firstRoundMale + firstRoundFemale,
      firstRoundMale,
      firstRoundFemale,
      secondRoundUsed: secondRoundMale + secondRoundFemale,
      secondRoundMale,
      secondRoundFemale,
    };
  }, [keysWithUsage]);

  const handleGenerateKeys = async () => {
    const amount = parseInt(keyAmount);
    if (!amount || amount <= 0 || amount > 1000) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a number between 1 and 1000.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateKeys({ amount });
      toast({
        title: "Success",
        description: response.message,
      });
      setIsGenerateDialogOpen(false);
      setKeyAmount("");
    } catch (error) {
      console.error("Generate Keys Error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        {/* Total Keys */}
        <Card className="bg-gradient-to-br from-candidate-male-50/50 to-candidate-female-50/50 border-candidate-male-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-candidate-male-600" />
                <span className="font-semibold text-gray-700">Total Keys</span>
              </div>
              <span className="text-2xl font-bold text-candidate-male-600">
                {keysData === undefined ? (
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                ) : (
                  totalKeys.toLocaleString()
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {/* First Round Usage */}
        <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border-blue-200/50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 text-sm">First</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {keysWithUsage === undefined ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    stats.firstRoundUsed
                  )}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-gray-600">
                <span>M: {keysWithUsage === undefined ? "-" : stats.firstRoundMale}</span>
                <span>F: {keysWithUsage === undefined ? "-" : stats.firstRoundFemale}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Round Usage */}
        <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200/50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 text-sm">Second</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {keysWithUsage === undefined ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    stats.secondRoundUsed
                  )}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-gray-600">
                <span>M: {keysWithUsage === undefined ? "-" : stats.secondRoundMale}</span>
                <span>F: {keysWithUsage === undefined ? "-" : stats.secondRoundFemale}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Generate Keys Section */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full bg-gradient-to-r from-candidate-male-600 via-candidate-female-500 to-candidate-male-600 hover:from-candidate-male-700 hover:via-candidate-female-600 hover:to-candidate-male-700 text-white font-semibold shadow-lg"
            >
              <Key className="w-4 h-4 mr-2" />
              Generate Secret Keys
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Key className="w-5 h-5 text-candidate-male-600" />
              Generate Secret Keys
            </DialogTitle>
            <DialogDescription>
              Enter the number of unique secret keys to generate and add to the database.
              Keys will be 3 characters long (alphanumeric).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyAmount" className="text-sm font-semibold">
                Number of Keys (1-1000)
              </Label>
              <Input
                id="keyAmount"
                type="number"
                min={1}
                max={1000}
                value={keyAmount}
                onChange={(e) => setKeyAmount(e.target.value)}
                placeholder="Enter number of keys"
                className="h-12 text-base border-2 focus:border-candidate-male-400"
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-500">
                Each key will be 3 characters (0-9, a-z)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsGenerateDialogOpen(false);
                setKeyAmount("");
              }}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateKeys}
              disabled={isGenerating || !keyAmount || parseInt(keyAmount) <= 0}
              className="bg-gradient-to-r from-candidate-male-600 to-candidate-male-700 hover:from-candidate-male-700 hover:to-candidate-male-800 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
