import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 全站 URL 不带尾斜杠（/convert/png-to-jpg 而非 /convert/png-to-jpg/）
  trailingSlash: false,

  async headers() {
    return [
      {
        // HTML 页面：CDN 缓存 1 小时，后台静默刷新 1 天
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Next.js 静态产物（JS/CSS/图片）：缓存 1 年且不可变（文件名带 hash）
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
