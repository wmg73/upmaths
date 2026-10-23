import Link from "next/link";
import { Converter } from "./Converter";
import { FAQ } from "./FAQ";
import { RelatedPairs } from "./RelatedPairs";

export interface PairFaq {
  question: string;
  answer: string;
}

export interface Pair {
  source: string;
  target: string;
  slug: string;
  mimeSource: string;
  mimeTarget: string;
  conversionType: "有损" | "无损";
  /** 浏览器端无法解码的转换对（如 TIFF），设为 true 后页面 noindex */
  noindex?: boolean;
  typicalSize: string;
  note: string;
  useCases: string[];
  caveats?: string;
  related: string[];
  faq: PairFaq[];
}

interface PairTemplateProps {
  pair: Pair;
  canonical: string;
}

/**
 * 每个转换对落地页通用模板。
 * 内容结构（共享骨架参数化 + per-pair 唯一数据）：
 *   1. 面包屑 + H1
 *   2. Converter 工具
 *   3. 数据区（转换类型 / 典型大小 / note【唯一】）
 *   4. 使用场景 useCases【唯一】
 *   5. 注意事项 caveats【唯一，存在时渲染】
 *   6. 如何使用（参数化步骤）
 *   7. FAQ【唯一】
 *   8. RelatedPairs
 *   9. 底部回链
 * 注：广告位占位保留，待 AdSense 审核通过后填入。
 */
export function PairTemplate({ pair }: PairTemplateProps) {
  const { source, target, noindex } = pair;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* 面包屑 */}
      <nav className="mb-5 text-sm text-slate-500" aria-label="面包屑">
        <Link href="/" className="hover:text-blue-600 hover:underline">
          UpMaths
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <Link href="/formats" className="hover:text-blue-600 hover:underline">
          格式
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-medium text-slate-700">
          {source} → {target}
        </span>
      </nav>

      {/* 1. H1 + 一句话说明 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {source} 转 {target} 在线转换
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          免费、即时、无需上传。在浏览器本地把 {source} 图片转为 {target} 格式，
          不上传任何文件到服务器，关掉页面即清空。
        </p>
      </header>

      {/* 2. 工具本体 */}
      {noindex ? (
        <section className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <div className="text-lg font-semibold">⚠️ 该转换暂不支持浏览器端处理</div>
          <p className="mt-2 text-sm leading-relaxed">
            {source} 格式无法被主流浏览器原生解码，本站当前未部署服务端解码能力。
            建议先用本地软件（如 Photoshop、XnView、ImageMagick）将 {source} 转为 PNG 或 JPG，
            再使用本站的其他转换功能。
          </p>
        </section>
      ) : (
        <section className="mb-10">
          <Converter targetSlug={pair.target.toLowerCase()} />
        </section>
      )}

      {/* 广告位 A */}
      <div
        id="ad-slot-a"
        className="mb-10 min-h-[90px] rounded-lg border border-dashed border-slate-200 bg-slate-100/40"
        aria-label="广告位"
      />

      {/* 3. 数据区 */}
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">转换类型</div>
            <div className="mt-1 inline-flex items-center gap-2 text-base font-semibold">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  pair.conversionType === "无损" ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              {pair.conversionType}
              {pair.conversionType === "有损" && (
                <span className="text-xs font-normal text-slate-500">· 体积更小</span>
              )}
              {pair.conversionType === "无损" && (
                <span className="text-xs font-normal text-slate-500">· 画质零损失</span>
              )}
            </div>
            <div className="mt-0.5 font-mono text-xs text-slate-400">
              {pair.mimeSource} → {pair.mimeTarget}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">典型文件大小</div>
            <div className="mt-1 text-base font-semibold">{pair.typicalSize}</div>
            <div className="mt-0.5 text-xs text-slate-500">
              仅供参考，实际大小取决于图片内容和质量参数
            </div>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-slate-700">{pair.note}</p>
      </section>

      {/* 4. 使用场景 */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          为什么要将 {source} 转为 {target}？
        </h2>
        <ul className="space-y-2.5 leading-relaxed text-slate-700">
          {pair.useCases.map((uc, i) => (
            <li key={i} className="flex gap-3">
              <span
                aria-hidden
                className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
              >
                {i + 1}
              </span>
              <span>{uc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. 注意事项 */}
      {pair.caveats && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">注意事项</h2>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            <span aria-hidden className="mr-1">⚠️</span>
            {pair.caveats}
          </div>
        </section>
      )}

      {/* 6. 如何使用（参数化） */}
      {!noindex && (
        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold">如何使用本工具</h2>
          <ol className="list-decimal space-y-2.5 pl-6 leading-relaxed text-slate-700">
            <li>点击上传区域或直接将 {source} 文件拖拽到虚线框内（支持批量）。</li>
            <li>根据需要调整质量参数（有损格式）或直接点击转换。</li>
            <li>转换完成后点击下载按钮，即可获得 {target} 文件。</li>
            <li>全程在浏览器本地完成，文件不会上传到服务器。</li>
          </ol>
        </section>
      )}

      {/* 广告位 B */}
      <div
        id="ad-slot-b"
        className="mb-10 min-h-[90px] rounded-lg border border-dashed border-slate-200 bg-slate-100/40"
        aria-label="广告位"
      />

      {/* 7. FAQ */}
      <section className="mb-10">
        <FAQ faqs={pair.faq} />
      </section>

      {/* 8. 相关转换对内链 */}
      <section className="mb-12">
        <RelatedPairs slugs={pair.related} currentSlug={pair.slug} />
      </section>

      {/* 9. 底部回链 */}
      <footer className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        <Link href="/formats" className="hover:text-blue-600 hover:underline">
          查看所有支持的格式 →
        </Link>
        <div className="mt-3 text-xs text-slate-400">
          © {new Date().getFullYear()} UpMaths · {source} 转 {target} 工具
        </div>
      </footer>
    </main>
  );
}
