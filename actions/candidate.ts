// app/actions/candidates.js

'use server';

import { prisma } from "@/lib/prisma";
import { candidateSchema } from "@/lib/validations";
import { Candidate } from "@/types/types";

export async function createCandidate(candidateData: Candidate) {
    // Validate input candidateData using Zod
    const parsedData = candidateSchema.safeParse(candidateData);
  
    // Check if validation succeeded
    if (!parsedData.success) {
      console.log("🚀 ~ createCandidate ~ parsedData:", parsedData)
      
      // Throw an error with validation issues if validation fails
      throw new Error("zod error while parsing " +
        parsedData.error.issues.map((issue) => issue.message).join(", ")
      );
    }
  
    // Destructure the parsed candidateData
    const parsedCandidateData = parsedData.data;
    console.log("🚀 ~ createCandidate ~ parsedCandidateData:", parsedCandidateData)
  
    // Create the candidate in the database
    const candidate = await prisma.candidate.create({ data: candidateData });
  
    return candidate;
  }

export async function getAllCandidates() {
  return await prisma.candidate.findMany();
}

export async function updateCandidate(id:string, data:any) {
  return await prisma.candidate.update({
    where: { id },
    data,
  });
}

export async function deleteCandidate(id:string) {
    return await prisma.candidate.delete({
      where: { id },
    });
  }