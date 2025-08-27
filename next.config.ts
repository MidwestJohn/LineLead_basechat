import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set to false because strict mode breaks components that call APIs when the component is rendered (like in Conversation)
  reactStrictMode: false,
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    authInterrupts: true,
    // Speed up development
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dropdown-menu", "@radix-ui/react-dialog"],
  },
  // Configure Turbopack (dev bundler) for Next.js 15
  turbopack: {
    // Reduce file watching overhead
    // Note: Most webpack optimizations are built-in with Turbopack
  },
};

export default nextConfig;
