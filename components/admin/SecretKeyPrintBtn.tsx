import { useEffect, useState } from "react";
import { Loader2, Printer, X } from "lucide-react";
import { getAllSecretKeys } from "@/actions/secretKey";

interface Code {
  code: string;
}

interface SecretKeyPrintBtnProps {
  userId: string | undefined | null;
}

export default function SecretKeyPrintBtn({ userId }: SecretKeyPrintBtnProps) {
  const [codes, setCodes] = useState<Code[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility state

  const handlePrint = () => {
    const printableContent = document.getElementById("printable-content"); // Select the printable content
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
    setIsModalVisible(false); // Close the modal after print
  };

  const loadSecretKeys = async () => {
    console.log("loading secret key");
    setLoading(true);
    try {
      const response = await getAllSecretKeys(); // Assuming you have an API route that returns secret keys

      if (response.success) {
        if (response.data !== undefined) {
          const secretCodes: Code[] = response.data.map((key: string) => ({
            code: key,
          }));
          setCodes(secretCodes); // Set the mapped array
          setIsLoaded(true); // Mark data as loaded
          setLoading(false);
        }
      } else {
        setError("Failed to load secret keys.");
      }
    } catch (error) {
      console.log("🚀 ~ loadSecretKeys ~ error:", error);
      setError("An error occurred while loading secret keys.");
    } finally {
      setLoading(false);
    }
  };

  // UseEffect will only run if userId is available
  useEffect(() => {
    if (userId) {
      loadSecretKeys();
    }
  }, [userId]);

  if (!userId) {
    return null; // Return null instead of early return to ensure hooks are still called
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
          disabled={!isLoaded || loading}
        >
          {loading ? (
            <Loader2 className="mr-2 animate-spin h-4 w-4 text-blue-600" />
          ) : (
            <Printer className="mr-2 h-4 w-4 text-blue-600" />
          )}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-sm font-light text-right">{error}</p>}

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
                >
                  Print
                </button>
                <button
                  className="bg-transparent text-black"
                  onClick={() => setIsModalVisible(false)} // Close the modal
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
