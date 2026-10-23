import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PairTemplate, type Pair } from "@/components/PairTemplate";
import pairs from "@/data/pairs.json";

const DOMAIN = "https://upmaths.com";

const ALL_PAIRS: Pair[] = pairs as Pair[];
const ALL_SLUGS: string[] = ALL_PAIRS.map((p) => p.slug);
const PAIR_MAP: Record<string, Pair> = Object.fromEntries(
  ALL_PAIRS.map((p) => [p.slug, p]),
);

// ============================================================================
// SEO 元数据
// ============================================================================

/** 裸标题（≤60 字符），品牌由 layout 的 title.template 统一追加 */
function buildTitle(p: Pair): string {
  return `${p.source}转${p.target}在线转换`;
}

function buildDescription(p: Pair): string {
  return `免费在线将 ${p.source} 图片转为 ${p.target} 格式，全部在浏览器本地完成，不上传任何服务器，保护你的隐私安全。支持拖拽上传、即时预览、质量可调，PNG、JPG、WebP、BMP、HEIC、SVG 等多种格式自由互转。无需注册、无需安装、永久免费，打开即用，图片零存储。`;
}

// ============================================================================
// JSON-LD 结构化数据（所有 URL 一律不带尾斜杠）
// ============================================================================

function buildWebApplicationSchema(p: Pair) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${p.source} 转 ${p.target} 在线转换`,
    url: `${DOMAIN}/convert/${p.slug}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
    description: `免费在线将 ${p.source} 图片转为 ${p.target} 格式，浏览器本地处理，保护隐私。`,
    keywords: `${p.source}转${p.target}, ${p.source} to ${p.target}, 图片格式转换, 在线转换工具`,
  };
}

function buildFAQPageSchema(p: Pair) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function buildBreadcrumbSchema(p: Pair) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${DOMAIN}/` },
      { "@type": "ListItem", position: 2, name: "格式", item: `${DOMAIN}/formats` },
      { "@type": "ListItem", position: 3, name: `${p.source} → ${p.target}`, item: `${DOMAIN}/convert/${p.slug}` },
    ],
  };
}

// ============================================================================
// 静态参数 + Metadata
// ============================================================================

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ pair: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair: pairSlug } = await params;
  const pair = PAIR_MAP[pairSlug];

  if (!pair) {
    return {
      title: "转换对未找到",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${DOMAIN}/convert/${pairSlug}`;
  const title = buildTitle(pair);
  const description = buildDescription(pair);

  return {
    title,
    description,
    keywords: [
      `${pair.source}转${pair.target}`,
      `${pair.source} to ${pair.target}`,
      `${pair.source} ${pair.target}转换`,
      "图片格式转换",
      "在线图片工具",
      "免费图片转换",
    ],
    alternates: { canonical },
    // TIFF 等浏览器端无法解码的转换对，设为 noindex 避免收录不可用页面
    robots: pair.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "UpMaths",
      locale: "zh_CN",
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

// ============================================================================
// 页面本体
// ============================================================================

interface PageProps {
  params: Promise<{ pair: string }>;
}

export default async function PairPage({ params }: PageProps) {
  const { pair: pairSlug } = await params;
  const pair = PAIR_MAP[pairSlug];

  if (!pair) {
    notFound();
  }

  const canonical = `${DOMAIN}/convert/${pairSlug}`;

  const webAppSchema = buildWebApplicationSchema(pair);
  const faqSchema = buildFAQPageSchema(pair);
  const breadcrumbSchema = buildBreadcrumbSchema(pair);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PairTemplate pair={pair} canonical={canonical} />
    </>
  );
}
