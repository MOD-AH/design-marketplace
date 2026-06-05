/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp uses native binaries — keep it in Node.js, not bundled by webpack
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
