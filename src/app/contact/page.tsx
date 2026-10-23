import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "联系我们",
  description:
    "联系 UpMaths：反馈问题、建议新格式、商务合作。",
  alternates: { canonical: "https://upmaths.com/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">联系我们</h1>
      <p className="mt-3 text-slate-600">
        感谢使用 UpMaths。如果你遇到问题、有功能建议或希望商务合作，欢迎通过以下方式联系我们。
      </p>

      <div className="mt-8 space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">📧 邮箱</h2>
          <p className="mt-2 text-slate-600">
            一般咨询与问题反馈：<a href="mailto:support@upmaths.com" className="text-blue-600 hover:underline">support@upmaths.com</a>
          </p>
          <p className="mt-1 text-slate-600">
            商务合作：<a href="mailto:business@upmaths.com" className="text-blue-600 hover:underline">business@upmaths.com</a>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">🐛 问题反馈</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            如果某个转换出错，请在邮件中附上：(1) 源格式与目标格式；(2) 复现步骤；(3) 如有可能，附上可复现的示例文件（请确保不包含敏感信息）。我们会尽快排查。
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">💡 功能建议</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            希望支持新的图片格式或文档转换？欢迎告诉我们你的使用场景。我们会根据需求优先级逐步扩充支持的格式。
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
          <p className="font-semibold">响应时间</p>
          <p className="mt-1">我们通常在 1-3 个工作日内回复。感谢你的耐心与支持。</p>
        </div>
      </div>
    </main>
  );
}
