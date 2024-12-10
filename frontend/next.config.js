/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.staging.market.cliniify.com",
      },
      {
        protocol: "https",
        hostname: "api.market.cliniify.com"
      },
      {
        protocol: "http",
        hostname: "192.168.0.116:8005"
      }
    ],
  },
};

module.exports = nextConfig;
