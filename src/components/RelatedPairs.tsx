import Link from "next/link";
import pairs from "@/data/pairs.json";

interface RelatedPairsProps {
  slugs: string[];
  currentSlug: string;
}

interface PairBrief {
  source: string;
  target: string;
  slug: string;
  note: string;
}

const PAIR_MAP: Record<string, PairBrief> = Object.fromEntries(
  (pairs as PairBrief[]).map((p) => [p.slug, p]),
);

/**
 * 相关转换对内链（SEO 内链策略）
 * ---------------------------------------------------------------------------
 * 数据来源：src/data/pairs.json 的 related 字段。
 * 每个 pair 页面底部放 3-5 个相关转换对链接，驱动内链权重传递。
 */
export function RelatedPairs({ slugs, currentSlug }: RelatedPairsProps) {
  if (!slugs || slugs.length === 0) return null;

  const pairs = slugs
    .map((slug) => PAIR_MAP[slug])
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (pairs.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">其他相关转换</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {pairs.map((p) => (
          <Link
            key={p.slug}
            href={`/convert/${p.slug}`}
            className={`rounded-lg border p-3 text-sm transition hover:border-blue-400 hover:shadow-sm ${
              p.slug === currentSlug
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <div className="font-semibold">
              {p.source} → {p.target}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 line-clamp-2">
              {p.note}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
