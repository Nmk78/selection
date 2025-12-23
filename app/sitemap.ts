import type { MetadataRoute } from "next";
import { getAllCandidates } from "@/lib/convex-server";

// Make sitemap dynamic to avoid build-time data fetching
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  // Static entries
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/board`,
      lastModified: new Date().toISOString(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/check`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic candidate entries
  try {
    const candidates = await getAllCandidates();
    const candidateEntries: MetadataRoute.Sitemap = candidates.map((candidate) => ({
      url: `${baseUrl}/candidate/${candidate.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticEntries, ...candidateEntries];
  } catch (error) {
    console.error("Error fetching candidates for sitemap:", error);
    // Return static entries if candidate fetch fails
    return staticEntries;
  }
}
