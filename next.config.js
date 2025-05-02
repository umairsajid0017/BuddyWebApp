/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

const imageUrl = new URL(process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost');
const imageHostname = imageUrl.hostname;
const imageProtocol = imageUrl.protocol === 'https:' ? 'https' : 'http';

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: imageProtocol,
        hostname: imageHostname,
      },
      {
        protocol: imageProtocol,
        hostname: `**.${imageHostname}`,
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // Proxy to your backend API
      },
    ];
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default config;
