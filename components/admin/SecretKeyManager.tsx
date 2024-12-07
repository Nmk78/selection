"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function SecretKeyManager() {
  const [secretKeys, setSecretKeys] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [usedSecretKeys, setUsedSecretKeys] = useState<string[]>([]); // Track used secret keys
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
    setFileName(file.name)
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const keys = content
          .split("\n")
          .map((key) => key.trim())
          .filter((key) => key !== "");
        setSecretKeys((prevKeys) => [...prevKeys, ...keys]);
        toast({
          title: "Secret Keys Uploaded",
          description: `${keys.length} secret keys have been added from the CSV file.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const downloadKeys = () => {
    const blob = new Blob([secretKeys.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "secret_keys.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to mark secret key as used
  const markKeyAsUsed = (key: string) => {
    if (!usedSecretKeys.includes(key)) {
      setUsedSecretKeys((prevUsed) => [...prevUsed, key]);
    }
  };

  return (
    <div className="space-y-4 w-full h-full">
      {/* Total Section */}
      <div className="grid grid-cols-2 gap-2">
        {" "}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
          <h3 className="text-lg font-semibold">Total</h3>
          <div className="text-sm text-gray-500">{secretKeys.length}</div>
        </div>
        {/* Used Section */}
        <div className="bg-gray-100 w-3/7 p-4 rounded-lg shadow-sm space-y-2">
          <h3 className="text-lg font-semibold">Used</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">{usedSecretKeys.length}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={triggerFileUpload}
          className="flex flex-grow flex-col text-blue-500 justify-center items-center flex-1 border-dashed border p-4 border-blue-300 rounded-md"
        >
          <Upload className="w-8 h-8 mb-4" />
          {fileName ? fileName : "Upload CSV"}
        </button>
      </div>

    </div>
  );
}
