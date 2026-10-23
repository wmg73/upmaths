import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import "./globals.css";

const SITE_URL = "https://upmaths.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UpMaths · 免费在线格式转换（图片 + PDF + Word）",
    template: "%s | UpMaths",
  },
  description:
    "UpMaths 提供免费在线格式转换：PNG、JPG、WebP、GIF、BMP、ICO、AVIF 图片格式互转（浏览器本地处理），以及 PDF ↔ Word 文档互转（LibreOffice 引擎）。保护隐私，零服务器存储。",
  keywords: [
    "图片格式转换",
    "在线图片转换",
    "PNG 转 JPG",
    "PNG 转 WebP",
    "图片压缩",
    "图片格式互转",
    "favicon 制作",
    "Word 转 PDF",
    "PDF 转 Word",
    "文档格式转换",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/` },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "UpMaths",
    locale: "zh_CN",
    title: "UpMaths · 免费在线格式转换（图片 + PDF + Word）",
    description: "图片格式浏览器本地互转 + PDF ↔ Word 文档格式转换，保护隐私，永久免费。",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "UpMaths · 在线格式转换工具" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UpMaths · 图片 + PDF/Word 在线格式转换",
    description: "浏览器本地图片转换 + LibreOffice 文档互转，保护隐私。",
    images: ["/og.png"],
  },
};

/** 站点级 Organization 结构化数据 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UpMaths",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    "UpMaths 是一个免费在线格式转换工具站，提供浏览器本地图片互转和 PDF ↔ Word 文档格式转换，保护隐私，不上传用户文件到服务器。",
  sameAs: ["https://upmaths.com"],
};

const navItems = [
  { href: "/", label: "首页" },
  { href: "/convert/word-to-pdf", label: "Word → PDF" },
  { href: "/convert/pdf-to-word", label: "PDF → Word" },
  { href: "/editor", label: "Markdown" },
  { href: "/formats", label: "图片格式" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* 全局导航 */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm text-white">
                U
              </span>
              <span className="text-slate-800">UpMaths</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* 页面主体 */}
        <div className="flex-1">{children}</div>

        {/* 全局页脚 */}
        <Footer />
      </body>
    </html>
  );
}
