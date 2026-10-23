# UpMaths · 免费在线格式转换工具集

> 一站式免费在线格式转换：**图片格式互转** + **PDF ↔ Word 文档互转** + **Markdown & LaTeX 在线编辑器**。图片转换浏览器本地处理，零上传、零存储、保护隐私。

🌐 **在线体验：[https://upmaths.com](https://upmaths.com)**

---

## ✨ 核心功能

### 🖼️ 图片格式转换（浏览器本地处理）
支持 PNG、JPG、WebP、GIF、BMP、ICO、AVIF、HEIC、SVG、TIFF 等格式之间自由互转，全部通过浏览器 Canvas API 在本地完成，**图片不上传服务器**。

- 常见转换：[PNG 转 JPG](https://upmaths.com/convert/png-to-jpg)、[PNG 转 WebP](https://upmaths.com/convert/png-to-webp)、[JPG 转 PNG](https://upmaths.com/convert/jpg-to-png)、[JPG 转 WebP](https://upmaths.com/convert/jpg-to-webp)
- 图标制作：[PNG 转 ICO](https://upmaths.com/convert/png-to-ico)（Favicon 多尺寸打包）
- Apple 格式：[HEIC 转 JPG](https://upmaths.com/convert/heic-to-jpg)、[HEIC 转 PNG](https://upmaths.com/convert/heic-to-png)
- 矢量栅格化：[SVG 转 PNG](https://upmaths.com/convert/svg-to-png)、[SVG 转 JPG](https://upmaths.com/convert/svg-to-jpg)
- 老旧格式：[BMP 转 PNG](https://upmaths.com/convert/bmp-to-png)、[BMP 转 JPG](https://upmaths.com/convert/bmp-to-jpg)、[GIF 转 WebP](https://upmaths.com/convert/gif-to-webp)

[查看全部支持的格式 →](https://upmaths.com/formats)

### 📄 文档格式转换（LibreOffice 引擎）
- [Word 转 PDF](https://upmaths.com/convert/word-to-pdf)：.docx / .doc → PDF，支持中文排版、图片、表格、公式
- [PDF 转 Word](https://upmaths.com/convert/pdf-to-word)：PDF → 可编辑 .docx，支持中文文本与表格重建

文档转换在服务器内存中处理，**转换完成立即删除临时文件**，不持久化存储。

### ✏️ Markdown & LaTeX 在线编辑器
[打开编辑器](https://upmaths.com/editor) — 左栏写源码，右栏实时预览。基于 KaTeX 引擎渲染数学公式，支持 GFM 表格、`$...$` 行内公式、`$$...$$` 块级公式。可导出 `.md` / `.html`，浏览器本地处理。

---

## 🛠️ 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 15（App Router）+ React 19 |
| 样式 | Tailwind CSS v4 |
| Markdown 渲染 | react-markdown + remark-gfm + remark-math + rehype-katex + rehype-raw |
| 数学公式 | KaTeX 0.16 |
| HEIC 解码 | heic2any（WASM，浏览器端） |
| 文档转换 | LibreOffice Writer 24（服务器端） |
| 部署 | pm2 + Nginx（HTTPS / Let's Encrypt） |

---

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 打开 http://localhost:3000

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 环境要求
- Node.js ≥ 18
- （文档转换功能需服务器安装 LibreOffice，本地开发仅图片转换可用）

---

## 📁 项目结构

```
upmaths/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页
│   │   ├── layout.tsx            # 全局布局（导航 + 页脚 + SEO metadata）
│   │   ├── sitemap.ts            # 站点地图（29 条 URL，无尾斜杠）
│   │   ├── robots.ts             # robots.txt
│   │   ├── about/                # 关于我们
│   │   ├── privacy/              # 隐私政策（含 Google DART Cookie 披露）
│   │   ├── terms/                # 服务条款
│   │   ├── contact/              # 联系我们
│   │   ├── editor/               # Markdown & LaTeX 编辑器
│   │   ├── formats/              # 图片格式索引
│   │   └── convert/
│   │       ├── [pair]/           # 20 个图片转换对（动态路由）
│   │       ├── word-to-pdf/      # Word → PDF
│   │       └── pdf-to-word/      # PDF → Word
│   ├── components/
│   │   ├── PairTemplate.tsx      # 转换对通用模板
│   │   ├── Converter.tsx         # 图片转换器
│   │   ├── DocConverter.tsx      # 文档转换器
│   │   ├── MdEditor.tsx          # Markdown 编辑器
│   │   ├── Footer.tsx            # 全站页脚
│   │   └── ...
│   ├── data/pairs.json           # 转换对数据（SEO 内容差异化）
│   └── lib/
├── public/
│   ├── favicon.ico / favicon.svg
│   ├── apple-touch-icon.png
│   ├── icon.png / og.png
│   └── ads.txt
└── next.config.ts                # 缓存策略 + trailingSlash
```

---

## 🔍 SEO 特性

- **静态预渲染**：所有页面 SSG，首屏 HTML 含完整内容
- **统一 URL 规范**：`trailingSlash: false`，sitemap / canonical / 内链三处一致无尾斜杠
- **结构化数据**：Organization、WebApplication、FAQPage、BreadcrumbList、ItemList
- **Open Graph / Twitter Card**：含 1200×630 og.png
- **内容差异化**：每个转换对独立的 note / useCases / caveats / FAQ，避免薄内容
- **合规页面**：隐私政策（披露 Google AdSense / DoubleClick DART Cookie 及退出方式）、服务条款、联系我们
- **缓存策略**：HTML `s-maxage=3600, stale-while-revalidate=86400`；静态资源 1 年 immutable

---

## 📄 页面清单

| 页面 | URL |
|------|-----|
| 首页 | https://upmaths.com/ |
| 图片格式索引 | https://upmaths.com/formats |
| Markdown 编辑器 | https://upmaths.com/editor |
| 关于我们 | https://upmaths.com/about |
| 隐私政策 | https://upmaths.com/privacy |
| 服务条款 | https://upmaths.com/terms |
| 联系我们 | https://upmaths.com/contact |
| Word → PDF | https://upmaths.com/convert/word-to-pdf |
| PDF → Word | https://upmaths.com/convert/pdf-to-word |
| 图片转换对 ×20 | https://upmaths.com/convert/{slug} |

---

## 📜 License

MIT

---

<div align="center">
  <sub>Made with ❤️ by UpMaths · 隐私优先的在线格式转换工具</sub>
</div>
