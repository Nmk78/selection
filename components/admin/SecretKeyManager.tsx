"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { insertSecretKeys } from "@/actions/secretKey";
import { toast } from "@/hooks/use-toast";
import { parse } from "papaparse";

export default function SecretKeyManager({ userId }: { userId: string }) {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);

  // Define mutation for inserting secret keys
  const { mutate } = useMutation({
    mutationFn: async ({
      userId,
      keys,
    }: {
      userId: string;
      keys: string[];
    }) => {
      // Directly calling the server action `insertSecretKeys` instead of API call
      const response = await insertSecretKeys(userId, keys);
      if (!response.success) {
        throw new Error(response.message || "Unknown error occurred.");
      }
      return response;
    },
  });

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
          console.log("Parsed Results:", results);

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

          mutate(
            { userId, keys },
            {
              onSuccess: (response) => {
                toast({
                  title: "Upload Successful",
                  description: response.message,
                });
                setUploadStatus("success");
                setProgress(100);
              },
              onError: (error: any) => {
                console.error("Mutation Error:", error);
                toast({
                  title: "Upload Failed",
                  description: error.message || "Unknown error.",
                  variant: "destructive",
                });
                setUploadStatus("error");
                setProgress(100);
              },
            }
          );
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
    [mutate, toast, userId]
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
        <p className="mt-2">Drag 'n' drop a CSV file here.</p>
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
