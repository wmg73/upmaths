/**
 * 格式定义与转换对数据
 * ---------------------------------------------------------------------------
 * 本文件是程序化 SEO 的核心数据层。所有 pair 页面、首页聚合、sitemap、
 * robots 都从这里派生，避免多处硬编码。
 *
 * 程序化 SEO 最大的风险是「薄内容」——Google 会惩罚只是把 A→B 换成 B→A
 * 的模板文本。为此每个 Pair 都预留了以下差异化结构：
 *
 *   - howItWorks : 针对该对转换原理的技术说明
 *   - useCases   : 该转换对适用的具体场景（PNG→ICO 和 PNG→JPG 完全不同）
 *   - warnings   : 该转换对独有的注意事项（如透明通道丢失、256 色限制）
 *   - faq        : 至少 3 条 FAQ，含技术性问答
 *
 * 注意：第一阶段只填 5 种主流格式和少量 pair，跑通路由链路后再批量扩充。
 */

// ============================================================================
// 类型定义
// ============================================================================

/** 图片格式元信息 */
export interface Format {
  /** URL-safe 短名，全小写，如 'png' 'jpg' 'webp' */
  slug: string;
  /** 用户可读的格式名（大写），如 'PNG' */
  name: string;
  /** 全称，SEO/长描述用，如 'Portable Network Graphics' */
  fullName: string;
  /** 文件扩展名（含点），如 '.png' */
  extension: string;
  /** MIME type，如 'image/png' */
  mime: string;
  /** 位图 / 矢量 */
  category: "raster" | "vector";
  /** 是否支持无损压缩 */
  lossless: boolean;
  /** 是否支持透明通道 */
  supportsAlpha: boolean;
  /** 一句话介绍（用于 formats 索引页和 pair 页的格式卡片） */
  description: string;
  /** 长段落介绍（格式详情页用） */
  longDescription: string;
  /** 典型适用场景（用于 pair 页差异化内容） */
  useCases: string[];
  /** 局限或注意事项（用于 pair 页 warnings 区） */
  caveats: string[];
}

/** 单个 FAQ 项 */
export interface FAQItem {
  question: string;
  answer: string;
}

/** 一对格式之间的转换 */
export interface Pair {
  /** URL slug："{source}-to-{target}"，全小写连字符，如 'png-to-jpg' */
  slug: string;
  /** 源格式 slug */
  source: string;
  /** 目标格式 slug */
  target: string;

  // ---- 程序化 SEO 元数据 ----
  /** 页面 <title>，含品牌词，50-60 字符为宜 */
  seoTitle: string;
  /** <meta description>，150-160 字符，带行动号召 */
  seoDescription: string;
  /** 关键词数组（用于 meta keywords 和 schema） */
  seoKeywords: string[];

  // ---- 内容差异化（避免薄内容） ----
  /** 该对转换的原理/说明段落 */
  howItWorks: string;
  /** 该转换对的典型使用场景（至少 2 条） */
  useCases: string[];
  /** 该转换对独有的警告/注意事项 */
  warnings: string[];
  /** FAQ（至少 3 条，含技术性问答） */
  faq: FAQItem[];
  /** 相关转换对 slug（用于 RelatedPairs 组件内链） */
  relatedPairs: string[];
}

// ============================================================================
// 格式定义（先放 7 种主流格式占位，后续按需扩充到 ICO/AVIF/BMP/SVG...）
// ============================================================================

