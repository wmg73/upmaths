import type { Article } from "./types";

/**
 * 文章 5｜格式决策簇
 *
 * 定位：信息型。回答「WebP 什么时候能用、什么时候必须回退」。
 * 与工具页的分工：标题不出现「在线转换」，正文只讲兼容性判断与实测，
 * 工具入口集中在文末 tools 与必须动手处的锚文本。
 *
 * 本篇数据全部来自浏览器实测（Chrome 155，canvas.toBlob），
 * 与站内工具使用同一编码接口，方法写在第三节，可复现。
 */
const article: Article = {
  slug: "webp-compat",
  cluster: "format",
  date: "2026-10-27",
  updated: "2026-10-27",
  readingMin: 13,
  zh: {
    h1: "WebP 兼容性地图：什么时候能放心用，什么时候必须转回 JPG",
    metaTitle: "WebP 兼容性地图 — 分层判断表，附等画质体积实测",
    metaDescription:
      "“WebP 比 JPG 小 30%”只在低码率段成立。实测等画质下：38 dB 省 31%，42 dB 只省 8%，44 dB 持平，48 dB 反而大 5.3 倍。含浏览器/系统/软件分层兼容表、无损 WebP 在截图上是 PNG 的 190%、WebP 转回 JPG 损失 6.5 dB 的实测，以及 picture 降级写法。",
    keywords: [
      "WebP 兼容性",
      "WebP 支持哪些浏览器",
      "WebP 转 JPG",
      "WebP 和 JPG 哪个小",
      "WebP 打不开",
      "Safari WebP 支持",
      "无损 WebP",
      "WebP 有损无损区别",
      "图片格式降级方案",
      "picture 标签 WebP",
    ],
    dek:
      "关于 WebP 有两句话流传最广：一句是“比 JPG 小 30%”，一句是“现代浏览器都支持”。第一句在同画质下只对了一半，第二句在浏览器层面是对的、在软件层面完全不对。这篇把两句话都拆开，用实测数字和分层兼容表说清楚该在什么时候用它。",
    sections: [
      {
        id: "verdict",
        h2: "一、先给结论：三种情况，三种做法",
        blocks: [
          {
            t: "p",
            x: "不用先记格式细节，先看这张图要去哪里。WebP 的兼容性问题从来不是“浏览器认不认”——这一层 2020 年就解决了。真正会出事的是出了浏览器之后：发给别人、插进文档、交给印厂、上传到平台。",
          },
          {
            t: "table",
            head: ["这张图要去哪里", "能不能用 WebP", "说明"],
            rows: [
              [
                "网页上显示（自己控制的站点）",
                "可以，而且该用",
                "配 picture 标签或服务端协商降级。省下的带宽是实打实的，且完全可控",
              ],
              ["存档、自己电脑上看", "可以", "Windows 11 内置解码；Windows 10 需装一个免费扩展，装了就没有问题"],
              [
                "发给别人（微信、邮件、U 盘）",
                "不要",
                "对方打不开的概率不低，而且社交平台发送图片时会重新编码，WebP 作为中间格式没有意义",
              ],
              ["插进 Word / PPT / 交作业", "不要", "Microsoft 365 for Windows 从 2021 年底起才支持，且依赖系统解码器；Office 2016/2019/2021 永久版不可靠"],
              ["交给印厂、印刷、出版", "绝对不要", "RIP 与排版软件基本不认，交付格式应该是 TIFF 或 PDF"],
              ["做图标、贴纸、素材包", "看情况", "WebP 支持透明，但很多素材管理软件不认；交付前确认对方的软件版本"],
            ],
          },
          {
            t: "note",
            title: "一句话规则",
            x: "WebP 是“分发格式”，不是“存档格式”。它的位置在“编码完成到被看见”这一段路上。一旦这张图要离开你的控制范围，就换成 JPG 或 PNG 再交出去。",
          },
        ],
      },
      {
        id: "map",
        h2: "二、兼容性地图：分五层看，不要混着记",
        blocks: [
          {
            t: "p",
            x: "“支持 WebP”这句话在不同语境下指的不是一件事。浏览器支持、操作系统支持、软件支持、平台支持是四套独立的实现，任何一层缺失都会让文件打不开。分开记才不会踩坑。",
          },
          {
            t: "h3",
            x: "第 1 层：浏览器（这一层已经没问题）",
          },
          {
            t: "table",
            head: ["能力", "Chrome", "Edge", "Firefox", "Safari"],
            rows: [
              ["有损 WebP", "17+", "18+", "65+", "14+（iOS 14 / macOS Big Sur）"],
              ["有损 + 无损 + Alpha", "23+", "18+", "65+", "14+"],
              ["动图 WebP", "32+", "18+", "65+", "14+"],
              ["Android 系统浏览器", "4.0+（有损）/ 4.2+（无损与 Alpha）", "—", "—", "—"],
            ],
          },
          {
            t: "p",
            x: "这张表的数据来自 Google 的 WebP 官方 FAQ。关键时间点是 2020 年 9 月：Safari 14 随 iOS 14 与 macOS Big Sur 一起加入 WebP 支持。在此之前，Safari 是 WebP 普及的唯一障碍，也是很多老教程说“WebP 兼容性差”的由来。现在这个理由已经不成立了。",
          },
          {
            t: "h3",
            x: "第 2 层：操作系统（Windows 10 是个坑）",
          },
          {
            t: "table",
            head: ["系统", "能否直接双击打开", "说明"],
            rows: [
              ["Windows 11", "可以", "已内置 WebP 解码器，照片、画图、资源管理器预览都能用"],
              ["Windows 10（1809 及以后）", "需要装扩展", "从 Microsoft Store 装免费的“WebP 图像扩展”，装完需重启应用"],
              ["Windows 7 / 8", "不行", "只能装第三方解码器，不建议在需要交付的机器上折腾"],
              ["macOS Big Sur（11）及以后", "可以", "系统级支持，预览、快速查看、访达都正常"],
              ["macOS Catalina（10.15）及以前", "不行", "系统未内置，只能用第三方软件打开"],
            ],
          },
          {
            t: "note",
            title: "为什么 Windows 10 这一层最容易出事",
            x: "浏览器里能看，不代表双击能看。浏览器自带解码器，和系统解码器是两套东西。所以“我这边打得开”这个判断经常是假的——你在浏览器里预览的是网页，对方拿到的是文件。",
          },
          {
            t: "h3",
            x: "第 3 层：办公与设计软件（版本差异最大）",
          },
          {
            t: "table",
            head: ["软件", "原生支持起始版本", "备注"],
            rows: [
              ["Microsoft 365（Windows）", "2021 年底（v2109）起", "需同时装系统级 WebP 扩展；Office 2016/2019/2021 永久版行为不可靠"],
              ["Adobe Photoshop", "23.2（2022 年）", "更早版本需装 Google 提供的插件"],
              ["Adobe Illustrator", "26.0（2021 年）", "更早版本不支持置入"],
              ["GIMP", "2.10", "更早需插件"],
              ["Inkscape", "1.1", ""],
              ["Affinity Designer / Photo", "2.0", ""],
              ["LibreOffice（含 Draw / Impress）", "7.4", "只支持导入，不支持导出 WebP"],
              ["CorelDRAW", "24.5", ""],
            ],
          },
          {
            t: "p",
            x: "注意 LibreOffice 那一行：只支持导入。这意味着一个完全自由的办公套件也只能“看”，不能“产出”。如果工作流里有一环要用它导出，WebP 在这条链上就是断的。",
          },
          {
            t: "h3",
            x: "第 4 层：平台与交付（最不透明的一层）",
          },
          {
            t: "p",
            x: "社交平台、内容平台、电商后台对 WebP 的支持没有任何公开的兼容性表，而且它们普遍会在上传时重新编码——你上传什么格式，本来就不重要。所以这一层的正确做法不是查表，而是遵守两条：",
          },
          {
            t: "ul",
            x: [
              "发图片给别人时，不要发 WebP。不是因为对方一定打不开，而是因为失败时没有任何提示——对方只会说“图片挂了”，你无从判断是格式问题还是发送问题。",
              "往平台上传时，用 JPG 或 PNG。平台会自己转码，你多花的这点体积换来的是“上传后不会被二次压缩得更糟”。",
              "要保住画质就发文件（微信里选“以文件发送”，邮件里作为附件），不要用“发图片”的功能。",
            ],
          },
          {
            t: "h3",
            x: "第 5 层：印刷与出版（直接排除）",
          },
          {
            t: "p",
            x: "印刷环节的 RIP 和排版软件对 WebP 的支持接近于零，而且这个生态没有动力去改——它已经在 TIFF 和 PDF 上稳定运行了三十年。交付印刷的格式应该是 TIFF（无损、可承载 CMYK）或 PDF/X。WebP 只支持 RGB，连颜色空间这一关都过不去。",
          },
        ],
      },
      {
        id: "method",
        h2: "三、下面的数字是怎么测出来的",
        blocks: [
          {
            t: "p",
            x: "网上关于 WebP 体积的数字大多来自 libwebp 命令行或 cwebp，但浏览器里的“本地转换”工具用的是完全不同的接口，参数标度也不一样。为了不和本站工具自相矛盾，所有数据都在浏览器里用 canvas.toBlob 测，也就是这些工具实际调用的同一个接口。",
          },
          {
            t: "ul",
            x: [
              "编码引擎：Chrome 155 的 canvas.toBlob，headless 模式。",
              "测试图 A（照片型，1920×1280）：三个尺度的 1/f 噪声叠加在色彩渐变上。用低分辨率随机场上采样生成，让相邻像素相关——这一点很关键，逐像素白噪声在真实照片里不存在，会让结论完全反过来（后面有对照实验）。",
              "测试图 B（截图型，1920×1280）：纯白底、52px 中文字、40px 正文、1px 表格网格线。",
              "测试图 C（带透明，800×800）：圆形 logo，四角完全透明。",
              "画质指标：PSNR（峰值信噪比），越高越接近原图。38 dB 以上肉眼基本看不出，32 dB 左右仔细看能发现。",
              "等画质比较：在同一 PSNR 上对两条曲线做线性插值，得到各自的体积，再比。这是唯一有意义的比较方式——直接比同一个 quality 数字是没有意义的，因为两个编码器的 quality 标度不是一回事。",
            ],
          },
          {
            t: "note",
            title: "合成图的局限，先说清楚",
            x: "真实照片的频谱千差万别，同一台相机在不同 ISO 下噪点水平能差十几倍，而噪点多少直接决定 WebP 的收益大小。下面的绝对值不要套到你自己的图上，要看的是趋势和分界线——那条边界在哪里，是稳定的。",
          },
        ],
      },
      {
        id: "same-quality",
        h2: "四、实测一：“省 30%”这句话是怎么被用错的",
        blocks: [
          {
            t: "p",
            x: "先看一个几乎所有对比文章都会做的比较：把 JPEG 和 WebP 都设成 quality 0.8，看体积。",
          },
          {
            t: "table",
            head: ["设置", "JPEG 体积", "JPEG 画质", "WebP 体积", "WebP 画质", "体积差"],
            rows: [
              ["quality 0.8", "225.7 KB", "45.08 dB", "116.7 KB", "41.62 dB", "WebP 小 48.3%"],
            ],
          },
          {
            t: "p",
            x: "这个结果会被写成“WebP 比 JPEG 小 48%”。但它同时藏了一个事实：WebP 那一栏的画质低了 3.46 dB。这不是白赚的 48%，是用画质换来的 48%。同一份数据换个读法就变了性质。",
          },
          {
            t: "p",
            x: "正确的问题不是“同样 quality 谁更小”，而是“同样画质谁更小”。把两条曲线按 PSNR 对齐之后，结论完全不同：",
          },
          {
            t: "table",
            head: ["目标画质", "照片型 JPEG", "照片型 WebP", "WebP 相对 JPEG"],
            rows: [
              ["36 dB", "48.3 KB（q0.2）", "24.9 KB（q0.12）", "小 48%"],
              ["38 dB", "71.9 KB（q0.29）", "49.5 KB（q0.41）", "小 31%"],
              ["40 dB", "99.4 KB（q0.40）", "82.9 KB（q0.70）", "小 17%"],
              ["42 dB", "139.6 KB（q0.59）", "128.5 KB（q0.81）", "小 8%"],
              ["44 dB", "191.3 KB（q0.73）", "190.8 KB（q0.88）", "持平"],
              ["46 dB", "269.4 KB（q0.84）", "285.8 KB（q0.94）", "大 6%"],
              ["48 dB", "376.0 KB（q0.92）", "1991.0 KB（q1.00，无损）", "大 5.3 倍"],
            ],
          },
          {
            t: "p",
            x: "这就是那条边界：约 44 dB。低于它，WebP 确实更小，但省下的比例随画质升高迅速衰减（48% → 31% → 17% → 8%）；到 44 dB 完全持平；再往上 WebP 就追不上了——因为它在 47.79 dB 就触顶（q0.99），想再高一档只能跳到无损，体积直接变成 5 倍。",
          },
          {
            t: "note",
            title: "一个容易忽略的细节",
            x: "高画质段 WebP 的 quality 标度被压缩了：q0.92 到 q0.99 只换来 2.5 dB，而 JPEG 同样区间能换来 2.26 dB 但起点更高。换句话说，把 WebP 的 quality 从 0.9 往 1.0 拉，付出的是体积暴涨，买到的画质很有限。这就是为什么“WebP quality 设 0.9 以上”在生产环境里几乎总是错的选择。",
          },
          {
            t: "h3",
            x: "反例：为什么有人测出 WebP 反而更大",
          },
          {
            t: "p",
            x: "如果测试图改成逐像素白噪声（相邻像素完全不相关，模拟高 ISO 噪点或刻意加的颗粒），结论会直接翻转：quality 0.8 时 JPEG 444.2 KB、WebP 509.9 KB，WebP 反而大 14.8%。",
          },
          {
            t: "p",
            x: "这不是谁测错了，而是 WebP 的帧内预测在随机噪声上效率不高。所以那句“WebP 比 JPG 小 30%”更准确的版本是：WebP 在连续色调、中等画质的图上省得多；噪点越多、画质要求越高，省得越少，直到变成负数。",
          },
        ],
      },
      {
        id: "screenshot",
        h2: "五、实测二：截图反而是 WebP 完胜",
        blocks: [
          {
            t: "p",
            x: "上一节给人的印象是“WebP 也就那样”。但换成文档截图，结论完全反过来——在所有画质档位，WebP 都是既更小又更清晰。",
          },
          {
            t: "table",
            head: ["目标画质", "截图型 JPEG", "截图型 WebP", "WebP 相对 JPEG"],
            rows: [
              ["38 dB", "73.9 KB", "26.6 KB", "小 64%"],
              ["40 dB", "93.7 KB", "33.5 KB", "小 64%"],
              ["42 dB", "126.7 KB", "46.4 KB", "小 63%"],
            ],
          },
          {
            t: "p",
            x: "同样的 42 dB，截图型 WebP 只要 46.4 KB，而照片型 WebP 要 128.5 KB。也就是说 WebP 对“大片平坦 + 锐利边缘”的内容特别擅长，这正是对 PNG 的替代。",
          },
          {
            t: "p",
            x: "还可以看另一个指标：明显错色像素数（单通道偏差超过 48 级的像素个数）。在 quality 0.1 这个极端档位，JPEG 有 18766 个像素被改坏，WebP 只有 4796 个。文字边缘的振铃上，WebP 的优势比体积优势更明显。",
          },
          {
            t: "note",
            title: "所以截图该存 WebP 吗",
            x: "如果这张截图只在浏览器里看、且你有降级方案，是的：用 WebP 有损 quality 0.8，约 46 KB，比 PNG 小 71%，肉眼无差。但如果这张截图要发给人、要贴进文档，老老实实用 PNG——PNG 是无损的，转出去不会有任何意外。",
          },
        ],
      },
      {
        id: "lossless",
        h2: "六、实测三：无损 WebP 在截图和图标上比 PNG 更大",
        blocks: [
          {
            t: "p",
            x: "“无损 WebP 比 PNG 小 25%”也是一句流传很广的话。它同样只在特定内容上成立。同一个接口、同一个 q=1.0，三种图的结果：",
          },
          {
            t: "table",
            head: ["图型", "PNG", "无损 WebP（q1.0）", "无损 WebP 相对 PNG"],
            rows: [
              ["照片型 1920×1280", "3945.9 KB", "1991.0 KB", "小 49.5%"],
              ["截图型 1920×1280", "161.1 KB", "305.7 KB", "大 89.8%"],
              ["带透明 logo 800×800", "52.2 KB", "59.2 KB", "大 13.5%"],
            ],
          },
          {
            t: "p",
            x: "原因在两种无损算法的取向不同。PNG 是行滤波加 DEFLATE，对“大片同色区域 + 规则重复”极其高效；VP8L 用的是空间预测加前缀编码，对连续色调的统计建模更好。截图里 90% 的像素是纯白，PNG 几乎不用花字节，而 VP8L 仍然要给每个预测残差编码。",
          },
          {
            t: "p",
            x: "所以“无损 WebP 更小”只在照片类内容上成立。图标、logo、纯色 UI 素材这些 PNG 的主场，换成无损 WebP 是净亏——体积更大，兼容性更差，没有任何好处。",
          },
          {
            t: "note",
            title: "一个好消息",
            x: "截图型 WebP 有损 q0.8 只有 46.4 KB，是 PNG 的 28.8%，而且肉眼几乎无差。对“不在乎无损、只要小”的截图，有损 WebP 是很好的选择——坑只在于别用它的无损模式。",
          },
        ],
      },
      {
        id: "fallback",
        h2: "七、实测四：为什么不能“从 WebP 转回 JPG”",
        blocks: [
          {
            t: "p",
            x: "这是实际工作里最常见、也最容易做错的一步：手上只有 WebP，对方要 JPG，于是打开转换工具转一下。技术上没问题，画质上代价很大。",
          },
          {
            t: "table",
            head: ["链路", "体积", "画质", "说明"],
            rows: [
              ["原图 → JPEG q0.92", "368.0 KB", "47.93 dB", "基准：直接从原图编码"],
              ["原图 → WebP q0.8", "116.7 KB", "41.62 dB", "第一次有损压缩"],
              ["WebP → JPEG q0.92", "331.8 KB", "41.39 dB", "第二次压缩，体积反而接近直接压 JPEG"],
            ],
          },
          {
            t: "p",
            x: "关键在最后一行：WebP 转回 JPEG 后，体积涨到 331.8 KB（接近直接压 JPEG 的 368 KB），但画质是 41.39 dB，不是 47.93 dB。相比直接从原图压 JPEG，损失了 6.54 dB。",
          },
          {
            t: "p",
            x: "这就是有损压缩的不可逆性：第一次压缩丢掉的细节，第二次编码无论给多少码率都补不回来，只能忠实地把“已经损失过的结果”存下来。转换工具不会告诉你这件事，它只会显示“转换成功”。",
          },
          {
            t: "note",
            title: "规则",
            x: "回退（WebP → JPG）必须回到原始文件，不能回到已经压过的 WebP。如果没有原始文件，那就接受现实：这张图的画质上限已经被第一次压缩锁定了。彻底放弃“先转 WebP 省空间、以后需要再转回来”的工作流——那不是省空间，那是提前扔掉画质。",
          },
        ],
      },
      {
        id: "alpha",
        h2: "八、实测五：WebP 的“无损”在透明图上有损",
        blocks: [
          {
            t: "p",
            x: "这一节是个技术细节，但会影响判断。用 q=1.0 导出带透明的图，把结果与原图逐像素比较（含 Alpha 通道，不合成底色）：",
          },
          {
            t: "table",
            head: ["编码方式", "PSNR", "有差异的像素", "最大单通道偏差"],
            rows: [
              ["PNG（对照组）", "∞", "0", "0"],
              ["WebP q=1.0", "60.95 dB", "2093 个（0.33%）", "42 级"],
              ["WebP q=0.8", "40.56 dB", "203921 个（31.9%）", "255 级"],
            ],
          },
          {
            t: "p",
            x: "PNG 走完一整套解码再编码，像素完全一致，说明测量方法本身没问题。而 WebP 在 q=1.0 时仍然有 2093 个像素被改动，最大偏差 42 级（16%）——集中在圆形的半透明边缘。也就是说，浏览器里的“WebP 无损”对 RGB 是无损的，对 Alpha 通道不是。",
          },
          {
            t: "p",
            x: "同一张图，q=0.8 时有 31.9% 的像素被改动，最大偏差 255 级。这个量级说明有损模式下 Alpha 也被有损压缩了——所以“WebP 支持透明”是真的，但“WebP 的透明是无损的”是假的。对需要精确边缘的图标（尤其是会被放大显示的），这个差别能看出来。",
          },
        ],
      },
      {
        id: "deploy",
        h2: "九、怎么安全地上线：两种降级方案",
        blocks: [
          {
            t: "p",
            x: "如果 WebP 用在你自己控制的网站上，兼容性问题可以用技术手段消掉——不是“赌对方支持”，而是让不支持的客户端自动拿到别的格式。",
          },
          {
            t: "h3",
            x: "方案 A：picture 标签（静态托管、不需要服务端）",
          },
          {
            t: "code",
            lang: "html",
            x: '<picture>\n  <source type="image/webp" srcset="photo-800.webp 800w, photo-1600.webp 1600w">\n  <img src="photo-800.jpg" srcset="photo-800.jpg 800w, photo-1600.jpg 1600w"\n       alt="说明文字" width="800" height="600" loading="lazy">\n</picture>',
          },
          {
            t: "p",
            x: "浏览器按顺序尝试 source，第一个能解码的就用它；全都不认才用 img 的 src。所以 JPG 版本必须存在，且尺寸要与 WebP 一致，否则布局会跳。width 与 height 一定要写——不写会带来累积布局偏移，这个代价比省下的那点体积大得多。",
          },
          {
            t: "h3",
            x: "方案 B：服务端按 Accept 头协商（更彻底）",
          },
          {
            t: "code",
            lang: "javascript",
            x: '// 只改后缀，不改 URL：/img/photo.jpg 在支持 WebP 的客户端返回 photo.webp\nconst accept = req.headers.accept || "";\nconst supportsWebp = accept.includes("image/webp");\nconst file = supportsWebp\n  ? path.join(root, name + ".webp")\n  : path.join(root, name + ".jpg");\n\nres.setHeader("Vary", "Accept"); // 必须加，否则 CDN 会把 WebP 缓存给不支持的客户端\nres.sendFile(file);',
          },
          {
            t: "note",
            title: "Vary: Accept 这一行不能省",
            x: "这是服务端协商最常见的线上事故：没写 Vary，CDN 或反向代理会把第一次请求的响应缓存下来，然后发给所有客户端。于是支持 WebP 的人拿到了 JPG（浪费带宽），或者更糟——不支持的人拿到了 WebP（图片裂开）。而且这个错误在测试环境里几乎不会出现，因为缓存没生效。",
          },
          {
            t: "p",
            x: "如果不想动服务端，最省事的判断是：这个站点的图片是不是由自己控制、访问者是不是以现代浏览器为主。两个都是“是”，就用 WebP + picture，兼容性成本接近于零。只要有一个“否”，就别折腾，JPG 和 PNG 至今仍是最安全的选择。",
          },
        ],
      },
      {
        id: "checklist",
        h2: "十、交付前检查清单",
        blocks: [
          {
            t: "ol",
            x: [
              "这张图要离开你的控制范围吗（发人、上传、打印、插文档）？要，就转 JPG 或 PNG。",
              "转的时候用的是原始文件，还是已经压过的 WebP？只有原始文件能保住画质，从 WebP 转出去会额外损失 6.5 dB。",
              "如果留在网页上：JPG 或 PNG 的降级版本存在吗？尺寸一致吗？width 和 height 写了吗？",
              "如果走服务端协商：响应头里有 Vary: Accept 吗？（没有就会把格式发错人）",
              "画质要求到 44 dB 以上吗（印刷、大图、需要放大看）？到了就别用 WebP 有损，它在 47.79 dB 就触顶了。",
              "是图标或纯色素材吗？别用无损 WebP，它比 PNG 大 14%～90%。",
              "这张图带透明边缘吗？需要精确边缘（会被放大显示）就不要用有损 WebP，Alpha 是有损的。",
              "对方是 Windows 10 用户吗？提醒他装一次 WebP 图像扩展，或者干脆发 JPG。",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "WebP 到底比 JPG 小多少？",
        a: "取决于画质要求。实测同一张照片型测试图：等画质 38 dB 时 WebP 小 31%，40 dB 时小 17%，42 dB 时小 8%，44 dB 持平，46 dB 反而大 6%，48 dB 大 5.3 倍（WebP 只能靠无损达到）。流传的“小 30%”是低码率区间的数字，不是全区间。",
      },
      {
        q: "Safari 从哪个版本开始支持 WebP？",
        a: "Safari 14，2020 年 9 月随 iOS 14 和 macOS Big Sur 一起发布。有损、无损、Alpha、动图四种能力在同一次更新里都有。在此之前 Safari 是 WebP 普及的主要障碍，这也是老教程说“WebP 兼容性差”的来源。",
      },
      {
        q: "Windows 10 打不开 WebP 怎么办？",
        a: "从 Microsoft Store 装免费的“WebP 图像扩展”，装完重启应用。Windows 11 已内置，不用装。这是系统解码器层面的问题，和浏览器无关——浏览器自带解码器，所以经常出现“网页里能看、双击打不开”。",
      },
      {
        q: "Word 或 PPT 能插入 WebP 吗？",
        a: "Microsoft 365 for Windows 从 2021 年底（v2109）起支持，前提是系统装了 WebP 图像扩展。Office 2016 / 2019 / 2021 永久版的支持不可靠，同一个文件在不同机器上可能能插、可能报错。要交付文档，先转成 JPG 或 PNG 最省事。",
      },
      {
        q: "微信能发 WebP 吗？",
        a: "技术上能发，但没必要。社交平台在“发送图片”时会重新编码，你上传的格式本来就不会被保留；而“以文件发送”时对方打不开的概率不低。所以要么转成 JPG 发图，要么以文件形式发原图。",
      },
      {
        q: "WebP 转 JPG 会损失多少画质？",
        a: "如果从已经压过的 WebP 转，实测损失 6.54 dB（从 47.93 降到 41.39），而体积并不会明显变小。这个损失是第一次压缩时就已经产生的，第二次编码只是把它固定下来。所以回退必须回到原始文件。",
      },
      {
        q: "动图 WebP 在 Windows 上能播放吗？",
        a: "Windows 照片应用只显示首帧，不会播放动画。要看动图得用浏览器打开。这是一个容易被忽略的细节：动图 WebP 在浏览器里完全正常，在系统查看器里就是一张静态图。",
      },
      {
        q: "本站的 WebP 转换是有损还是无损？",
        a: "默认有损，quality 0.92；可以在界面上手动调整。如果你需要无损，把 quality 拉到 1.0——但先看第六节：对截图和图标，无损 WebP 比 PNG 更大，那种情况应该直接用 PNG。",
      },
    ],
    tools: [
      { label: "PNG 转 WebP", href: "/convert/png-to-webp", desc: "浏览器本地完成，不传文件" },
      { label: "JPG 转 WebP", href: "/convert/jpg-to-webp", desc: "照片类内容的首选起点" },
      { label: "WebP 转 JPG", href: "/convert/webp-to-jpg", desc: "回退时用，注意先看第七节" },
    ],
  },
  en: {
    h1: "WebP compatibility map: when it is safe, and when you must fall back to JPG",
    metaTitle: "WebP compatibility map — layered checks, plus measured size at equal quality",
    metaDescription:
      "“WebP is 30% smaller than JPG” only holds at low bitrates. Measured at equal quality: 31% smaller at 38 dB, 8% at 42 dB, a tie at 44 dB, and 5.3x larger at 48 dB. Includes a layered compatibility table, lossless WebP being 190% of PNG on screenshots, a 6.5 dB loss when converting WebP back to JPG, and the picture-element fallback.",
    keywords: [
      "WebP compatibility",
      "WebP browser support",
      "WebP to JPG",
      "WebP vs JPG size",
      "WebP not opening",
      "Safari WebP support",
      "lossless WebP",
      "WebP lossy vs lossless",
      "image format fallback",
      "picture element WebP",
    ],
    dek:
      "Two sentences get repeated about WebP: that it is 30% smaller than JPG, and that all modern browsers support it. The first is half true — it depends on the quality you are targeting. The second is true for browsers and completely false for software. This article takes both apart with measured numbers and a layered compatibility table.",
    sections: [
      {
        id: "verdict",
        h2: "1. The short answer: three cases, three decisions",
        blocks: [
          {
            t: "p",
            x: "Do not start with format details. Start with where the image is going. WebP compatibility was never really a browser problem — that was settled in 2020. What actually breaks is everything after the browser: sending it to someone, inserting it into a document, handing it to a print shop, uploading it to a platform.",
          },
          {
            t: "table",
            head: ["Where the image goes", "WebP?", "Why"],
            rows: [
              ["Displayed on a site you control", "Yes, and you should", "Pair it with a picture element or server negotiation. The bandwidth saving is real and fully under your control"],
              ["Archived, viewed on your own machine", "Yes", "Windows 11 decodes it natively; Windows 10 needs one free extension"],
              ["Sent to other people (chat, email, USB stick)", "No", "The odds of it not opening are too high, and chat apps re-encode images anyway — WebP as an intermediate is pointless"],
              ["Inserted into Word, PowerPoint, a submission", "No", "Microsoft 365 for Windows only since late 2021, and only with the system codec; Office 2016/2019/2021 perpetual builds are unreliable"],
              ["Printing, publishing, prepress", "Never", "RIPs and layout software do not read it. Delivery formats are TIFF or PDF"],
              ["Icons, stickers, asset packs", "Depends", "WebP supports transparency, but many asset tools do not read it — check the recipient’s software first"],
            ],
          },
          {
            t: "note",
            title: "One-line rule",
            x: "WebP is a distribution format, not an archive format. It belongs in the segment between “encoding finished” and “being looked at”. The moment an image leaves your control, hand over JPG or PNG instead.",
          },
        ],
      },
      {
        id: "map",
        h2: "2. The compatibility map: five layers, kept separate",
        blocks: [
          {
            t: "p",
            x: "“Supports WebP” means different things in different contexts. Browser support, operating-system support, application support and platform support are four independent implementations, and a gap in any one of them means a file that will not open. Keep them apart and the surprises stop.",
          },
          { t: "h3", x: "Layer 1: browsers — this one is solved" },
          {
            t: "table",
            head: ["Capability", "Chrome", "Edge", "Firefox", "Safari"],
            rows: [
              ["Lossy WebP", "17+", "18+", "65+", "14+ (iOS 14 / macOS Big Sur)"],
              ["Lossy + lossless + alpha", "23+", "18+", "65+", "14+"],
              ["Animated WebP", "32+", "18+", "65+", "14+"],
              ["Android system browser", "4.0+ (lossy) / 4.2+ (lossless + alpha)", "—", "—", "—"],
            ],
          },
          {
            t: "p",
            x: "These figures come from Google’s official WebP FAQ. The key date is September 2020, when Safari 14 shipped with iOS 14 and macOS Big Sur and added WebP. Before that, Safari was the single obstacle to WebP adoption — and the origin of every older tutorial that still calls WebP poorly supported. That reason no longer exists.",
          },
          { t: "h3", x: "Layer 2: operating systems — Windows 10 is the trap" },
          {
            t: "table",
            head: ["System", "Opens on double-click?", "Notes"],
            rows: [
              ["Windows 11", "Yes", "Decoder built in; Photos, Paint and Explorer previews all work"],
              ["Windows 10 (1809+)", "Needs an extension", "Install the free “WebP Image Extensions” from the Microsoft Store, then restart the app"],
              ["Windows 7 / 8", "No", "Third-party codecs only — not worth it on a machine used for delivery"],
              ["macOS Big Sur (11)+", "Yes", "System level; Preview, Quick Look and Finder all work"],
              ["macOS Catalina (10.15) and earlier", "No", "No system decoder; third-party apps only"],
            ],
          },
          {
            t: "note",
            title: "Why layer 2 is where things go wrong",
            x: "Opening in a browser does not imply opening on double-click. Browsers carry their own decoders; the OS has a separate one. So “it opens fine on my machine” is frequently a false conclusion — what you previewed was a web page, not a file.",
          },
          { t: "h3", x: "Layer 3: office and design software — widest version spread" },
          {
            t: "table",
            head: ["Application", "First version with native support", "Notes"],
            rows: [
              ["Microsoft 365 (Windows)", "Late 2021 (v2109)", "Also requires the OS-level WebP extension; Office 2016/2019/2021 perpetual builds are unreliable"],
              ["Adobe Photoshop", "23.2 (2022)", "Earlier versions need Google’s plugin"],
              ["Adobe Illustrator", "26.0 (2021)", "Earlier versions cannot place the file"],
              ["GIMP", "2.10", "Plugin before that"],
              ["Inkscape", "1.1", ""],
              ["Affinity Designer / Photo", "2.0", ""],
              ["LibreOffice (Draw / Impress)", "7.4", "Import only — cannot export WebP"],
              ["CorelDRAW", "24.5", ""],
            ],
          },
          {
            t: "p",
            x: "Note the LibreOffice row: import only. Even a fully free office suite can read the file but cannot produce one. If any step in your workflow depends on it exporting, the chain is broken there.",
          },
          { t: "h3", x: "Layer 4: platforms and delivery — the least transparent layer" },
          {
            t: "p",
            x: "Social platforms, content platforms and e-commerce backends publish no compatibility tables, and they almost all re-encode on upload — the format you send was never going to survive anyway. So the right approach here is not research but two habits:",
          },
          {
            t: "ul",
            x: [
              "Do not send WebP to people. Not because it will certainly fail, but because failure is silent — the other side just says “the image is broken” and you cannot tell whether it was the format or the transfer.",
              "Upload JPG or PNG to platforms. They transcode anyway; the extra bytes buy you a better starting point before their compression.",
              "To preserve quality, send the file itself (WeChat “send as file”, email attachment), not the “send image” path.",
            ],
          },
          { t: "h3", x: "Layer 5: prepress — simply excluded" },
          {
            t: "p",
            x: "RIPs and layout software have effectively zero WebP support, and that ecosystem has no incentive to change — it has run on TIFF and PDF for thirty years. Delivery formats are TIFF (lossless, CMYK-capable) or PDF/X. WebP is RGB only, so it fails at the colour space gate before anything else.",
          },
        ],
      },
      {
        id: "method",
        h2: "3. How these numbers were measured",
        blocks: [
          {
            t: "p",
            x: "Most WebP size comparisons online come from libwebp’s cwebp or ImageMagick. But in-browser “convert locally” tools use a completely different API with a different quality scale. To avoid contradicting the tool on this site, everything below was measured in the browser through canvas.toBlob — the exact interface those tools call.",
          },
          {
            t: "ul",
            x: [
              "Encoder: Chrome 155 canvas.toBlob, headless.",
              "Test image A (photo-like, 1920×1280): three octaves of 1/f noise over a colour gradient, generated by upscaling a low-resolution random field so neighbouring pixels correlate. This matters — per-pixel white noise does not occur in real photographs and flips the conclusion (there is a control experiment below).",
              "Test image B (screenshot, 1920×1280): white background, 52px Chinese heading, 40px body text, 1px table rules.",
              "Test image C (transparent, 800×800): circular logo, fully transparent corners.",
              "Quality metric: PSNR in dB — higher is closer to the original. Above 38 dB the difference is essentially invisible; around 32 dB it becomes noticeable.",
              "Equal-quality comparison: linear interpolation on both curves at the same PSNR, then compare sizes. This is the only meaningful comparison — comparing the same quality number across two encoders is meaningless, because their scales are not the same thing.",
            ],
          },
          {
            t: "note",
            title: "The limits of synthetic images, stated up front",
            x: "Real photographs vary enormously: the same camera at different ISO settings can differ tenfold in noise, and noise level directly determines how much WebP saves. Do not apply the absolute numbers to your own images. What is stable is the trend and the boundary — where the line falls does not move much.",
          },
        ],
      },
      {
        id: "same-quality",
        h2: "4. Measurement 1: how “30% smaller” gets misused",
        blocks: [
          {
            t: "p",
            x: "Start with the comparison almost every article makes: set both JPEG and WebP to quality 0.8 and compare size.",
          },
          {
            t: "table",
            head: ["Setting", "JPEG size", "JPEG quality", "WebP size", "WebP quality", "Difference"],
            rows: [["quality 0.8", "225.7 KB", "45.08 dB", "116.7 KB", "41.62 dB", "WebP 48.3% smaller"]],
          },
          {
            t: "p",
            x: "That result gets written up as “WebP is 48% smaller than JPEG”. It hides one fact: the WebP column is 3.46 dB worse. Those 48% were not free — they were bought with quality. Same data, different reading, different conclusion.",
          },
          {
            t: "p",
            x: "The right question is not “which is smaller at the same quality setting” but “which is smaller at the same quality”. Align both curves by PSNR and the picture changes completely:",
          },
          {
            t: "table",
            head: ["Target quality", "Photo-like JPEG", "Photo-like WebP", "WebP vs JPEG"],
            rows: [
              ["36 dB", "48.3 KB (q0.2)", "24.9 KB (q0.12)", "48% smaller"],
              ["38 dB", "71.9 KB (q0.29)", "49.5 KB (q0.41)", "31% smaller"],
              ["40 dB", "99.4 KB (q0.40)", "82.9 KB (q0.70)", "17% smaller"],
              ["42 dB", "139.6 KB (q0.59)", "128.5 KB (q0.81)", "8% smaller"],
              ["44 dB", "191.3 KB (q0.73)", "190.8 KB (q0.88)", "a tie"],
              ["46 dB", "269.4 KB (q0.84)", "285.8 KB (q0.94)", "6% larger"],
              ["48 dB", "376.0 KB (q0.92)", "1991.0 KB (q1.00, lossless)", "5.3x larger"],
            ],
          },
          {
            t: "p",
            x: "There is the boundary: roughly 44 dB. Below it WebP really is smaller, but the saving decays fast as quality rises (48% → 31% → 17% → 8%); at 44 dB it is a tie; above that WebP cannot keep up, because it tops out at 47.79 dB (q0.99) and the next step up is lossless — a 5x jump in size.",
          },
          {
            t: "note",
            title: "An easily missed detail",
            x: "WebP’s quality scale is compressed at the high end: q0.92 to q0.99 buys only 2.5 dB. Which is why “set WebP quality above 0.9” is almost always the wrong choice in production — you pay a steep size increase for a very small quality gain.",
          },
          { t: "h3", x: "Counter-example: why some people measure WebP as larger" },
          {
            t: "p",
            x: "Swap the test image for per-pixel white noise (neighbouring pixels uncorrelated, simulating high-ISO grain) and the conclusion inverts: at quality 0.8, JPEG is 444.2 KB and WebP is 509.9 KB — WebP is 14.8% larger.",
          },
          {
            t: "p",
            x: "Nobody measured it wrong. WebP’s intra prediction is simply inefficient on random noise. So the accurate version of “WebP is 30% smaller than JPG” is: WebP saves a lot on continuous-tone images at moderate quality; the noisier the image and the higher the quality target, the less it saves — until it turns negative.",
          },
        ],
      },
      {
        id: "screenshot",
        h2: "5. Measurement 2: on screenshots WebP wins outright",
        blocks: [
          {
            t: "p",
            x: "The previous section makes WebP look mediocre. Switch to a document screenshot and the result inverts — at every quality level, WebP is both smaller and sharper.",
          },
          {
            t: "table",
            head: ["Target quality", "Screenshot JPEG", "Screenshot WebP", "WebP vs JPEG"],
            rows: [
              ["38 dB", "73.9 KB", "26.6 KB", "64% smaller"],
              ["40 dB", "93.7 KB", "33.5 KB", "64% smaller"],
              ["42 dB", "126.7 KB", "46.4 KB", "63% smaller"],
            ],
          },
          {
            t: "p",
            x: "At the same 42 dB, screenshot WebP needs 46.4 KB while photo WebP needs 128.5 KB. WebP is especially good at “large flat areas plus sharp edges” — exactly what PNG is used for.",
          },
          {
            t: "p",
            x: "A second metric agrees: badly shifted pixels (any channel off by more than 48 levels). At the extreme quality 0.1 setting, JPEG corrupts 18,766 pixels while WebP corrupts 4,796. WebP’s advantage on text edges is larger than its advantage in size.",
          },
          {
            t: "note",
            title: "So should screenshots be stored as WebP?",
            x: "If the screenshot is only ever viewed in a browser and you have a fallback, yes: lossy WebP at quality 0.8 is about 46 KB, 71% smaller than PNG, visually identical. But if it will be sent to someone or pasted into a document, use PNG — it is lossless and nothing surprising happens downstream.",
          },
        ],
      },
      {
        id: "lossless",
        h2: "6. Measurement 3: lossless WebP is larger than PNG on screenshots and icons",
        blocks: [
          {
            t: "p",
            x: "“Lossless WebP is 25% smaller than PNG” is another widely repeated claim. It is also content-dependent. Same API, same q=1.0, three image types:",
          },
          {
            t: "table",
            head: ["Image", "PNG", "Lossless WebP (q1.0)", "WebP vs PNG"],
            rows: [
              ["Photo-like 1920×1280", "3945.9 KB", "1991.0 KB", "49.5% smaller"],
              ["Screenshot 1920×1280", "161.1 KB", "305.7 KB", "89.8% larger"],
              ["Transparent logo 800×800", "52.2 KB", "59.2 KB", "13.5% larger"],
            ],
          },
          {
            t: "p",
            x: "The reason is that the two lossless algorithms optimise for different things. PNG is row filtering plus DEFLATE, which is superb at “large uniform regions plus regular repetition”. VP8L uses spatial prediction plus prefix coding, which models continuous tone better. In a screenshot, 90% of pixels are pure white: PNG spends almost nothing on them, while VP8L still has to encode a residual for each one.",
          },
          {
            t: "p",
            x: "So “lossless WebP is smaller” holds only for photo-like content. On icons, logos and flat UI assets — PNG’s home turf — switching to lossless WebP is a net loss: bigger file, worse compatibility, no benefit.",
          },
          {
            t: "note",
            title: "One piece of good news",
            x: "Lossy WebP at q0.8 for a screenshot is only 46.4 KB — 28.8% of PNG, with no visible difference. For screenshots where lossless does not matter and small size does, lossy WebP is an excellent choice. The trap is only in using its lossless mode.",
          },
        ],
      },
      {
        id: "fallback",
        h2: "7. Measurement 4: why you should not “convert WebP back to JPG”",
        blocks: [
          {
            t: "p",
            x: "This is the most common and most easily botched step in real work: you only have the WebP, the other side wants JPG, so you open a converter and convert. Technically fine. In quality terms, expensive.",
          },
          {
            t: "table",
            head: ["Path", "Size", "Quality", "Notes"],
            rows: [
              ["Original → JPEG q0.92", "368.0 KB", "47.93 dB", "Baseline: encoded straight from the original"],
              ["Original → WebP q0.8", "116.7 KB", "41.62 dB", "First lossy pass"],
              ["WebP → JPEG q0.92", "331.8 KB", "41.39 dB", "Second pass; size ends up near a direct JPEG"],
            ],
          },
          {
            t: "p",
            x: "The last row is the point: after converting back, the file grows to 331.8 KB — close to the 368 KB of a direct JPEG — but the quality is 41.39 dB, not 47.93 dB. That is 6.54 dB lost compared with compressing the original directly.",
          },
          {
            t: "p",
            x: "This is the irreversibility of lossy compression: detail removed by the first pass cannot be restored by the second, no matter how much bitrate you give it — the encoder can only faithfully store an already-damaged result. The converter will not tell you this. It just says “conversion complete”.",
          },
          {
            t: "note",
            title: "The rule",
            x: "A fallback conversion (WebP → JPG) must start from the original file, never from the already-compressed WebP. If the original is gone, accept it: that image’s quality ceiling was fixed by the first compression. Abandon the “convert to WebP to save space, convert back later when needed” workflow entirely — it does not save space, it discards quality in advance.",
          },
        ],
      },
      {
        id: "alpha",
        h2: "8. Measurement 5: WebP’s “lossless” is lossy on transparency",
        blocks: [
          {
            t: "p",
            x: "A technical detail, but it affects decisions. Export a transparent image at q=1.0 and compare pixel by pixel against the original, including the alpha channel and without compositing onto a background:",
          },
          {
            t: "table",
            head: ["Encoding", "PSNR", "Pixels differing", "Max single-channel deviation"],
            rows: [
              ["PNG (control)", "∞", "0", "0"],
              ["WebP q=1.0", "60.95 dB", "2,093 (0.33%)", "42 levels"],
              ["WebP q=0.8", "40.56 dB", "203,921 (31.9%)", "255 levels"],
            ],
          },
          {
            t: "p",
            x: "PNG survives a full decode and re-encode with identical pixels, which proves the measurement itself is sound. WebP at q=1.0 still alters 2,093 pixels, up to 42 levels (16%), concentrated on the antialiased circle edge. In other words, browser “lossless WebP” is lossless for RGB and lossy for alpha.",
          },
          {
            t: "p",
            x: "At q=0.8, 31.9% of pixels change with deviations up to 255 levels — that magnitude means alpha is being lossily compressed too. So “WebP supports transparency” is true, but “WebP transparency is lossless” is false. For icons that will be scaled up, that difference is visible.",
          },
        ],
      },
      {
        id: "deploy",
        h2: "9. Shipping it safely: two fallback strategies",
        blocks: [
          {
            t: "p",
            x: "If the WebP lives on a site you control, compatibility can be engineered away — not by betting that the client supports it, but by making unsupported clients receive something else automatically.",
          },
          { t: "h3", x: "Option A: the picture element (static hosting, no server code)" },
          {
            t: "code",
            lang: "html",
            x: '<picture>\n  <source type="image/webp" srcset="photo-800.webp 800w, photo-1600.webp 1600w">\n  <img src="photo-800.jpg" srcset="photo-800.jpg 800w, photo-1600.jpg 1600w"\n       alt="Description" width="800" height="600" loading="lazy">\n</picture>',
          },
          {
            t: "p",
            x: "The browser tries sources in order and uses the first it can decode; only if none work does it fall back to the img src. So the JPG must exist and must match the WebP dimensions, or the layout jumps. Always set width and height — omitting them causes cumulative layout shift, which costs far more than the bytes you saved.",
          },
          { t: "h3", x: "Option B: server-side Accept negotiation (more thorough)" },
          {
            t: "code",
            lang: "javascript",
            x: '// Same URL, different bytes: /img/photo.jpg returns photo.webp to capable clients\nconst accept = req.headers.accept || "";\nconst supportsWebp = accept.includes("image/webp");\nconst file = supportsWebp\n  ? path.join(root, name + ".webp")\n  : path.join(root, name + ".jpg");\n\nres.setHeader("Vary", "Accept"); // required, or a CDN will serve WebP to everyone\nres.sendFile(file);',
          },
          {
            t: "note",
            title: "The Vary: Accept line is not optional",
            x: "This is the classic production incident for server negotiation: without Vary, a CDN or reverse proxy caches the first response and serves it to every client. So WebP-capable visitors get JPG (wasted bandwidth), or worse — incapable clients get WebP and see broken images. And it almost never shows up in staging, because the cache is not warm there.",
          },
          {
            t: "p",
            x: "If you would rather not touch the server, use the simple test: do you control the images, and is the audience on modern browsers? If both are yes, WebP with a picture element costs almost nothing in compatibility. If either is no, skip it — JPG and PNG remain the safest choice available.",
          },
        ],
      },
      {
        id: "checklist",
        h2: "10. Pre-delivery checklist",
        blocks: [
          {
            t: "ol",
            x: [
              "Will this image leave your control (sent, uploaded, printed, inserted into a document)? If yes, convert to JPG or PNG.",
              "Is the conversion starting from the original file, or from an already-compressed WebP? Only the original preserves quality; converting out of WebP costs an extra 6.5 dB.",
              "If it stays on the web: does the JPG or PNG fallback exist, at matching dimensions, with width and height set?",
              "If you use server negotiation: is Vary: Accept present? Without it, the wrong format reaches the wrong client.",
              "Is the quality target above 44 dB (print, large format, zoomed inspection)? Then do not use lossy WebP — it tops out at 47.79 dB.",
              "Is it an icon or flat asset? Avoid lossless WebP — it is 14% to 90% larger than PNG.",
              "Does it have soft transparent edges that will be scaled up? Avoid lossy WebP; alpha is compressed lossily.",
              "Is the recipient on Windows 10? Ask them to install the WebP Image Extension once, or just send JPG.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How much smaller is WebP than JPG, really?",
        a: "It depends on the quality target. On the same photo-like test image at equal quality: 31% smaller at 38 dB, 17% at 40 dB, 8% at 42 dB, a tie at 44 dB, 6% larger at 46 dB, and 5.3x larger at 48 dB (WebP can only reach that via lossless). The widely quoted 30% is a low-bitrate figure, not a full-range one.",
      },
      {
        q: "Which Safari version added WebP?",
        a: "Safari 14, released September 2020 alongside iOS 14 and macOS Big Sur. Lossy, lossless, alpha and animation all arrived in that one update. Before it, Safari was the main obstacle to WebP adoption — which is where older “WebP has poor support” advice comes from.",
      },
      {
        q: "How do I open WebP on Windows 10?",
        a: "Install the free “WebP Image Extensions” from the Microsoft Store, then restart the app. Windows 11 includes it. This is an OS decoder issue, unrelated to browsers — which is why the file often opens inside a web page but not on double-click.",
      },
      {
        q: "Can Word or PowerPoint insert WebP?",
        a: "Microsoft 365 for Windows supports it since late 2021 (v2109), provided the system WebP extension is installed. Office 2016, 2019 and 2021 perpetual builds are unreliable — the same file may insert on one machine and fail on another. For documents you have to deliver, convert to JPG or PNG first.",
      },
      {
        q: "Can I send WebP in a chat app?",
        a: "Technically yes, but there is no point. Chat apps re-encode images on send, so your format never survives anyway, and sending it as a file raises the odds the recipient cannot open it. Convert to JPG for images, or send the original as a file attachment.",
      },
      {
        q: "How much quality is lost converting WebP to JPG?",
        a: "From an already-compressed WebP, measured loss is 6.54 dB (47.93 down to 41.39), and the file does not get meaningfully smaller. That loss happened during the first compression; the second pass only locks it in. Always fall back from the original.",
      },
      {
        q: "Do animated WebP files play on Windows?",
        a: "The Windows Photos app shows only the first frame. Open it in a browser to see the animation. It is an easy detail to miss: animated WebP is perfectly fine in browsers and a still image in the system viewer.",
      },
      {
        q: "Is the WebP conversion on this site lossy or lossless?",
        a: "Lossy by default, at quality 0.92, adjustable in the interface. For lossless, set quality to 1.0 — but read section 6 first: on screenshots and icons, lossless WebP is larger than PNG, and those cases should stay PNG.",
      },
    ],
    tools: [
      { label: "PNG to WebP", href: "/convert/png-to-webp", desc: "Runs in your browser, files never uploaded" },
      { label: "JPG to WebP", href: "/convert/jpg-to-webp", desc: "The usual starting point for photos" },
      { label: "WebP to JPG", href: "/convert/webp-to-jpg", desc: "For fallbacks — read section 7 first" },
    ],
  },
};

export default article;
