"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

interface CandidateManagerProps {
  setEditModal: (isActive: boolean) => void;
  setActiveModal: (isActive: boolean) => void;
  setCandidateId: (candidateId: string) => void;
  classes?: string;
}

export default function CandidateManager({
  setActiveModal,
  setEditModal,
  setCandidateId,
  classes = "",
}: CandidateManagerProps) {
  const candidates = useQuery(api.candidates.getAll);

  const isLoading = candidates === undefined;

  return (
    <div className={`md:overflow-hidden w-full ${classes}`}>
      {/* <CardHeader>
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
      </CardHeader> */}
        <ScrollArea className="h-[38vh] pb-5 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Major</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
              ) : !candidates || candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    No candidates found
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => (
                  <TableRow
                    onClick={() => {
                      setEditModal(true);
                      setCandidateId(candidate._id);
                    }}
                    key={candidate._id}
                    className="cursor-pointer"
                  >
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.major}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
    </div>
  );
}
