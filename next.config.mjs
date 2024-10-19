/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'https://${process.env.CODESPACE_NAME}-3000.github.dev'
      ]
    }
  },
  reactStrictMode: false,
  output: 'standalone',
  basePath: '/guillotine',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/guillotine',
        basePath: false,
        permanent: false
      }
    ]
  }
};

export default nextConfig;
