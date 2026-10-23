import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于 UpMaths",
  description:
    "UpMaths 是一个免费在线格式转换工具站：浏览器本地图片互转 + LibreOffice 文档互转，保护隐私，不上传用户文件。",
  alternates: { canonical: "https://upmaths.com/about" },
};

export default function AboutPage() {
  const lastUpdated = "2026-10-22";
  const author = "UpMaths 团队";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">关于 UpMaths</h1>

      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
        <span>作者：{author}</span>
        <span>更新时间：{lastUpdated}</span>
      </div>

      <div className="mt-6 space-y-5 leading-relaxed text-slate-700">
        <p>
          UpMaths 是一个免费的在线格式转换工具站，提供两类核心能力：图片格式浏览器本地互转，以及 PDF ↔ Word 文档格式互转。我们的目标是让格式转换这件小事变得足够简单、足够安全，让任何人打开网页就能用，不需要注册、不需要登录、不需要安装任何软件。
        </p>

        <p>
          <b>1. 图片格式浏览器本地互转</b>：支持 PNG、JPG、WebP、GIF、BMP、ICO、AVIF、HEIC、SVG、TIFF 等格式之间的自由互转。全部转换逻辑在浏览器端通过 Canvas API 完成，图片不会上传到任何服务器——你的文件从始至终都留在自己的设备上，关掉页面即清空。对于浏览器原生不支持解码的格式（如 HEIC、TIFF），我们会按需加载对应的解码库，但处理过程依然在本地完成。
        </p>

        <p>
          <b>2. PDF ↔ Word 文档格式互转</b>：支持 .docx / .doc 与 PDF 的双向互转，使用 LibreOffice Writer 核心引擎，对中文排版、图片、表格、公式的还原度媲美 Microsoft Office。文档转换在服务器内存中完成，转换结束后临时文件立即删除，不做任何持久化存储，也不保留转换日志。
        </p>

        <p>
          除此之外，UpMaths 还提供一个 <Link href="/editor" className="text-blue-600 hover:underline">Markdown &amp; LaTeX 在线编辑器</Link>，支持左侧写源码、右侧实时预览，基于 KaTeX 引擎渲染数学公式，适合学术写作和技术博客。
        </p>

        <p>
          <b>关于广告与 Cookie：</b>为了维持站点的服务器与带宽成本，UpMaths 可能会展示第三方广告（如 Google AdSense）。这些广告服务商可能会使用 Cookie 或同类技术来投放个性化广告。你可以通过浏览器设置或广告网络提供的退出机制来管理个性化广告。图片格式转换功能本身不使用任何 Cookie，也不会记录你的转换行为。
        </p>

        <p>
          <b>隐私承诺：</b>我们坚持「最小数据」原则。图片转换零上传；文档转换零存储；不要求注册，不收集邮箱，不跟踪用户身份。更多细节请参阅 <Link href="/privacy" className="text-blue-600 hover:underline">隐私政策</Link>。
        </p>

        <p>
          如果你有建议、发现某个转换出错，或者希望支持新的格式，欢迎通过 <Link href="/contact" className="text-blue-600 hover:underline">联系页面</Link> 告诉我们。
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/convert/word-to-pdf" className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:shadow-sm transition">
          <div className="font-semibold text-slate-800">Word → PDF</div>
          <div className="mt-1 text-xs text-slate-500">文档转 PDF</div>
        </Link>
        <Link href="/convert/pdf-to-word" className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:shadow-sm transition">
          <div className="font-semibold text-slate-800">PDF → Word</div>
          <div className="mt-1 text-xs text-slate-500">PDF 转可编辑</div>
        </Link>
        <Link href="/formats" className="rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:shadow-sm transition">
          <div className="font-semibold text-slate-800">图片格式</div>
          <div className="mt-1 text-xs text-slate-500">全部转换对</div>
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
