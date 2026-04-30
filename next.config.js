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
  images: {
    domains: ['huggingface.co'],
  },
};

module.exports = nextConfig;
