/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ['ui-avatars.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
