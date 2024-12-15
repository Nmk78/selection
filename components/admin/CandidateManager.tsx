// "use client";

// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { LoaderIcon, Plus } from "lucide-react";
// import { ScrollArea } from "../ui/scroll-area";
// import { getAllCandidates } from "@/actions/candidate";
// import { useQuery } from "@tanstack/react-query";

// interface Candidate {
//   id: string;
//   name: string;
//   major: string;
// }

// interface CandidateManagerProps {
//   setActiveModal: (praam: boolean) => void;
//   classes: string;
// }
// export default function CandidateManager({
//   setActiveModal,
//   classes,
// }: CandidateManagerProps) {
//   //   const [activeModal, setActiveModal] = useState<string | null>(null);

//   const {
//     data: candidates,
//     error,
//     isLoading,
//   } = useQuery({
//     queryKey: ["candidates"], // Caching key
//     queryFn: async () => {
//       const response = getAllCandidates();
//       console.log("🚀 ~ queryFn: ~ response:", response);
//       return response;
//     },
//   });

//   return (
//     <Card className={` md:overflow-hidden ${classes}`}>
//       <CardHeader>
//         <CardTitle className="flex justify-between items-center">
//           <span>Candidates</span>
//           <Button onClick={() => setActiveModal(true)} className="w-10 h-10">
//             <Plus className="w-6 h-6" />
//           </Button>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table className="min-h-40">
//           <ScrollArea className="max-h-[38vh] overflow-y-auto w-full">
//             <TableHeader className="sticky top-0 bg-white z-10">
//               <TableRow>
//                 <TableHead className="px-4 py-2">Name</TableHead>
//                 <TableHead className="px-4 py-2">Major</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="relative min-h-24">
//               <div className="absolute inset-0 flex items-center justify-center">
//                 {isLoading && (
//                   <LoaderIcon
//                     className=" animate-spin z-10"
//                     width={20}
//                     height={20}
//                   />
//                 )}
//                 {error && (
//                   <span className="mt-20 text-center text-red-400">
//                     {error.message || "Something went wrong!"}
//                   </span>
//                 )}
//               </div>
//               {candidates &&
//                 candidates.map((candidate) => (
//                   <TableRow key={candidate.id}>
//                     <TableCell className="px-4 py-2">
//                       {candidate.name}
//                     </TableCell>
//                     <TableCell className="px-4 py-2">
//                       {candidate.major}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </ScrollArea>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderIcon, Plus, AlertCircle } from 'lucide-react';
import { getAllCandidates } from "@/actions/candidate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";

interface Candidate {
  id: string;
  name: string;
  major: string;
}

interface CandidateManagerProps {
  setActiveModal: (isActive: boolean) => void;
  classes?: string;
}

export default function CandidateManager({
  setActiveModal,
  classes = "",
}: CandidateManagerProps) {
  const {
    data: candidates,
    error,
    isLoading,
  } = useQuery<Candidate[], Error>({
    queryKey: ["candidates"],
    queryFn: getAllCandidates,
  });

  return (
      <Card className={`md:overflow-hidden ${classes}`}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Candidates</span>
            <Button
              onClick={() => setActiveModal(true)}
              size="icon"
              aria-label="Add new candidate"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[38vh] pb-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Major</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-[80%]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[60%]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {error.message || "Failed to load candidates"}
                        </AlertDescription>
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : candidates && candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.major}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No candidates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
  );
}

