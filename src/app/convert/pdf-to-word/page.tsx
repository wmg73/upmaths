import type { Metadata } from "next";
import Link from "next/link";
import { DocConverter } from "@/components/DocConverter";

const DOMAIN = "https://upmaths.com";

export const metadata: Metadata = {
  title: "PDF 转 Word 在线转换",
  description:
    "在线免费将 PDF 文档转为可编辑的 Word / .docx 格式，支持中文文本、表格、图片自动识别和重建排版。使用 LibreOffice 核心引擎，转换结果可直接在 Microsoft Word 中继续编辑。",
  keywords: [
    "PDF转Word",
    "PDF 转 Word",
    "pdf转docx",
    "在线PDF转Word",
    "免费PDF转Word",
    "PDF文档转可编辑Word",
  ],
  alternates: { canonical: `${DOMAIN}/convert/pdf-to-word` },
  openGraph: {
    type: "website",
    url: `${DOMAIN}/convert/pdf-to-word`,
    siteName: "UpMaths",
    locale: "zh_CN",
    title: "PDF 转 Word · 免费在线转换",
    description: "PDF 转为可编辑 Word / .docx，支持中文、表格、图片识别重建。",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 转 Word · 免费在线转换",
    description: "PDF 转为可编辑 Word / .docx，支持中文。",
    images: ["/og.png"],
  },
};

const faqs = [
  {
    question: "PDF 转 Word 后还能编辑吗？",
    answer:
      "可以。转换后的 .docx 文件可以直接在 Microsoft Word、WPS、LibreOffice Writer 中打开编辑。但 PDF 本质是固定布局，部分复杂排版可能无法完美还原，需要手动微调。",
  },
  {
    question: "扫描件 PDF 能转 Word 吗？",
    answer:
      "扫描件 PDF 本质是图片，当前版本不内置 OCR 识别。转换结果只是嵌入原图片。建议先用带 OCR 的工具（如 Adobe Acrobat、ABBYY FineReader）对扫描件做文字识别后再转换。",
  },
  {
    question: "上传的 PDF 会被保存吗？",
    answer:
      "不会。文件在服务器内存中处理，转换完成后临时文件立即删除。服务器不存储任何用户上传的文件，转换记录不留痕。",
  },
  {
    question: "有文件大小限制吗？",
    answer: "单个文件上限 50 MB。一般 PDF 很少超过 20 MB。",
  },
];

export default function PdfToWordPage() {
  const canonical = `${DOMAIN}/convert/pdf-to-word`;

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF 转 Word 在线转换",
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
      { "@type": "ListItem", position: 3, name: "PDF → Word", item: canonical },
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
          <span className="font-medium text-slate-700">PDF → Word</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">PDF 转 Word 在线转换</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            免费、快速、支持中文排版。转换后文件可直接在 Microsoft Word / WPS 中编辑。
          </p>
        </header>

        <section className="mb-10">
          <DocConverter direction="pdf-to-docx" />
        </section>

        <section className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <div className="font-semibold mb-2">⚠️ 注意事项</div>
          <ul className="space-y-1.5 leading-relaxed">
            <li>· 扫描件 PDF（本质是图片）转换后只是嵌入原图，无法文字编辑。建议先用 OCR 工具识别后再转。</li>
            <li>· PDF 是固定布局格式，复杂排版（分栏、多表格、浮动图片）转换后可能需要手动微调。</li>
            <li>· 加密或有 DRM 保护的 PDF 无法转换。</li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold">转换原理与适用场景</h2>
          <p className="leading-relaxed text-slate-700">
            PDF（Portable Document Format）是一种固定布局的页面描述格式，设计初衷是「所见即所得」地跨平台展示文档，而不是为了编辑。将 PDF 转为可编辑的 Word（.docx）是一个「逆向重建」过程：服务器端的 LibreOffice Draw/Writer 会解析 PDF 的文字流、矢量图形和位图，尝试还原为可编辑的段落、表格和图片对象。对于由 Word、Pages、Google Docs 等文字处理软件导出的「原生 PDF」，还原度通常很高；对于扫描件或复杂设计软件导出的 PDF，还原效果有限。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg bg-green-50 p-3 text-green-900">
              <div className="font-semibold mb-1">✅ 推荐场景</div>
              <ul className="space-y-1 text-xs">
                <li>· Word/WPS 导出的原生 PDF</li>
                <li>· 含真实文字层的报告、论文</li>
                <li>· 简单表格和段落排版</li>
              </ul>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-red-900">
              <div className="font-semibold mb-1">❌ 不推荐场景</div>
              <ul className="space-y-1 text-xs">
                <li>· 扫描件 / 拍照 PDF（需 OCR）</li>
                <li>· InDesign / Illustrator 复杂排版</li>
                <li>· 加密或 DRM 保护的 PDF</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold">为什么选择 UpMaths？</h2>
          <ul className="space-y-2.5 text-slate-700">
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
              <span><b>可直接编辑</b>：输出标准 .docx，Microsoft Word / WPS / LibreOffice 均可打开继续修改。</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
              <span><b>中文友好</b>：对中文字符、段落间距、标点挤压的还原优于多数在线工具。</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
              <span><b>隐私安全</b>：转换完成立即删除源文件与产物，服务器不留任何痕迹。</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">4</span>
              <span><b>免费不限次</b>：不设每日转换次数上限，无需注册登录。</span>
            </li>
          </ul>
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
          <Link href="/convert/word-to-pdf" className="hover:text-blue-600 hover:underline">需要把 Word 转成 PDF？试试反向转换 →</Link>
          <div className="mt-3 text-xs text-slate-400">© {new Date().getFullYear()} UpMaths · PDF 转 Word 工具</div>
        </footer>
      </main>
    </>
  );
}
