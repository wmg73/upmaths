import type { Metadata } from "next";
import Link from "next/link";
import { DocConverter } from "@/components/DocConverter";

const DOMAIN = "https://upmaths.com";

export const metadata: Metadata = {
  // 裸标题，品牌由 layout 的 title.template 统一追加
  title: "Word 转 PDF 在线转换",
  description:
    "在线免费将 Word / .docx 文档转为 PDF 格式，支持中文排版、图片、表格、页眉页脚，使用 LibreOffice 核心引擎，转换质量可媲美 Microsoft Office。无需注册、永久免费。",
  keywords: [
    "Word转PDF",
    "Word 转 PDF",
    "docx转pdf",
    "在线Word转PDF",
    "免费Word转PDF",
    "Word文档转PDF",
  ],
  alternates: { canonical: `${DOMAIN}/convert/word-to-pdf` },
  openGraph: {
    type: "website",
    url: `${DOMAIN}/convert/word-to-pdf`,
    siteName: "UpMaths",
    locale: "zh_CN",
    title: "Word 转 PDF · 免费在线转换",
    description: "Word / .docx 文档高质量转为 PDF，支持中文排版、图片、表格。",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word 转 PDF · 免费在线转换",
    description: "Word / .docx 文档高质量转为 PDF，支持中文排版。",
    images: ["/og.png"],
  },
};

const faqs = [
  {
    question: "Word 转 PDF 后格式会乱吗？",
    answer:
      "本工具使用 LibreOffice Writer 24 内核转换，对 99% 的 Word 文档（含中文、图片、表格、公式）保持原有排版。复杂的 VBA 宏、ActiveX 控件无法转换。",
  },
  {
    question: "上传的文档会被保存吗？",
    answer:
      "不会。文件在服务器内存中处理，转换完成后临时文件立即删除。服务器不存储任何用户上传的文件，转换记录不留痕。",
  },
  {
    question: "支持 .doc 旧格式吗？",
    answer:
      "支持 .doc 和 .docx 两种格式。LibreOffice 兼容 Microsoft Word 97-2024 全部版本。",
  },
  {
    question: "有文件大小限制吗？",
    answer: "单个文件上限 50 MB。一般 Word 文档很少超过 10 MB。",
  },
];

export default function WordToPdfPage() {
  const canonical = `${DOMAIN}/convert/word-to-pdf`;

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Word 转 PDF 在线转换",
    url: canonical,
    applicationCategory: "OfficeApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: DOMAIN + "/" },
      { "@type": "ListItem", position: 2, name: "文档转换", item: DOMAIN + "/" },
      { "@type": "ListItem", position: 3, name: "Word → PDF", item: canonical },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-5 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 hover:underline">UpMaths</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-medium text-slate-700">Word → PDF</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Word 转 PDF 在线转换</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            免费、高质量、支持中文排版。基于 LibreOffice Writer 引擎，转换结果可媲美 Microsoft Office。
          </p>
        </header>

        <section className="mb-10">
          <DocConverter direction="docx-to-pdf" />
        </section>

        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold">为什么用 UpMaths 转 Word → PDF？</h2>
          <ul className="space-y-2.5 text-slate-700">
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
              <span><b>排版保真</b>：使用 LibreOffice 24 Writer 引擎，中文、图片、表格、公式保持原有布局，页眉页脚、页码、目录结构完整还原。</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
              <span><b>免费无广告</b>：零付费、零弹窗、零广告，打开即用，不限制转换次数。</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
              <span><b>安全隐私</b>：转换完成立即删除，服务器不存储任何用户文件，不留转换日志。</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">4</span>
              <span><b>跨平台</b>：浏览器即可使用，Windows / macOS / Linux / 移动端全兼容，无需安装 Office。</span>
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold">转换原理与流程</h2>
          <p className="leading-relaxed text-slate-700">
            上传的 .docx / .doc 文件在服务器端由 LibreOffice Writer 以无头模式（headless）打开并重新渲染，然后通过内置的 PDF 导出引擎生成 PDF。整个过程不经过 Microsoft Word，因此无需 Office 授权，也不会触发 Office 的激活弹窗。LibreOffice 对 OOXML（.docx）格式的兼容度经过十余年迭代，对中文段落、嵌入字体、浮动图片、嵌套表格的还原度在开源方案中处于领先水平。
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700">
            <li>拖拽或点击选择 Word 文件（.doc / .docx）</li>
            <li>服务器调用 LibreOffice 渲染文档并导出 PDF</li>
            <li>转换完成后自动下载，临时文件立即清除</li>
          </ol>
        </section>

        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold">支持的文档特性</h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
            <div className="rounded-lg bg-slate-50 p-3">✅ 中文 / 英文 / 多语言混排</div>
            <div className="rounded-lg bg-slate-50 p-3">✅ 嵌入图片与浮动对象</div>
            <div className="rounded-lg bg-slate-50 p-3">✅ 表格、合并单元格、边框</div>
            <div className="rounded-lg bg-slate-50 p-3">✅ 页眉页脚、页码、分节</div>
            <div className="rounded-lg bg-slate-50 p-3">✅ 目录与超链接</div>
            <div className="rounded-lg bg-slate-50 p-3">✅ 公式（OMML）</div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-lg border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-medium text-slate-800 flex items-center justify-between">
                  {f.question}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <Link href="/convert/pdf-to-word" className="hover:text-blue-600 hover:underline">想把 PDF 转成 Word？试试反向转换 →</Link>
          <div className="mt-3 text-xs text-slate-400">© {new Date().getFullYear()} UpMaths · Word 转 PDF 工具</div>
        </footer>
      </main>
    </>
  );
}
