import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  // Fetch candidates using server-side Convex API
  const candidates = await fetchQuery(api.candidates.getAll, {});

  const candidateEntries: MetadataRoute.Sitemap = candidates.map((candidate) => ({
    url: `${baseUrl}/candidates/${candidate._id}`, 
    lastModified: new Date().toISOString(),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: "never",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/board`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  return [...candidateEntries, ...staticEntries];
}
