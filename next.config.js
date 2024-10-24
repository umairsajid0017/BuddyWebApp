/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      "images.pexels.com",
      "18.136.228.207",
      "images.unsplash.com",
      "plus.unsplash.com",
    ], // Add 'images.pexels.com' here
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
    serverActions: {
      allowedOrigins: [
        "localhost",
        "https://symmetrical-fishstick-9v79vr94vj7h79vg-3000.app.github.dev/",
      ],
    },
  },
};

export default config;