export const FORMATS: Format[] = [
  {
    slug: "png",
    name: "PNG",
    fullName: "Portable Network Graphics",
    extension: ".png",
    mime: "image/png",
    category: "raster",
    lossless: true,
    supportsAlpha: true,
    description:
      "无损位图格式，支持透明通道，压缩效率高于 BMP，是设计稿、截图、图标最常用的格式。",
    longDescription:
      "PNG（Portable Network Graphics）是一种无损压缩的位图格式。它诞生于 1990 年代，作为 GIF 的替代者，解决了 GIF 的专利问题和 256 色限制。PNG 支持 24 位真彩色和 8 位 Alpha 透明通道，适合需要保留透明背景、精确颜色还原的场景，如 Logo、UI 设计稿、网页图标、游戏素材等。PNG 的压缩是无损的，因此文件体积通常比 WebP 或 JPG 大，但能保证像素级还原。",
    useCases: [
      "网站 Logo 与 Favicon",
      "UI 设计稿与截图",
      "需要透明背景的合成图",
      "游戏贴图与 Sprite",
      "工程图与线稿扫描",
    ],
    caveats: [
      "无损压缩导致文件体积较大，不适合大规模照片存储",
      "不支持动画（APNG 虽支持但兼容性差）",
      "无 EXIF 元数据支持（标准 PNG 不内嵌拍摄信息）",
    ],
  },
  {
    slug: "jpg",
    name: "JPG",
    fullName: "Joint Photographic Experts Group",
    extension: ".jpg",
    mime: "image/jpeg",
    category: "raster",
    lossless: false,
    supportsAlpha: false,
    description:
      "有损压缩位图格式，文件体积小，适合照片、风景图等色彩丰富的场景。",
    longDescription:
      "JPG（也称 JPEG，Joint Photographic Experts Group）是目前互联网上使用最广泛的图片格式之一。它采用有损压缩算法，通过牺牲少量不敏感的图像细节换取显著更小的文件体积，特别适合照片、风景图、人像等色彩丰富、渐变细腻的场景。JPG 支持 EXIF 元数据，能存储拍摄设备、时间、GPS 坐标等信息，是数码相机和手机拍照的默认输出格式。",
    useCases: [
      "数码照片与手机拍摄",
      "网站商品展示图",
      "新闻配图与社交媒体分享",
      "文档内嵌图片",
    ],
    caveats: [
      "有损压缩会累积失真（反复保存会越来越糊）",
      "不支持透明通道",
      "压缩质量过低会出现可见的块效应",
      "不适合文字、图表、Logo 等高对比区域",
    ],
  },
  {
    slug: "webp",
    name: "WebP",
    fullName: "WebP",
    extension: ".webp",
    mime: "image/webp",
    category: "raster",
    lossless: false,
    supportsAlpha: true,
    description:
      "Google 推出的现代图片格式，同画质下比 JPG/PNG 小 25-35%，同时支持有损/无损和透明通道。",
    longDescription:
      "WebP 是 Google 于 2010 年发布的现代图片格式，基于 VP8 视频编码技术开发。它在相同视觉质量下，比 JPG 小约 30%，比 PNG 小约 25%。WebP 同时支持有损压缩、无损压缩、透明通道和动画，理论上能同时覆盖 JPG、PNG 和 GIF 的使用场景。目前所有现代浏览器（Chrome、Firefox、Safari 14+、Edge）都已原生支持。",
    useCases: [
      "网站图片优化（提升 LCP 分数）",
      "移动 App 图片资源",
      "图片 CDN 自动转码",
      "替代 JPG/PNG/GIF 的统一格式",
    ],
    caveats: [
      "Safari 13 及以下不支持（极少量老用户）",
      "无损模式编码速度较慢",
      "不支持 EXIF 元数据（WebP 标准未定义 EXIF 区块）",
      "部分图像编辑软件对 WebP 导出支持不完整",
    ],
  },
  {
    slug: "gif",
    name: "GIF",
    fullName: "Graphics Interchange Format",
    extension: ".gif",
    mime: "image/gif",
    category: "raster",
    lossless: true,
    supportsAlpha: false,
    description:
      "位图格式，仅支持 256 色，但支持多帧动画，是表情包、动图的主流格式。",
    longDescription:
      "GIF（Graphics Interchange Format）诞生于 1987 年，是互联网上第一种广泛使用的图片格式。它的核心特点是支持多帧动画——将多帧位图按序播放形成动图效果。GIF 使用 LZW 无损压缩，但每帧最多只有 256 色（8 位色深），色彩表现非常有限。尽管有 WebP 动画、APNG 等技术更先进的替代方案，GIF 凭借通用性和生态惯性仍是社交媒体表情包的事实标准。",
    useCases: [
      "社交媒体表情包与动图",
      "产品动效演示",
      "简短循环动画",
      "老旧系统兼容",
    ],
    caveats: [
      "每帧仅限 256 色，色彩容易断层",
      "无真正的透明通道（只有 1 位开关）",
      "帧速通常 ≤10fps",
      "文件体积通常比同内容 WebP 动画大 5-10 倍",
    ],
  },
  {
    slug: "bmp",
    name: "BMP",
    fullName: "Bitmap",
    extension: ".bmp",
    mime: "image/bmp",
    category: "raster",
    lossless: true,
    supportsAlpha: true,
    description:
      "Windows 原生位图格式，不压缩，像素级原样存储，体积巨大。",
    longDescription:
      "BMP（Bitmap）是微软 Windows 操作系统原生的位图格式。它几乎不做任何压缩，按像素逐位存储图像数据（24 位色深时每像素占 3 字节），因此文件体积非常大（如一张 1920×1080 的 BMP 约 6MB）。BMP 的优势是简单、无损、与 Windows 生态深度集成，但在互联网环境下几乎已被 PNG 完全替代。",
    useCases: [
      "Windows 系统内部图像处理",
      "需要绝对无损的中间格式",
      "老旧软件兼容",
    ],
    caveats: [
      "无压缩，体积远大于其他无损格式",
      "不支持跨平台元数据",
      "没有压缩优化空间",
    ],
  },
  {
    slug: "ico",
    name: "ICO",
    fullName: "Windows Icon",
    extension: ".ico",
    mime: "image/vnd.microsoft.icon",
    category: "raster",
    lossless: true,
    supportsAlpha: true,
    description:
      "Windows 图标格式，可在单个文件内嵌多尺寸（16×16 到 256×256），用于网站 favicon 和桌面图标。",
    longDescription:
      "ICO 是微软 Windows 的图标格式，最大的特点是一个 ICO 文件可以内嵌多张不同分辨率（16×16、24×24、32×32、48×48、64×64、128×128、256×256）的位图或 PNG 帧，操作系统会根据显示尺寸自动选择最合适的一帧。它广泛用于网站 Favicon（浏览器标签页小图标）、Windows 桌面图标和快捷方式图标。",
    useCases: [
      "网站 Favicon",
      "Windows 桌面图标",
      "软件程序图标",
      "浏览器扩展图标",
    ],
    caveats: [
      "内嵌 PNG 帧时文件较大",
      "最大支持 256×256（更高分辨率需要其他格式）",
      "不是真正的矢量格式",
    ],
  },
  {
    slug: "avif",
    name: "AVIF",
    fullName: "AV1 Image File Format",
    extension: ".avif",
    mime: "image/avif",
    category: "raster",
    lossless: false,
    supportsAlpha: true,
    description:
      "基于 AV1 视频编码的新型图片格式，同画质下比 WebP 再小 20%，但编码/解码速度较慢。",
    longDescription:
      "AVIF（AV1 Image File Format）是基于开放的 AV1 视频编码标准的静态图片格式，由 Alliance for Open Media 开发。它采用更先进的压缩算法，在相同视觉质量下比 WebP 小约 20%，比 JPG 小约 50%。AVIF 同时支持有损、无损、HDR、宽色域和透明通道。目前 Chrome 85+、Safari 16+、Firefox 93+ 已支持，IE 和部分老旧浏览器不兼容。",
    useCases: [
      "下一代网站图片优化",
      "CDN 自适应格式分发",
      "需要最小化体积的高画质图片",
    ],
    caveats: [
      "编码速度慢（比 WebP 慢 5-10 倍）",
      "解码占用 CPU 较高",
      "Safari 15 及以下不支持",
      "图像编辑软件支持尚不普遍",
    ],
  },
];

