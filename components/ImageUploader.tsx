"use client";

import { useUploadThing } from "@/lib/uploadthings";
import { useDropzone } from "@uploadthing/react";
import { useCallback, useState, forwardRef, useImperativeHandle } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ImageUploader = forwardRef(({ setProfileImage }: any, ref) => {
  const [file, setFile] = useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setProfileImage()
      setFile(acceptedFiles[0]); // Replace the current file with the new one
    }
  }, []);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      toast({
        title: "Succeed",
        description: "Profile Image Successfully uploaded.",
      });
      setFile(null);
    },
    onUploadError: () => {
      toast({
        title: "Failed!",
        description: "Failed to upload profile image!",
      });
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    maxFiles: 1, // Allow only one file to be selected
  });

  const removeFile = () => {
    setFile(null);
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    startUpload: () =>
      file
        ? startUpload([file])
        : toast({
            title: "Fail",
            description: "No file selected!",
          }),
    // getFile: () => file,
  }));

  return (
    <div className="space-y-4">
      {!file && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <input {...getInputProps()} />
          <p>Upload Profile Image</p>
        </div>
      )}
      {file && (
        <div className="relative w-40 h-40">
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            width={200}
            height={200}
            className="rounded-lg object-cover aspect-square w-40 h-40"
          />
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
});
ImageUploader.displayName = "ImageUploader";
