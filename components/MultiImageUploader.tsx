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

export const MultiImageUploader = forwardRef((_, ref) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      toast({
        title: "Succeed",
        description: "Images successfully uploaded.",
      });
      setFiles([]);
    },
    onUploadError: () => {
      toast({
        title: "Failed",
        description: "Error occurred while uploading.",
      });
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    startUpload: () => startUpload(files),
    // getFiles: () => files,
  }));

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`${
          files.length > 9 && "hidden"
        } border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop some files here, or click to select files</p>
        <p className="text-sm text-gray-500">10 files max</p>
      </div>
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-40"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
MultiImageUploader.displayName = "MultiImageUploader";
