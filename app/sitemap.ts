// import { getAllCandidates } from "@/actions/candidate";
// import type { MetadataRoute } from "next";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = process.env.BASE_URL || "http://localhost:3000";

//   // Fetch all candidates
//   const candidates = await getAllCandidates();

//   // Map over candidates to create sitemap entries
//   const candidateEntries: MetadataRoute.Sitemap = candidates.map(
//     (candidate) => ({
//       url: `${baseUrl}/candidates/${candidate.id}`, // Dynamic candidate page URL
//       lastModified: new Date().toISOString(), // Customize with candidate data if needed
//       changeFrequency: "yearly", // Adjust based on update frequency
//       priority: 0.8, // Priority based on importance
//     })
//   );

//   // Add static pages like results, about, etc.
//   const staticEntries: MetadataRoute.Sitemap = [
//     {
//       url: `${baseUrl}/policy`,
//       lastModified: new Date().toISOString(),
//       changeFrequency: "never",
//       priority: 0.6,
//     },
//     {
//       url: `${baseUrl}/results`,
//       lastModified: new Date().toISOString(),
//       changeFrequency: "yearly",
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/`,
//       lastModified: new Date().toISOString(),
//       changeFrequency: "yearly",
//       priority: 0.1,
//     },
//   ];

//   // Combine both dynamic and static entries
//   return [...candidateEntries, ...staticEntries];
// }
