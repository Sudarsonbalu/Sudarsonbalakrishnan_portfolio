import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Already pre-compressed via sharp — skip the built-in optimizer
    // to eliminate the ArrayBuffer allocation errors
    unoptimized: true,
  },

  async redirects() {
    return [
      {
        source: '/skills',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/experience',
        destination: '/about',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
