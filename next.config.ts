/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, //Should be open when vercel limit reset
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP domains
      },
    ],
    domains: ["localhost", "utfs"], // Add localhost to support local images
  },
  
};

module.exports = nextConfig;
