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

interface Candidate {
  id: string;
  name: string;
  totalVotes: number; // Ensure this matches your API response
  totalRating: number; // Ensure this matches your API response
}

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

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div>Failed to load candidates. Please try again.</div>;
  }

  console.log("🚀 ~ CurrentResults ~ candidates:", candidates)

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
              {candidates.map((candidate) => (
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
