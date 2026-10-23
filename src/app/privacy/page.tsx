import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "UpMaths 隐私政策：说明我们如何处理你的文件、是否使用 Cookie、第三方广告（Google AdSense / DoubleClick DART Cookie）的数据收集与退出方式。",
  alternates: { canonical: "https://upmaths.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">隐私政策</h1>
      <p className="mt-2 text-sm text-slate-400">最后更新：2026-10-22</p>

      <div className="mt-8 space-y-8 leading-relaxed text-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-slate-800">1. 概述</h2>
          <p className="mt-3">
            UpMaths（以下简称「我们」）深知隐私对你的重要性。本政策说明在你使用 upmaths.com（以下简称「本站」）时，我们如何处理你的信息。我们的核心原则是<b>最小化数据收集</b>：图片格式转换在浏览器本地完成，不上传任何文件；文档转换在服务器内存中处理，完成后立即删除。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">2. 我们收集什么</h2>
          <p className="mt-3">本站不要求注册，不收集姓名、邮箱、手机号等个人身份信息。</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><b>图片格式转换</b>：文件完全在你的浏览器内处理，不上传到服务器，我们无法接触到你的图片。</li>
            <li><b>PDF ↔ Word 转换</b>：文件上传至服务器内存用于转换，转换完成后临时文件立即删除，不做持久化存储，不保留转换日志。</li>
            <li><b>访问日志</b>：服务器可能记录标准的访问日志（IP、User-Agent、请求时间），用于异常检测和容量规划，保留不超过 7 天，且不与具体用户关联。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">3. Cookie 与第三方广告</h2>
          <p className="mt-3">
            为了维持站点运营成本，本站可能展示由 Google AdSense 投放的第三方广告。Google 及其广告合作伙伴会使用 Cookie 来投放与你兴趣相关的广告。
          </p>
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">关于 Google DoubleClick DART Cookie</p>
            <p className="mt-2">
              Google 通过 DART Cookie 在本站及互联网其他网站上投放广告。DART Cookie 用于根据你对本站及其他网站的访问情况，向你展示相关广告。
            </p>
            <p className="mt-2">
              你可以通过访问 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="underline">Google 广告与隐私设置页面</a> 退出 DART Cookie 的使用。
            </p>
            <p className="mt-2">
              此外，你也可以通过 <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="underline">aboutads.info</a> 或 <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="underline">NAI 消费者退出页面</a> 管理第三方广告 Cookie。在浏览器设置中禁用 Cookie 也可阻止广告个性化，但可能影响部分网站功能。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">4. 数据共享</h2>
          <p className="mt-3">
            我们不会出售、出租或交易你的个人信息。仅在以下情况下可能共享数据：(a) 你明确同意；(b) 法律法规要求；(c) 保护本站及用户的合法权益。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">5. 数据安全</h2>
          <p className="mt-3">
            全站启用 HTTPS 加密传输。文档转换在服务器内存中进行，不落盘。我们采取合理的技术措施保护数据安全，但互联网传输无法保证 100% 安全。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">6. 你的权利</h2>
          <p className="mt-3">
            你有权访问、更正或删除你的个人信息。由于本站不主动收集个人身份信息，如你有任何疑问，请通过 <Link href="/contact" className="text-blue-600 hover:underline">联系页面</Link> 与我们沟通。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800">7. 政策变更</h2>
          <p className="mt-3">
            我们可能不时更新本政策。重大变更会在站点首页显著位置提示。继续使用本站即表示你同意更新后的政策。
          </p>
        </section>
      </div>
    </main>
  );
}
