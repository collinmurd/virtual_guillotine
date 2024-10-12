/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: false,
  output: 'standalone',
  basePath: '/guillotine'
};

export default nextConfig;