// ============================================================================
// 转换对（先填 12 对常见组合，后续从 FORMATS 自动生成全部对）
// ============================================================================

/**
 * 生成一个 Pair 对象的 SEO 元数据与内容骨架。
 * 实际 Pair 对象会覆盖 howItWorks / useCases / warnings / faq / relatedPairs
 * 中的差异化内容，这里提供基础骨架以便批量生成。
 */
function buildPairSkeleton(source: Format, target: Format): Omit<Pair, "howItWorks" | "useCases" | "warnings" | "faq" | "relatedPairs"> {
  const slug = `${source.slug}-to-${target.slug}`;
  const verb = source.lossless && !target.lossless ? "压缩" : "转换";
  return {
    slug,
    source: source.slug,
    target: target.slug,
    seoTitle: `${source.name} 转 ${target.name} · 免费在线${verb}工具 | UpMaths`,
    seoDescription: `在线免费将 ${source.name} 图片转换为 ${target.name} 格式。支持拖拽上传、批量处理，全部在浏览器本地完成，不上传任何数据，保护隐私。`,
    seoKeywords: [
      `${source.slug} to ${target.slug}`,
      `${source.name} 转 ${target.name}`,
      `${source.name}${target.name}转换`,
      "图片格式转换",
      "在线图片处理",
    ],
  };
}

