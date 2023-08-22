/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    domains: ['ui-avatars.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
