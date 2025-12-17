"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Key, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import { parse } from "papaparse";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";

export default function SecretKeyManager({ userId }: { userId: Id<"users"> }) {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [keyAmount, setKeyAmount] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const insertKeys = useMutation(api.secretKeys.insertMany);
  const generateKeys = useMutation(api.secretKeys.generateAndInsert);

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus("processing");
      setProgress(0);

      const file = acceptedFiles[0];

      parse(file, {
        header: false,
        skipEmptyLines: true,
        delimiter: ",",
        complete: async (results: { data: string[][] }) => {
          const rows = results.data as string[][];
          if (!rows.length || !rows[0].length) {
            toast({
              title: "Invalid CSV Format",
              description: "The CSV file should not be empty.",
              variant: "destructive",
            });
            setUploadStatus("error");
            return;
          }

          const keys = rows.flat();
          setProgress(50);

          try {
            const response = await insertKeys({ userId, keys });
            toast({
              title: "Upload Successful",
              description: response.message,
            });
            setUploadStatus("success");
            setProgress(100);
          } catch (error) {
            console.error("Mutation Error:", error);
            toast({
              title: "Upload Failed",
              description: error instanceof Error ? error.message : "Unknown error.",
              variant: "destructive",
            });
            setUploadStatus("error");
            setProgress(100);
          }
        },
        error: (error: Error) => {
          console.error("CSV Parsing Error:", error);
          toast({
            title: "CSV Parsing Error",
            description: `Failed to parse CSV: ${error.message}`,
            variant: "destructive",
          });
          setUploadStatus("error");
        },
      });
    },
    [insertKeys, userId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      {/* Generate Keys Section */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 hover:from-purple-700 hover:via-amber-600 hover:to-purple-700 text-white font-semibold shadow-lg"
            >
              <Key className="w-4 h-4 mr-2" />
              Generate Secret Keys
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-2 border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Key className="w-5 h-5 text-purple-600" />
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
                className="h-12 text-base border-2 focus:border-purple-400"
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
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
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

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      {/* CSV Upload Section */}
      <div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm font-medium">Drag and drop a CSV file here</p>
          <p className="text-xs text-red-500 mt-1">
            CSV should not end with comma!
          </p>
        </div>

        {uploadStatus !== "idle" && uploadStatus !== "success" && (
          <div className="mt-2">
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <Button
          className="mt-4 w-full"
          disabled={uploadStatus === "processing"}
          onClick={() => document.querySelector("input")?.click()}
          variant="outline"
        >
          {uploadStatus === "processing" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Select CSV File
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
