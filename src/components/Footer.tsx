import Link from "next/link";
import pairs from "@/data/pairs.json";

/**
 * 全站页脚。
 * - 合规页：隐私政策 / 服务条款 / 联系我们 / 关于
 * - 文档转换：Word→PDF / PDF→Word
 * - 图片转换：按源格式分组，列出所有 20 个转换对内链
 * 所有链接均不带尾斜杠，与 sitemap / canonical 一致。
 */
export function Footer() {
  const year = new Date().getFullYear();

  // 按源格式分组
  const bySource = new Map<string, typeof pairs>();
  for (const p of pairs) {
    if (!bySource.has(p.source)) bySource.set(p.source, []);
    bySource.get(p.source)!.push(p);
  }

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 品牌 + 简介 */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm text-white">
                U
              </span>
              <span className="text-slate-800">UpMaths</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              免费在线格式转换工具：图片格式浏览器本地互转 + PDF ↔ Word 文档互转，保护隐私，不上传用户文件。
            </p>
          </div>

          {/* 合规 + 关于 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">站点</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-blue-600">关于我们</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600">服务条款</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">联系我们</Link></li>
            </ul>
          </div>

          {/* 文档转换 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">文档转换</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/convert/word-to-pdf" className="hover:text-blue-600">Word → PDF</Link></li>
              <li><Link href="/convert/pdf-to-word" className="hover:text-blue-600">PDF → Word</Link></li>
              <li><Link href="/editor" className="hover:text-blue-600">Markdown 编辑器</Link></li>
              <li><Link href="/formats" className="hover:text-blue-600">图片格式索引</Link></li>
            </ul>
          </div>

          {/* 图片转换（按源格式分组） */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">图片转换</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {[...bySource.entries()].map(([src, list]) => (
                <li key={src}>
                  <span className="font-medium text-slate-700">{src} →</span>
                  <span className="ml-1">
                    {list.map((p, i) => (
                      <span key={p.slug}>
                        <Link href={`/convert/${p.slug}`} className="hover:text-blue-600">
                          {p.target}
                        </Link>
                        {i < list.length - 1 && <span className="mx-0.5 text-slate-300">·</span>}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {year} UpMaths · 在线格式转换工具 · 图片本地处理，文档转换后立即删除
        </div>
      </div>
    </footer>
  );
}
