import withSerwistInit from "@serwist/next";

const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  include: [/\.(ico|js|css|json)$/],
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/jszip.js", revision },
    { url: "/libunrar.js", revision },
    { url: "/libunrar.js.mem", revision },
    { url: "/libuntar.js", revision },
    { url: "/uncompress.js", revision },
  ],
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
        source: "/:all*(ico|gif|svg|jpg|jpeg|png|webp|json)",
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
