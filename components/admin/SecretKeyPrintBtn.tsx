"use client";

import { useMemo, useRef } from "react";
import { Printer } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SecretKeyPrintBtnProps {
  userId: Id<"users"> | undefined | null;
}

export default function SecretKeyPrintBtn({ userId }: SecretKeyPrintBtnProps) {
  const response = useQuery(api.secretKeys.getAll);
  const printContentRef = useRef<HTMLDivElement>(null);

  // Derive codes from response
  const codes = useMemo(() => {
    if (response?.success && response.data) {
      return response.data;
    }
    return [];
  }, [response]);

  const handlePrint = () => {
    if (!printContentRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      console.error("Failed to open print window. Please check popup blocker.");
      return;
    }

    const printContent = printContentRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Secret Keys - Print</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 20px;
              background: white;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #007acc;
            }
            .print-header h1 {
              font-size: 24px;
              color: #007acc;
              margin-bottom: 8px;
            }
            .print-header p {
              color: #666;
              font-size: 14px;
            }
            .printable-content {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 16px;
              page-break-inside: avoid;
            }
            .printable-content > div {
              border: 3px solid #007acc;
              border-style: double;
              padding: 20px;
              text-align: center;
              background: white;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .printable-content > div > span {
              font-size: 20px;
              font-weight: bold;
              color: #007acc;
              letter-spacing: 1px;
              display: block;
            }
            @media print {
              body {
                padding: 10px;
              }
              .print-header {
                margin-bottom: 15px;
              }
              .printable-content {
                gap: 12px;
              }
              .printable-content > div {
                padding: 16px;
              }
            }
            @page {
              margin: 1cm;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Secret Keys</h1>
            <p>Total: ${codes.length} keys</p>
          </div>
          <div class="printable-content">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (!userId) {
    return null;
  }

  // Show loading state while fetching data
  if (response === undefined) {
    return (
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    );
  }

  // Show error state if query failed
  if (response && !response.success) {
    return (
      <div className="mb-4 flex items-center gap-2 text-sm text-red-600">
        <span>Error loading keys: {response.message || "Unknown error"}</span>
      </div>
    );
  }

  const hasCodes = codes.length > 0;

  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {codes.length} {codes.length === 1 ? "key" : "keys"}
        </span>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={!hasCodes}
            aria-label="Print secret keys"
            title={hasCodes ? "Print secret keys" : "No keys to print"}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Secret Keys</DialogTitle>
            <DialogDescription>
              Preview and print {codes.length} secret {codes.length === 1 ? "key" : "keys"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            {hasCodes ? (
              <div
                ref={printContentRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {codes.map((code) => (
                  <div
                    key={code}
                    className="border-4 border-blue-600 border-double p-4 text-center bg-white"
                  >
                    <span className="text-lg font-bold text-blue-600">
                      {code}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No secret keys available to print.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={handlePrint}
              disabled={!hasCodes}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}