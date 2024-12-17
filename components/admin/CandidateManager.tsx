"use client";

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
import { Plus, AlertCircle } from "lucide-react";
import { getAllCandidates } from "@/actions/candidate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";

interface Candidate {
  id: string;
  name: string;
  major: string;
}

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
  const {
    data: candidates,
    error,
    isLoading,
  } = useQuery<Candidate[], Error>({
    queryKey: ["candidates"],
    queryFn: getAllCandidates,
  });

  console.log("🚀 ~ candidates:", candidates);

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
                  <TableRow
                    onClick={() => {
                      setEditModal(true);
                      setCandidateId(candidate.id)
                    }}
                    key={candidate.id}
                  >
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
