// Server-side utility to fetch data from Convex
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

let client: ConvexHttpClient | null = null;

function getClient() {
  if (!client && process.env.NEXT_PUBLIC_CONVEX_URL) {
    client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  }
  return client;
}

export async function getCandidateBySlug(slug: string) {
  const convexClient = getClient();
  if (!convexClient) {
    console.warn("Convex client not initialized - NEXT_PUBLIC_CONVEX_URL not set");
    return null;
  }
  
  try {
    return await convexClient.query(api.candidates.getBySlug, { slug });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }
}

export async function getAllCandidates() {
  const convexClient = getClient();
  if (!convexClient) {
    console.warn("Convex client not initialized - NEXT_PUBLIC_CONVEX_URL not set");
    return [];
  }
  
  try {
    const result = await convexClient.query(api.candidates.getAll, {});
    return result || [];
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

