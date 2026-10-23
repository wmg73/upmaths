interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

/**
 * FAQ 区块
 * ---------------------------------------------------------------------------
 * 配合 page.tsx 中已注入的 FAQPage JSON-LD 结构化数据，
 * 帮助 Google 在 SERP 展示富结果（People Also Ask 卡片）。
 *
 * 第一阶段默认全部展开，后续可折叠交互但不影响 SEO（结构化数据已独立）。
 */
export function FAQ({ faqs }: FAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">常见问题</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            open
            className="group rounded-lg border border-slate-200 bg-white p-4"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="text-blue-500">Q{i + 1}.</span>
              <span>{faq.question}</span>
              <span className="ml-auto text-slate-400 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 pl-6">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
