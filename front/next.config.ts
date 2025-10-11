/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ncm-marketplace.sfo3.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
      // opcional: caso use CDN do Spaces
      {
        protocol: 'https',
        hostname: 'ncm-marketplace.sfo3.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;