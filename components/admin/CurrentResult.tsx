"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";

interface CurrentResultsProps {
  visible: boolean;
}

export default function CurrentResults({ visible }: CurrentResultsProps) {
  const candidates = useQuery(api.candidates.getWithStats);

  const isLoading = candidates === undefined;

  if (isLoading) {
    return (
      <div className={`relative ${visible ? "blur-0" : "blur-sm"} w-full`}>
        <div className="overflow-x-auto">
          <div className="max-h-[200px] h-full w-full overflow-y-auto scroll-area">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead colSpan={5}>Name</TableHead>
                  <TableHead colSpan={1} className="text-center">Votes</TableHead>
                  <TableHead colSpan={1} className="text-center">Judge Score</TableHead>
                  <TableHead colSpan={1} className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell colSpan={1} className="text-center">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  const sortedCandidates = [...(candidates ?? [])].sort(
    (a, b) => b.combinedScore - a.combinedScore
  );

  return (
    <div className={`relative ${visible ? "blur-0" : "blur-sm"} w-full`}>
      <div className="overflow-x-auto h-full">
        <div className="max-h-[200px] h-full w-full overflow-y-auto scroll-area">
          <Table className="w-full pb-0">
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead colSpan={5}>Name</TableHead>
                <TableHead colSpan={1} className="text-center">Votes</TableHead>
                <TableHead colSpan={1} className="text-center">Judge Score</TableHead>
                <TableHead colSpan={1} className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell colSpan={5}>{candidate.name}</TableCell>
                  <TableCell colSpan={1} className="text-center">
                    {candidate.totalVotes}
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    {candidate.totalRating}
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    {candidate.combinedScore}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
