import { useEffect, useState } from "react";
import { Printer, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Code {
  code: string;
}

import { Id } from "@/convex/_generated/dataModel";

interface SecretKeyPrintBtnProps {
  userId: Id<"users"> | undefined | null;
}

export default function SecretKeyPrintBtn({ userId }: SecretKeyPrintBtnProps) {
  const [codes, setCodes] = useState<Code[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  const response = useQuery(api.secretKeys.getAll);
  
  // Extract codes from response when it changes
  useEffect(() => {
    if (response && response.success) {
      setCodes(response.data.map((code: string) => ({ code })));
    } else {
      setCodes([]);
    }
  }, [response]);

  const handlePrint = () => {
    const printableContent = document.getElementById("printable-content");
    if (printableContent) {
      const newWindow = window.open("", "_blank");
      newWindow?.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              .printable-content {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 16px;
                padding: 20px;
              }
              .printable-content div {
                border: 2px solid #007acc;
                padding: 16px;
                text-align: center;
              }
            </style>
          </head>
          <body>
                  <center>Press <kbd>Ctrl</kbd> + <kbd>P</kbd></center>
            <div class="printable-content">
              ${printableContent.innerHTML}
            </div>
            <script>
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `);
    }
    setIsModalVisible(false);
  };

  if (!userId) {
    return null;
  }

  // Show loading state while fetching data
  if (response === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex space-x-4 items-center">
        <p className="bg-transparent w-6 h-6 p-2">{codes.length}</p>
        <button
          className="bg-transparent w-6 h-6 p-2"
          onClick={() => {
            setIsModalVisible(true);
          }}
          disabled={codes.length === 0}
        >
          <Printer className="mr-2 h-4 w-4 text-blue-600" />
        </button>
      </div>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Blur background */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

          {/* Modal Content */}
          <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Secret Keys</h2>
              <div className="space-x-3 flex justify-center items-center">
                <button
                  onClick={handlePrint}
                  className="text-blue-700 font-bold bg-transparent py-2 px-4 rounded"
                  disabled={codes.length === 0}
                >
                  Print
                </button>
                <button
                  className="bg-transparent text-black"
                  onClick={() => setIsModalVisible(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* This will be the content we print */}
            <div
              id="printable-content"
              className="grid grid-cols-2 scroll-area sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {codes.map((code, index) => (
                <div
                  key={index}
                  className="border-4 border-blue-600 border-double p-4 text-center"
                >
                  <span className="text-lg font-bold">{code.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}