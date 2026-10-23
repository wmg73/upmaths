import type { Metadata } from "next";
import Link from "next/link";
import pairs from "@/data/pairs.json";
import type { Pair } from "@/components/PairTemplate";

const ALL_PAIRS = pairs as Pair[];

export const metadata: Metadata = {
  title: "支持的图片格式与转换",
  description:
    "UpMaths 支持 PNG、JPG、WebP、BMP、HEIC、SVG、TIFF、GIF 等图片格式之间互转（浏览器本地处理），以及 PDF ↔ Word 文档互转。按源格式浏览所有转换对。",
  alternates: { canonical: "https://upmaths.com/formats" },
};

export default function FormatsIndexPage() {
  // 按源格式分组
  const bySource = new Map<string, Pair[]>();
  for (const p of ALL_PAIRS) {
    if (!bySource.has(p.source)) bySource.set(p.source, []);
    bySource.get(p.source)!.push(p);
  }

  // 源格式的展示顺序（用户感知优先级）
  const sourceOrder = [
    "PNG",
    "JPG",
    "WebP",
    "BMP",
    "HEIC",
    "SVG",
    "TIFF",
    "GIF",
  ];

  const sources = sourceOrder.filter((s) => bySource.has(s));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {/* 结构化数据：ItemList 内链 hub */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "UpMaths · 图片格式转换对",
            itemListElement: ALL_PAIRS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://upmaths.com/convert/${p.slug}`,
              name: `${p.source} 转 ${p.target}`,
            })),
          }),
        }}
      />

      <h1 className="text-3xl font-bold sm:text-4xl">支持的图片格式</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        本站支持以下主流图片格式之间互转，全部在浏览器本地完成，不上传任何文件。
        共 {ALL_PAIRS.length} 个转换对，按源格式分组如下：
      </p>

      {/* 锚点导航 */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {sources.map((s) => (
          <a
            key={s}
            href={`#${s.toLowerCase()}`}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600"
          >
            {s} ({bySource.get(s)!.length})
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-8">
        {sources.map((source) => {
          const list = bySource.get(source)!;
          return (
            <section
              key={source}
              id={source.toLowerCase()}
              className="scroll-mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-1 text-2xl font-bold">
                从 {source} 转出
              </h2>
              <p className="mb-5 text-sm text-slate-500">
                把 {source} 格式的图片转为以下格式：
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/convert/${p.slug}`}
                    className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                        {p.source}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="rounded bg-blue-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                        {p.target}
                      </span>
                      <span className="ml-auto text-xs text-slate-400">
                        {p.conversionType}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {p.note}
                    </p>
                    <div className="mt-2 text-xs font-medium text-blue-600 group-hover:underline">
                      进入转换 →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← 返回首页
        </Link>
      </div>

      <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} UpMaths · 在线格式转换
      </footer>
    </main>
  );
}
