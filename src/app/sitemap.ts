import type { MetadataRoute } from "next";
import pairs from "@/data/pairs.json";

/**
 * 全站静态 sitemap。
 * 约束：trailingSlash: false → 所有 URL 一律不带尾斜杠，
 *       与 canonical、站内 <Link> 三处保持一致。
 * 包含：7 个静态页 + 20 个图片转换对 + 2 个文档转换对 = 29 条。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://upmaths.com";
  const buildDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: buildDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/formats`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/editor`, lastModified: buildDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, lastModified: buildDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 图片转换对（20 条）
  const pairRoutes: MetadataRoute.Sitemap = pairs.map((p) => ({
    url: `${base}/convert/${p.slug}`,
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: p.noindex ? 0 : 0.6,
  }));

  // 文档转换对（2 条，不在 pairs.json 中，单独列出）
  const docRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/convert/word-to-pdf`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/convert/pdf-to-word`, lastModified: buildDate, changeFrequency: "monthly", priority: 0.8 },
  ];

  return [...staticRoutes, ...pairRoutes, ...docRoutes];
}
