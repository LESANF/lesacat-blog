/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO 최적화 설정
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // 압축 활성화
  compress: true,

  // 정적 파일 최적화
  poweredByHeader: false,

  // 실험적 기능 (일단 비활성화)
  // experimental: {
  //   optimizeCss: true,
  // },

  // 리다이렉트 최적화
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
