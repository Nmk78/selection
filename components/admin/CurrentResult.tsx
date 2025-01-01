"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getCandidatesWithStats } from "@/actions/candidate";
import { Skeleton } from "../ui/skeleton";

interface CurrentResultsProps {
  visible: boolean;
}

export default function CurrentResults({ visible }: CurrentResultsProps) {
  const {
    data: candidates = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const candidates = await getCandidatesWithStats();
      return Array.isArray(candidates) ? candidates : [];
    },
  });

  if (error) {
    return <div>Failed to load candidates. Please try again.</div>;
  }

  // console.log("🚀 ~ CurrentResults ~ candidates:", candidates);
  const sortedCandidates = [...candidates].sort((a, b) => (b.totalRating + b.totalVotes) - (a.totalRating + a.totalVotes));
  console.log("🚀 ~ CurrentResults ~ sortedCandidates:", sortedCandidates)

  return (
    <div className={`relative ${visible ? "blur-0" : "blur-sm"} w-full`}>
      <div className="overflow-x-auto">
        {/* Fixed Header
        <Table className="w-full">
          <TableHeader>
            <TableRow >
              <TableHead colSpan={5}>Name</TableHead>
              <TableHead colSpan={3} className="text-center">Votes</TableHead>
              <TableHead colSpan={1} className="text-center">Judge Score</TableHead>
              <TableHead colSpan={1} className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
        </Table> */}

        {/* Scrollable Body */}
        <div className="max-h-[200px] w-full overflow-y-auto scroll-area">
          <Table className="w-full">
            <TableHeader className=" sticky top-0 bg-white">
              <TableRow>
                <TableHead colSpan={5}>Name</TableHead>
                <TableHead colSpan={1} className="text-center">
                  Votes
                </TableHead>
                <TableHead colSpan={1} className="text-center">
                  Judge Score
                </TableHead>
                <TableHead colSpan={1} className="text-center">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      {" "}
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
                    {candidate.totalVotes + candidate.totalRating}
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
