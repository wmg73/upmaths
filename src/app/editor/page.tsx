import type { Metadata } from "next";
import Link from "next/link";
import MdEditor from "@/components/MdEditor";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Markdown & LaTeX 在线编辑器 · 实时预览",
  description:
    "UpMaths Markdown & LaTeX 在线编辑器：左侧写源码，右侧实时预览。支持 GFM 表格、$$ 块公式、$ 行内公式、LaTeX 数学排版，基于 KaTeX 引擎。浏览器本地处理，不上传任何内容，可下载 .md / .html。",
  keywords: [
    "Markdown 在线编辑器",
    "LaTeX 在线编辑",
    "Markdown 实时预览",
    "数学公式在线编辑",
    "KaTeX",
    "Markdown & LaTeX Editor",
    "upmath.me",
    "在线 Markdown",
    "UpMaths",
  ],
  alternates: { canonical: "https://upmaths.com/editor" },
  openGraph: {
    type: "website",
    url: "https://upmaths.com/editor",
    siteName: "UpMaths",
    locale: "zh_CN",
    title: "Markdown & LaTeX 在线编辑器 · 实时预览",
    description:
      "Markdown + LaTeX 数学公式编辑器，双栏实时预览，浏览器本地处理，支持 GFM 表格、$$ 块公式，可下载 .md / .html。",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown & LaTeX 在线编辑器",
    description: "双栏实时预览 + KaTeX 数学公式渲染 + GFM 表格，免费、本地、保护隐私。",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function EditorPage() {
  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "UpMaths · Markdown & LaTeX 在线编辑器",
            url: "https://upmaths.com/editor",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
            description:
              "Markdown + LaTeX 数学公式在线编辑器，双栏实时预览，基于 KaTeX 引擎，支持 GFM 表格，浏览器本地处理，可下载 .md / .html。",
            featureList: [
              "Markdown 实时预览",
              "LaTeX 数学公式",
              "GFM 表格支持",
              "浏览器本地处理",
              "下载 Markdown / HTML",
              "快捷键支持",
            ],
          }),
        }}
      />

      <main className="mx-auto max-w-7xl px-0 sm:px-4 py-0 sm:py-8">
        {/* 标题区 */}
        <header className="mb-4 border-b border-slate-200 bg-white px-4 sm:rounded-xl sm:border sm:bg-gradient-to-br from-blue-50 to-white sm:p-6">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Markdown & LaTeX 在线编辑器
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            左栏写 Markdown 源码，右栏实时预览。
            支持 <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">$...$</code> 行内公式
            和 <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">$$...$$</code> 块级公式，
            基于 KaTeX 引擎渲染，排版媲美专业学术文档。
          </p>
        </header>

        {/* 编辑器 */}
        <div className="overflow-hidden border-x border-slate-200 bg-white sm:rounded-xl sm:border">
          <MdEditor />
        </div>

        {/* 功能说明卡片 */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="🧮"
            title="LaTeX 数学公式"
            desc="支持所有 KaTeX 能渲染的 LaTeX 命令，块级公式自动居中，行内公式与正文对齐。"
          />
          <FeatureCard
            icon="📝"
            title="Markdown 实时预览"
            desc="Grep-FM 风格 Markdown：表格、删除线、自动链接、任务列表全部支持。"
          />
          <FeatureCard
            icon="🔒"
            title="浏览器本地处理"
            desc="所有编辑和渲染都在你的浏览器内完成，内容不会上传到任何服务器。"
          />
          <FeatureCard
            icon="⬇️"
            title="导出 .md / .html"
            desc="一键下载 Markdown 源文件或完整 HTML 文档，方便粘贴到博客、论坛或学术平台。"
          />
          <FeatureCard
            icon="⌨️"
            title="快捷键友好"
            desc="Ctrl/Cmd + B 粗体，Ctrl + I 斜体，Ctrl + S 下载，编辑效率拉满。"
          />
          <FeatureCard
            icon="🔗"
            title="参考 upmath.me"
            desc="灵感来源于 upmath.me 的 Markdown + LaTeX 在线编辑器，专为学术写作和技术博客设计。"
          />
        </section>

        {/* 快速语法参考 */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">📚 快速语法参考</h2>
          <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <GrammarItem label="标题" code="# 一级 / ## 二级 / ### 三级" />
            <GrammarItem label="粗体 / 斜体" code="**粗体** / *斜体*" />
            <GrammarItem label="删除线" code="~~删除线~~" />
            <GrammarItem label="行内代码" code="`code`" />
            <GrammarItem label="代码块" code="```lang\n…\n```" />
            <GrammarItem label="引用" code="> 引用文字" />
            <GrammarItem label="无序列表" code="- 项目" />
            <GrammarItem label="有序列表" code="1. 项目" />
            <GrammarItem label="链接" code="[文字](url)" />
            <GrammarItem label="表格" code="| A | B |" />
            <GrammarItem label="行内公式" code="$a^2 + b^2 = c^2$" />
            <GrammarItem label="块级公式" code="$$\n\int_0^1 x dx\n$$" />
          </div>
        </section>

        {/* 相关工具 */}
        <section className="mt-6">
          <h2 className="mb-4 text-lg font-bold">🔗 其他工具</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/convert/word-to-pdf"
              className="group block rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 transition hover:border-blue-400 hover:shadow-md"
            >
              <div className="text-lg font-bold group-hover:text-blue-600">📄 Word → PDF</div>
              <div className="mt-1 text-sm text-slate-600">.docx 文档转 PDF</div>
            </Link>
            <Link
              href="/convert/pdf-to-word"
              className="group block rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 transition hover:border-blue-400 hover:shadow-md"
            >
              <div className="text-lg font-bold group-hover:text-blue-600">📑 PDF → Word</div>
              <div className="mt-1 text-sm text-slate-600">PDF 转可编辑 .docx</div>
            </Link>
            <Link
              href="/"
              className="group block rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 transition hover:border-blue-400 hover:shadow-md"
            >
              <div className="text-lg font-bold group-hover:text-blue-600">🖼 图片格式转换</div>
              <div className="mt-1 text-sm text-slate-600">PNG / JPG / WebP / GIF</div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-semibold text-slate-800">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</div>
    </div>
  );
}

function GrammarItem({ label, code }: { label: string; code: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="min-w-[72px] pt-0.5 text-sm font-medium text-slate-600">
        {label}
      </span>
      <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[12.5px] text-slate-700">
        {code}
      </code>
    </div>
  );
}
