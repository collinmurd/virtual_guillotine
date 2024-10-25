/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
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
  },
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-Accel-Buffering', // disables nginx buffering on responses for streamed pages
            value: 'no',
          },
        ],
      },
    ]
  }
};

export default nextConfig;
