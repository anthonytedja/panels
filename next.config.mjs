import withSerwistInit from "@serwist/next";

const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  include: [/\.(js|css|json)$/],
  additionalPrecacheEntries: [{ url: "/", revision }],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/:all*(gif|svg|jpg|jpeg|png|webp|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
