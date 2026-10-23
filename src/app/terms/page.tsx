import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款",
  description:
    "UpMaths 服务条款：使用本网站在线格式转换工具的规则、责任限制与知识产权声明。",
  alternates: { canonical: "https://upmaths.com/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">服务条款</h1>
      <p className="mt-2 text-sm text-slate-400">最后更新：2026-10-22</p>

      <div className="mt-8 space-y-8 leading-relaxed text-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-slate-800">1. 服务说明</h2>
          <p className="mt-3">
            UpMaths（upmaths.com）提供免费的在线格式转换工具，包括图片格式互转、PDF ↔ Word 文档互转以及 Markdown &amp; LaTeX 在线编辑器。本站按「现状」提供服务，不保证服务不间断或无错误。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">2. 使用规则</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>你不得使用本站转换违法、侵权或含有恶意代码的文件。</li>
            <li>你不得利用自动化脚本高频访问本站，影响服务稳定性。</li>
            <li>单次文档转换文件大小上限为 50 MB。</li>
            <li>本站面向个人非商业用途，如需大规模商业转换请自行部署。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">3. 知识产权</h2>
          <p className="mt-3">
            本站的代码、界面设计与文案归 UpMaths 所有，未经授权不得复制或镜像。你上传并转换的文件版权归你所有，本站不对转换结果主张任何权利。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">4. 免责声明</h2>
          <p className="mt-3">
            格式转换的结果取决于源文件的复杂度。对于文档转换，复杂排版（分栏、浮动对象、ActiveX 控件）可能无法完美还原。对于扫描件 PDF，本站不提供 OCR，转换结果仅为嵌入原图。你应在使用转换结果前自行核验。
          </p>
          <p className="mt-3">
            在法律允许的最大范围内，本站不对因使用或无法使用本服务而导致的任何直接或间接损失承担责任。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">5. 服务变更与终止</h2>
          <p className="mt-3">
            我们保留随时修改、暂停或终止部分或全部服务的权利，无需事先通知。对于免费服务，我们不对服务中断承担责任。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">6. 适用法律</h2>
          <p className="mt-3">
            本条款适用中华人民共和国法律。因本条款产生的争议，双方应友好协商解决；协商不成的，提交本站运营者所在地有管辖权的人民法院诉讼解决。
          </p>
        </section>
      </div>
    </main>
  );
}
