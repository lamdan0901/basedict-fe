/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
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
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
                default-src 'self';
                script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ep2.adtrafficquality.google https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.googletagservices.com;
                style-src 'self' 'unsafe-inline';
                img-src 'self' data: https://pagead2.googlesyndication.com;
                frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com;
                connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL} https://ep1.adtrafficquality.google ${process.env.NEXT_PUBLIC_AUTH_BASE_URL} https://pagead2.googlesyndication.com;
              `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
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
