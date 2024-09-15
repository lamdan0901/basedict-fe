/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    if (process.env.NEXT_ENV !== "development") {
      return [
        {
          source: "/:all*(svg|jpg|png|gif|js|webp)",
          locale: false,
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=86400, must-revalidate",
            },
          ],
        },
      ];
    }
    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
