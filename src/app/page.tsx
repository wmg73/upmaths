import type { Metadata } from "next";
import Link from "next/link";
import { FORMATS, getFormatPairs } from "@/lib/formats";

export const metadata: Metadata = {
  // 首页复用 layout 的 title.default（已含品牌 UpMaths）。
  // 注：Next.js 对根页面 / 不套用 title.template，故不在此覆盖。
  description:
    "UpMaths 提供浏览器端图片格式互转（PNG/JPG/WebP/GIF/BMP/ICO/AVIF）和 PDF ↔ Word 文档格式转换，保护隐私，永久免费。",
  alternates: { canonical: "https://upmaths.com/" },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "UpMaths · 在线格式转换",
            url: "https://upmaths.com",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
          }),
        }}
      />

      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          免费在线<span className="text-blue-600">格式转换</span>工具
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          图片格式（PNG、JPG、WebP、GIF、BMP、ICO、AVIF）
          <span className="text-blue-600 font-medium">浏览器本地处理</span>，隐私、免费、即开即用。
          同时支持
          <span className="font-medium"> PDF ↔ Word </span>
          文档互转，LibreOffice 引擎，高质量排版保真。
        </p>
      </section>

      {/* === 文档转换入口（独立大区） === */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">文档格式转换</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/convert/word-to-pdf"
            className="group block rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 transition hover:border-blue-400 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xl text-white">📄</div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">
                  Word → PDF
                </div>
                <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                  .docx / .doc 文档转为 PDF，支持中文排版、图片、表格、公式。
                </div>
                <div className="mt-2 text-xs text-blue-600 font-medium">开始转换 →</div>
              </div>
            </div>
          </Link>

          <Link
            href="/convert/pdf-to-word"
            className="group block rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 transition hover:border-blue-400 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xl text-white">📑</div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">
                  PDF → Word
                </div>
                <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                  PDF 转为可编辑的 .docx，LibreOffice 引擎重建排版，可在 Word/WPS 中继续编辑。
                </div>
                <div className="mt-2 text-xs text-blue-600 font-medium">开始转换 →</div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* === Markdown & LaTeX 编辑器 === */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Markdown & LaTeX 在线编辑器</h2>
        <Link
          href="/editor"
          className="group block rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white p-6 transition hover:border-blue-400 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xl text-white">✏️</div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">
                左写源码，右看效果
              </div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">
                实时预览 Markdown 格式，支持 LaTeX 数学公式（
                <span className="font-mono text-xs">$...$</span> 行内 /
                <span className="font-mono text-xs">$$...$$</span> 块级），
                基于 KaTeX 引擎渲染。可下载 .md / .html，浏览器本地处理，保护隐私。
              </div>
              <div className="mt-2 text-xs text-blue-600 font-medium">打开编辑器 →</div>
            </div>
          </div>
        </Link>
      </section>

      {/* 格式网格（图片） */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">支持的图片格式</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {FORMATS.map((f) => (
            <Link
              key={f.slug}
              href={`/formats#${f.slug}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm"
            >
              <div className="text-lg font-bold">{f.name}</div>
              <div className="mt-1 text-xs text-slate-500">{f.mime}</div>
              <div className="mt-2 text-xs text-slate-600 line-clamp-2">
                {f.description}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href="/formats"
            className="text-sm text-blue-600 hover:underline"
          >
            查看所有格式说明 →
          </Link>
        </div>
      </section>

      {/* 快速转换入口（按源格式分组） */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">快速开始（图片）</h2>
        <div className="space-y-6">
          {FORMATS.map((src) => {
            const pairs = getFormatPairs(src.slug).filter(
              (p) => p.source === src.slug,
            );
            if (pairs.length === 0) return null;
            return (
              <div
                key={src.slug}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                    .{src.slug}
                  </span>
                  <span className="text-sm text-slate-600">
                    转换成其他格式：
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pairs.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/convert/${p.slug}`}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      → {p.target.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 隐私说明 */}
      <section className="mt-16 rounded-xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-900">
        <div className="mb-1 font-semibold">🔒 隐私双重保障</div>
        <p className="leading-relaxed">
          <b>图片格式转换</b>全部在浏览器内通过 Canvas API 完成，文件不会上传到任何服务器。
          <b>PDF ↔ Word 文档互转</b>在服务器内存中使用 LibreOffice 处理，转换完成后立即删除临时文件，不留任何痕迹。
        </p>
      </section>
    </main>
  );
}
