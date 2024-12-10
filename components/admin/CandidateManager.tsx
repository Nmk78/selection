"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface Candidate {
  id: string;
  name: string;
  major: string;
}

interface CandidateManagerProps {
  setActiveModal: (praam: boolean) => void;
  classes: string;
}
export default function CandidateManager({
  setActiveModal,
  classes,
}: CandidateManagerProps) {
  //   const [activeModal, setActiveModal] = useState<string | null>(null);

  const dummyCandidates: Candidate[] = [
    { id: "1", name: "Alice Johnson", major: "Computer Science" },
    { id: "2", name: "Bob Smith", major: "Electrical Engineering" },
    { id: "3", name: "Carol Lee", major: "Mechanical Engineering" },
    { id: "4", name: "David Kim", major: "Civil Engineering" },
    { id: "5", name: "Eve Brown", major: "Business Administration" },
    { id: "6", name: "Frank White", major: "Computer Science" },
    { id: "7", name: "Grace Hall", major: "Physics" },
    { id: "8", name: "Hank Green", major: "Mathematics" },
    { id: "9", name: "Ivy Adams", major: "Chemical Engineering" },
    { id: "10", name: "Jack Wilson", major: "History" },
    { id: "11", name: "Karen Clark", major: "English Literature" },
    { id: "12", name: "Leo Turner", major: "Political Science" },
    { id: "13", name: "Mona Lopez", major: "Computer Science" },
    { id: "14", name: "Nathan Carter", major: "Architecture" },
    { id: "15", name: "Olivia Young", major: "Economics" },
    { id: "16", name: "Paul Harris", major: "Software Engineering" },
  ];

  return (
    <Card className={` md:overflow-hidden ${classes}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Candidates</span>
          <Button onClick={() => setActiveModal(true)} className="w-10 h-10">
            <Plus className="w-6 h-6" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <ScrollArea className="max-h-[38vh] overflow-y-auto w-full">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Major</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="px-4 py-2">{candidate.name}</TableCell>
                  <TableCell className="px-4 py-2">{candidate.major}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ScrollArea>
        </Table>
      </CardContent>
    </Card>
  );
}
