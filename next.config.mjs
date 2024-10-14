/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, 'fs'];
    return config;
  },
  reactStrictMode: true,
};

export default nextConfig;
