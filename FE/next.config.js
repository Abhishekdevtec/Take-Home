/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/page', destination: '/' },
      { source: '/page/', destination: '/' },
    ];
  },
};

module.exports = nextConfig;
