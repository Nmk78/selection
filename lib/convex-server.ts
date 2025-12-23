// Server-side utility to fetch data from Convex
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getCandidateBySlug(slug: string) {
  try {
    return await client.query(api.candidates.getBySlug, { slug });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }
}

export async function getAllCandidates() {
  try {
    return await client.query(api.candidates.getAll, {});
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

