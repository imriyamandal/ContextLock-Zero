/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Production build ensures strict checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Production build ensures strict checking
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
