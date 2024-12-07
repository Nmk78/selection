"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Candidate {
  id: string;
  name: string;
  votes: number;
  judgeScore: number;
}

interface CurrentResultsProps {
  visible: boolean;
}

export default function CurrentResults({ visible }: CurrentResultsProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "Alice Johnson", votes: 340, judgeScore: 85 },
    { id: "2", name: "Bob Smith", votes: 285, judgeScore: 78 },
    { id: "3", name: "Carol Lee", votes: 410, judgeScore: 92 },
    { id: "4", name: "David Kim", votes: 300, judgeScore: 80 },
    { id: "5", name: "Eve Brown", votes: 275, judgeScore: 76 },
    { id: "6", name: "Frank White", votes: 350, judgeScore: 84 },
    { id: "7", name: "Grace Hall", votes: 290, judgeScore: 79 },
    { id: "8", name: "Hank Green", votes: 325, judgeScore: 82 },
    { id: "9", name: "Ivy Adams", votes: 360, judgeScore: 88 },
    { id: "10", name: "Jack Wilson", votes: 310, judgeScore: 81 },
    { id: "11", name: "Karen Clark", votes: 400, judgeScore: 90 },
    { id: "12", name: "Leo Turner", votes: 260, judgeScore: 75 },
    { id: "13", name: "Mona Lopez", votes: 380, judgeScore: 87 },
    { id: "14", name: "Nathan Carter", votes: 295, judgeScore: 80 },
  ]);

  useEffect(() => {
    // Fetch candidates data from your API
    const fetchCandidates = async () => {
      // Replace this with your actual API call
      const response = await fetch("/api/candidates");
      const data = await response.json();
      setCandidates(data);
    };
    console.log("🚀 ~ CurrentResults ~ visible:", visible)

    fetchCandidates();
  }, [visible]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={3}>Name</TableHead>
          <TableHead>Votes</TableHead>
          <TableHead className="text-center">Judge Score</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className={` ${visible ? "blur-0" : "blur-sm"}`}>
        {candidates.slice(0, 5).map((candidate) => (
          <TableRow key={candidate.id}>
            <TableCell colSpan={3}>{candidate.name}</TableCell>
            <TableCell>{candidate.votes}</TableCell>
            <TableCell className="text-center">{candidate.judgeScore}</TableCell>
            <TableCell>
              {candidate.votes + candidate.judgeScore}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
