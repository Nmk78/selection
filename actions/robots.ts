import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/signin/', '/signup/'], // Add multiple disallowed paths here
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}