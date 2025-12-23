import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/judge", "/api/", "/signin", "/signup"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

