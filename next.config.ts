// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**", // Allow all HTTPS domains
//       },
//       {
//         protocol: "http",
//         hostname: "**", // Allow all HTTP domains
//       },
//     ],
//     domains: ["localhost", "utfs"], // Add localhost to support local images
//   },
  
// };

// module.exports = nextConfig;

import path from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