// 预定义常见转换对（第一阶段：12 对）
export const PAIRS: Pair[] = [
  // ---- PNG 向各格式 ----
  {
    ...buildPairSkeleton(FORMATS[0], FORMATS[1]), // PNG → JPG
    howItWorks:
      "PNG 是无损格式，不做任何画质妥协，因此文件体积往往较大。转换到 JPG 时，浏览器会先将 PNG 解码到内存（保留像素级数据），再通过 JPEG 编码器重新采样和压缩。由于 JPG 不支持透明通道，原 PNG 中的 Alpha 层会被忽略或按预设背景色平铺（本工具默认白底）。转换速度取决于图片尺寸，一张 4K 图通常在 0.5-2 秒内完成。",
    useCases: [
      "将设计稿导出后用于网络分享，需要更小体积",
      "网站 SEO 优化，PNG 过大拖慢页面加载",
      "向不支持透明通道的平台上传图片",
      "批量将截图转为 JPG 节省存储空间",
    ],
    warnings: [
      "原 PNG 的透明通道会被丢弃，转为白色背景",
      "JPG 是有损压缩，反复保存会累积失真",
      "文字、图表、Logo 等高对比元素可能出现压缩块效应",
    ],
    faq: [
      {
        question: "PNG 转 JPG 后透明背景变成黑色怎么办？",
        answer:
          "这是部分在线转换工具的默认行为。本工具默认将透明区域填充为白色背景，避免图片发暗。如需其他背景色，可在转换后用图片编辑工具处理。",
      },
      {
        question: "PNG 转 JPG 会损失多少画质？",
        answer:
          "取决于 JPG 的质量参数。80-90 是质量和体积的最佳平衡点，肉眼几乎看不出区别；低于 60 会出现明显的压缩块效应。本工具默认 85，可以在页面上自行调整。",
      },
      {
        question: "可以批量转换吗？",
        answer:
          "可以。本工具支持一次上传多张 PNG，每张独立转换并分别下载，或者打包成 ZIP 一次下载。",
      },
    ],
    relatedPairs: ["png-to-webp", "webp-to-jpg", "jpg-to-webp"],
  },
  {
    ...buildPairSkeleton(FORMATS[0], FORMATS[2]), // PNG → WebP
    howItWorks:
      "PNG 转 WebP 是目前最推荐的图片优化手段之一。WebP 编码器会重新分析 PNG 的像素数据，采用更先进的预测编码和熵压缩算法。对于带透明通道的 PNG，WebP 无损模式能完整保留 Alpha 通道；有损模式下可以在体积减少 30-50% 的同时保持极高的视觉质量。",
    useCases: [
      "网站图片 LCP（Largest Contentful Paint）优化",
      "App 图片资源瘦身，减少流量消耗",
      "CDN 自动转码链路接入",
      "替代 PNG 的统一图片格式方案",
    ],
    warnings: [
      "Safari 13 及以下版本不支持 WebP（当前市场占比 <1%）",
      "无损 WebP 的编码速度比 PNG 慢 2-3 倍",
      "WebP 不支持 EXIF 元数据",
    ],
    faq: [
      {
        question: "PNG 转 WebP 后透明背景还在吗？",
        answer:
          "在。WebP 原生支持 Alpha 透明通道，无论是有损还是无损模式都能完整保留 PNG 的透明区域。",
      },
      {
        question: "WebP 比 PNG 能小多少？",
        answer:
          "一般场景下，有损 WebP 比 PNG 小 30-50%，无损 WebP 比 PNG 小 20-25%。具体取决于图片内容：颜色越丰富、渐变越多，压缩比越高。",
      },
      {
        question: "老浏览器打不开 WebP 怎么办？",
        answer:
          "现代浏览器（Chrome 32+、Firefox 65+、Safari 14+、Edge 18+）全部支持。极少数老版本 Safari 可以用 <picture> 标签回退 PNG：<picture><source type=\"image/webp\" srcset=\"xxx.webp\"><img src=\"xxx.png\"></picture>。",
      },
    ],
    relatedPairs: ["png-to-jpg", "webp-to-png", "png-to-gif"],
  },
  {
    ...buildPairSkeleton(FORMATS[0], FORMATS[5]), // PNG → ICO
    howItWorks:
      "ICO 文件本质上是一个「容器」，里面可以塞多张不同尺寸的位图或 PNG 帧。转换 PNG 到 ICO 时，工具会先对原图进行多档分辨率重采样（常见尺寸 16/24/32/48/64/128/256 px），然后把这些小图打包成一个 ICO 文件。操作系统或浏览器在不同场景自动选最合适的一帧（Favicon 用 16/32，桌面图标用 48/256）。",
    useCases: [
      "制作网站 Favicon（/favicon.ico）",
      "Windows 桌面快捷方式图标",
      "Chrome/Firefox 扩展图标",
      "软件程序图标",
    ],
    warnings: [
      "ICO 内帧通常不超过 256×256，过大的原图会被自动缩小",
      "PNG 中的复杂透明渐变在 16×16/32×32 小尺寸下可能不可见",
      "建议原图至少 1024×1024 以保证缩放后的清晰度",
    ],
    faq: [
      {
        question: "Favicon 必须用 ICO 吗？PNG 不行吗？",
        answer:
          "现代浏览器（Chrome、Firefox、Edge、Safari）全部支持 PNG 格式 Favicon：<link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">。ICO 主要用于兼容非常老的浏览器，以及 Windows 桌面图标场景。",
      },
      {
        question: "一个 ICO 里应该放哪些尺寸？",
        answer:
          "推荐最少包含 16×16、32×32、48×48、256×256 四档，覆盖浏览器标签页（16/32）、Windows 任务栏（48）、桌面大图标（256）等常见场景。本工具默认打包全部 7 档尺寸。",
      },
      {
        question: "转 ICO 后图标变糊了？",
        answer:
          "这是因为原图分辨率太小。建议使用至少 512×512 以上的 PNG 源图进行转换。原图越大，缩到 16×16 时的清晰度越高。",
      },
    ],
    relatedPairs: ["png-to-webp", "jpg-to-ico", "webp-to-png"],
  },

  // ---- JPG 向各格式 ----
  {
    ...buildPairSkeleton(FORMATS[1], FORMATS[0]), // JPG → PNG
    howItWorks:
      "JPG 是有损压缩格式，像素数据已经历过一次不可逆的压缩。转换成 PNG 时，浏览器会将 JPG 解码还原为位图数据，然后用 PNG 的无损算法重新编码。由于 PNG 是无损的，转换过程本身不会再损失画质，但 JPG 原始压缩带来的损失无法消除。",
    useCases: [
      "向需要 PNG 格式的应用或平台上传图片",
      "在设计软件中打开并进一步编辑照片",
      "将屏幕截图的 JPG 转为 PNG 以获得更好的文字清晰度",
      "为旧照片做无损归档（转 PNG 后不再损失）",
    ],
    warnings: [
      "JPG 已损失的画质无法通过转 PNG 恢复",
      "文件体积可能显著变大（PNG 不擅长压缩照片类内容）",
      "PNG 不支持 EXIF 元数据，相机拍摄信息会丢失",
    ],
    faq: [
      {
        question: "JPG 转 PNG 能提升画质吗？",
        answer:
          "不能。JPG 是有损格式，一旦保存就丢失了一部分原始信息，转成任何无损格式都无法找回。正确做法是保留原始 RAW 或无损压缩文件，再从那个源文件导出。",
      },
      {
        question: "JPG 转 PNG 后文件更大了？",
        answer:
          "这是正常的。JPG 对照片类内容的压缩效率远高于 PNG。一张 5MB 的 JPG 转成 PNG 后可能变成 15-25MB。如果追求更小体积，建议转 WebP。",
      },
      {
        question: "为什么我转出来的 PNG 没有透明背景？",
        answer:
          "因为 JPG 本身不支持透明通道，所以转换后的 PNG 也没有透明背景。如果需要透明区域，必须手动抠图或使用带 Alpha 通道的格式（PNG/WebP/AVIF）作为源图。",
      },
    ],
    relatedPairs: ["jpg-to-webp", "png-to-jpg", "webp-to-jpg"],
  },
  {
    ...buildPairSkeleton(FORMATS[1], FORMATS[2]), // JPG → WebP
    howItWorks:
      "JPG 转 WebP 是常见的图片优化手段。WebP 的有损编码器比 JPEG 更高效，在相同视觉质量下，WebP 的体积可以比 JPG 再小 25-35%。如果原图 JPG 质量参数较高（如 90+），WebP 转码不会产生明显的额外画质损失。",
    useCases: [
      "网站图片体积优化，提升 Core Web Vitals",
      "移动端 App 资源瘦身",
      "CDN 动态格式转换（根据浏览器能力返回最优格式）",
      "图片归档，用更小体积存储相同内容",
    ],
    warnings: [
      "如果原 JPG 已经经过多次压缩，WebP 转码会叠加新的有损",
      "WebP 不支持 EXIF，如果需要保留拍摄元数据请使用其他方案",
      "解码 WebP 的 CPU 占用略高于 JPG（现代设备差异可忽略）",
    ],
    faq: [
      {
        question: "JPG 转 WebP 肉眼看得出来区别吗？",
        answer:
          "几乎看不出来。WebP 在相似视觉质量下的压缩比明显优于 JPG。Google 官方的主观实验表明，WebP 在 75 质量参数下的视觉质量相当于 JPG 的 90+。",
      },
      {
        question: "WebP 能替代 JPG 吗？",
        answer:
          "技术上完全可以。WebP 同时覆盖了 JPG（有损照片）、PNG（无损+透明）和 GIF（动画）三种格式的场景。但生态迁移需要时间——目前主流浏览器已支持，但部分老旧设备和专业软件仍不支持。建议新旧格式并用，通过 <picture> 标签按需分发。",
      },
      {
        question: "为什么我的 CMS 还在用 JPG？",
        answer:
          "CMS 系统的图片处理管线通常历史悠久，升级需要适配格式感知、缩略图生成、缓存刷新等多个环节。现代 CMS（WordPress 6.5+、Ghost、Next.js Image）已原生支持自动 WebP/AVIF 转码。",
      },
    ],
    relatedPairs: ["jpg-to-png", "png-to-webp", "webp-to-avif"],
  },

  // ---- WebP 向各格式 ----
  {
    ...buildPairSkeleton(FORMATS[2], FORMATS[0]), // WebP → PNG
    howItWorks:
      "WebP 转 PNG 是从现代格式回退到传统无损格式的常见需求。WebP 的像素数据会被完整解码，再用 PNG 无损编码重新打包。原 WebP 中带有的 Alpha 透明通道会被 PNG 完整保留——这是比转 JPG 更好的选择，因为 PNG 不支持透明但 JPG 也不支持；而当 WebP 有透明通道时，转 PNG 才能保住这个信息。",
    useCases: [
      "在不支持 WebP 的老旧应用或设备上打开图片",
      "用传统设计软件（部分早期 Photoshop 版本）编辑 WebP 图片",
      "需要将图片导入只接受 PNG 的系统",
      "备份 WebP 图片到跨平台兼容格式",
    ],
    warnings: [
      "如果原 WebP 是有损模式，转回 PNG 后画质无法超越原有损质量",
      "文件体积可能显著增大（PNG 对照片类内容压缩效率不如 WebP）",
      "无损 WebP 转 PNG 体积变化相对较小，有时甚至更小",
    ],
    faq: [
      {
        question: "WebP 转 PNG 会损失画质吗？",
        answer:
          "无损 WebP 转 PNG 完全无损。有损 WebP 转 PNG 不会再额外损失画质（PNG 是无损编码），但原始 WebP 的有损损失无法恢复。",
      },
      {
        question: "我能在 Photoshop 里直接打开 WebP 吗？",
        answer:
          "Photoshop 23.2（2022 年）及之后的版本原生支持 WebP。更早的版本需要安装第三方插件（如 WebPShop），或者先用本工具转成 PNG/JPG 再打开。",
      },
      {
        question: "WebP 动画能转 GIF 吗？",
        answer:
          "可以，但需要在转换时选择 GIF 作为目标格式（见本工具 gif-to-webp 反向页面）。注意 GIF 只支持 256 色和 1 位透明，动画帧率也会被限制在 10-15fps。",
      },
    ],
    relatedPairs: ["webp-to-jpg", "png-to-webp", "webp-to-gif"],
  },

  // ---- GIF 向各格式 ----
  {
    ...buildPairSkeleton(FORMATS[3], FORMATS[2]), // GIF → WebP
    howItWorks:
      "GIF 是最老的图片格式之一，每帧只有 256 色，文件效率极低。GIF 转 WebP（动画）是现代替代方案。WebP 动画支持每帧 24 位真彩色 + Alpha 透明，帧率可达 30fps，同内容下体积只有 GIF 的 1/5 到 1/10。浏览器会将 GIF 的每一帧解码，重新用 WebP 编码器编码，保持原时序。",
    useCases: [
      "优化网站加载速度（GIF 是最大的性能杀手之一）",
      "社交媒体分享更流畅的动图",
      "App 内动画素材瘦身",
      "替代老旧 GIF 生态",
    ],
    warnings: [
      "Safari 13 及以下不支持 WebP 动画",
      "WebP 动画的循环次数、帧延迟等元数据需要精确映射",
      "极短的循环动图（<0.5s）WebP 体积优势不明显",
    ],
    faq: [
      {
        question: "GIF 转 WebP 动画颜色会更鲜艳吗？",
        answer:
          "会。GIF 每帧只有 256 色，WebP 动画支持 24 位真彩色，颜色过渡更自然，不会出现色带。但原图如果本身就是 GIF 生成的，原始 256 色的限制无法通过转码突破。",
      },
      {
        question: "GIF 转 WebP 动画需要付费的 FFmpeg 吗？",
        answer:
          "不需要。本工具全部在浏览器端运行，使用 Canvas API 解码 GIF 帧，再用 WebP 编码器重新打包，零依赖、零上传、零费用。",
      },
      {
        question: "GIF 转 WebP 后还能保持透明背景吗？",
        answer:
          "GIF 的透明是 1 位（完全透明或完全不透明，没有半透明），WebP 的 Alpha 通道是 8 位（256 级）。转换后 WebP 可以保持 GIF 的透明区域，并可能在边缘产生更平滑的抗锯齿效果。",
      },
    ],
    relatedPairs: ["gif-to-apng", "webp-to-gif", "png-to-gif"],
  },

  // ---- BMP 向各格式 ----
  {
    ...buildPairSkeleton(FORMATS[4], FORMATS[1]), // BMP → JPG
    howItWorks:
      "BMP 是完全无压缩的原始位图格式，文件体积巨大。转 JPG 是最常见的压缩手段之一。转换过程是先将 BMP 的原始像素加载到内存，再用 JPEG 编码器以指定质量参数重新压缩。一张 1920×1080 的 24 位 BMP（≈6MB）转成 JPG 85 质量后通常只有 400-600KB。",
    useCases: [
      "从老旧 Windows 系统导出图片后压缩",
      "将系统截图转为可分享的小体积格式",
      "存储 BMP 格式的工程图或扫描件，节省磁盘空间",
      "BMP 图片上传到只接受 JPG 的平台",
    ],
    warnings: [
      "JPG 是有损压缩，如需无损转换请选 BMP → PNG",
      "BMP 可能包含透明通道（32 位 BMP），转 JPG 时会丢失",
      "大尺寸 BMP（如 A4 扫描件）转换时内存占用较高",
    ],
    faq: [
      {
        question: "BMP 转 JPG 好还是转 PNG 好？",
        answer:
          "看用途。转 JPG 体积最小（有损），适合照片、网络分享；转 PNG 无损、支持透明，适合图形、截图、需要精确还原的场景。如果不确定，可以同时试两种看哪个更符合预期。",
      },
      {
        question: "为什么 BMP 文件这么大？",
        answer:
          "因为 BMP 几乎不压缩。24 位 BMP 每个像素占 3 字节，文件大小 = 宽 × 高 × 3 + 54 字节头。一张 1080p BMP 就是 1920×1080×3 ≈ 6MB，而同内容的 JPG 可能只有 1/15。",
      },
      {
        question: "32 位 BMP 的透明通道会保留吗？",
        answer:
          "转 JPG 会丢失（JPG 不支持透明）。转 PNG 或 WebP 可以完整保留 Alpha 通道。",
      },
    ],
    relatedPairs: ["bmp-to-png", "bmp-to-webp", "png-to-bmp"],
  },

  // ---- ICO 向各格式（常见反向） ----
  {
    ...buildPairSkeleton(FORMATS[5], FORMATS[0]), // ICO → PNG
    howItWorks:
      "ICO 文件是一个多尺寸容器。转 PNG 时需要先解包 ICO，选择其中一个目标尺寸（通常选最大的 256×256 帧），然后将该帧的位图或内嵌 PNG 数据解码。现代 ICO 通常内嵌 PNG 帧，解包后直接就是完整的 PNG 字节流，可以零拷贝提取。",
    useCases: [
      "提取网站 Favicon 的高清版本",
      "将软件图标用于文档或 PPT",
      "解包 Windows 可执行文件内嵌的图标资源",
      "将 ICO 转为需要 PNG 格式的设计素材",
    ],
    warnings: [
      "ICO 内帧可能较小（很多只有 32×32），放大后会糊",
      "部分老旧 ICO 内嵌的是 BMP 帧而非 PNG，提取结果质量略有差异",
      "一个 ICO 可能包含多帧，本工具默认提取最大的那一帧",
    ],
    faq: [
      {
        question: "为什么我提取出来的 PNG 这么小？",
        answer:
          "因为原始 ICO 里内嵌的最大帧就是 32×32 或 48×48。ICO 的设计初衷就是多尺寸小图标容器，不是高清素材源。如果需要高清图标，建议找原始的矢量图（SVG）或大分辨率 PNG。",
      },
      {
        question: "ICO 能转 SVG（矢量）吗？",
        answer:
          "ICO 本质是位图容器，转成 SVG 只能通过矢量化（Vectorization）实现，需要额外的边缘检测和路径拟合算法。这个过程比较复杂，且不保证完美还原。本工具暂不支持 ICO → SVG，但可以转 PNG 后在矢量编辑软件（如 Inkscape）里手动描摹。",
      },
      {
        question: "能提取 ICO 里的所有尺寸吗？",
        answer:
          "第一版只提取最大帧。后续会支持选择尺寸或导出 ZIP 包含所有帧。",
      },
    ],
    relatedPairs: ["ico-to-jpg", "png-to-ico", "ico-to-webp"],
  },

  // ---- AVIF 向各格式 ----
  {
    ...buildPairSkeleton(FORMATS[6], FORMATS[0]), // AVIF → PNG
    howItWorks:
      "AVIF 是基于 AV1 视频编码的静态图片格式，解码过程比 JPG/PNG/WebP 都更消耗 CPU。浏览器内置的 AVIF 解码器会将压缩数据还原为完整的像素矩阵，然后再用 PNG 无损编码器重新打包。AVIF 原生支持 Alpha 通道，转换到 PNG 时透明区域会被完整保留。",
    useCases: [
      "在不支持 AVIF 的设备或软件上查看图片",
      "将 AVIF 图片导入传统设计软件",
      "跨平台分发（Safari 15 及以下不支持 AVIF）",
      "向只接受 PNG 的系统提交素材",
    ],
    warnings: [
      "AVIF 解码较慢（比 JPG 慢 3-5 倍），大图转换时请耐心等待",
      "有损 AVIF 转回 PNG 不会再额外损失画质，但原始有损无法恢复",
      "AVIF 支持 HDR，转换到 PNG 时 HDR 信息会被降级为 SDR",
    ],
    faq: [
      {
        question: "为什么 AVIF 转 PNG 这么慢？",
        answer:
          "AV1 编码/解码的复杂度远高于 JPEG/WebP。浏览器端的 WASM AVIF 解码器在大尺寸图片上可能需要数秒，这是正常现象。原生 Chrome/Safari 的硬件解码会快一些，但仍然比 JPG 慢。",
      },
      {
        question: "AVIF 的 HDR（高动态范围）能保留吗？",
        answer:
          "不能。PNG 和 JPG 都是 SDR（标准动态范围）格式。AVIF 的 HDR 元数据和高亮度范围在转换到 SDR 格式时必须做色调映射（Tone Mapping），高光会被压缩。",
      },
      {
        question: "AVIF 会成为主流吗？",
        answer:
          "趋势上会。AVIF 是 Alliance for Open Media 开发的开放标准，不受专利限制，压缩效率比 WebP 再高 20%。Chrome 85+、Safari 16+、Firefox 93+ 已支持。但生态迁移需要时间——目前 CDN 和 CMS 的支持还不如 WebP 普及。",
      },
    ],
    relatedPairs: ["avif-to-webp", "avif-to-jpg", "webp-to-avif"],
  },
];

