/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, 'fs'];
    return config;
  },
};

export default nextConfig;
