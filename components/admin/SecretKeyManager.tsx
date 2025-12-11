"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "@/hooks/use-toast";
import { parse } from "papaparse";
import { Id } from "@/convex/_generated/dataModel";

export default function SecretKeyManager({ userId }: { userId: Id<"users"> }) {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);

  const insertKeys = useMutation(api.secretKeys.insertMany);

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

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer ${
          isDragActive ? "border-primary" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2">Drag and drop a CSV file here.</p>
        <p className="text-sm text-red-500 mt-1">
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
      >
        {uploadStatus === "processing" ? "Processing..." : "Select CSV File"}
      </Button>
    </div>
  );
}