// ============================================================================
// 查询工具函数
// ============================================================================

export function getFormatBySlug(slug: string): Format | undefined {
  return FORMATS.find((f) => f.slug === slug);
}

export function getPairBySlug(slug: string): Pair | undefined {
  return PAIRS.find((p) => p.slug === slug);
}

export function getAllPairs(): Pair[] {
  return PAIRS;
}

export function getAllPairSlugs(): string[] {
  return PAIRS.map((p) => p.slug);
}

export function getFormatPairs(formatSlug: string): Pair[] {
  return PAIRS.filter(
    (p) => p.source === formatSlug || p.target === formatSlug,
  );
}

/**
 * 从 FORMATS 列表程序化生成所有两两组合的转换对。
 * 当前用 PAIRS 手填的 12 对，后续可以放开这里自动生成全部 7×6=42 对，
 * 再用手工 Pair 覆盖 SEO 和内容差异化。
 */
export function generateAllFormatPairs(): Array<{
  slug: string;
  source: string;
  target: string;
}> {
  const result: Array<{ slug: string; source: string; target: string }> = [];
  for (const s of FORMATS) {
    for (const t of FORMATS) {
      if (s.slug === t.slug) continue;
      result.push({
        slug: `${s.slug}-to-${t.slug}`,
        source: s.slug,
        target: t.slug,
      });
    }
  }
  return result;
}
