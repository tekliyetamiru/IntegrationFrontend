/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://tekliye-toxiguard-api.hf.space'}/api/:path*`,
      },
    ];
  },
  // Fix deprecated images.domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'huggingface.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;