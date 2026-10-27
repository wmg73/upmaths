import type { Article as ArticleModel, ClusterId } from "./types";
import latex from "./latex";
import markdown from "./markdown";
import paper from "./paper";
import formats from "./formats";
import webp from "./webp";

export type { Article, ArticleCopy, Block, Section } from "./types";

export const articles: ArticleModel[] = [webp, formats, paper, markdown, latex];

export function getArticle(slug: string): ArticleModel | undefined {
  return articles.find((a) => a.slug === slug);
}

export const CLUSTERS = [
  { id: "math" as const, zh: "公式与 Markdown", en: "Math & Markdown" },
  { id: "format" as const, zh: "格式决策", en: "Format decisions" },
  { id: "trouble" as const, zh: "场景排错", en: "Troubleshooting" },
];

/** 按 cluster id 取本地化名称。文章页的徽章与 Article schema 的 articleSection 都走这里，别再硬编码。 */
export function clusterName(id: ClusterId, lc: "zh" | "en"): string {
  const found = CLUSTERS.find((c) => c.id === id);
  return found ? found[lc] : "";
}

/**
 * Hub 页文案。
 * 只写「我们写什么、不写什么」，不喊口号 —— 这一段同时承担制造信任与规避重复内容的作用。
 */
export const HUB = {
  zh: {
    metaTitle: "知识库 — LaTeX 公式、Markdown 排版与格式选择指南",
    metaDescription:
      "UpMaths 知识库：LaTeX 数学公式写法、Markdown 转 Word 与 PDF 的完整流程、数学试卷与教案排版规范、PNG 与 JPG 的实测选择依据。只写能落地的规范与坑，不写与工具页重复的内容。",
    keywords: ["LaTeX 教程", "Markdown 排版", "公式写法", "试卷排版", "格式选择指南", "PNG 和 JPG 的区别"],
    h1: "知识库",
    dek:
      "这里不放「X 转 Y 在线转换」——那是工具页的活。这里放工具页装不下的东西：为什么这样写会出错、规范应该怎么定、批量做的时候哪里最容易崩。",
    introHeading: "这个栏目写什么、不写什么",
    introBody:
      "工具页负责「把文件转过去」，知识页负责「转之前该想清楚什么」。两者刻意分工：知识页的标题里不会出现「在线转换」「免费转换器」这类词，避免和站内 40 个转换页抢同一个排名；反过来，工具页也不会展开讲原理，那部分内容留在这里。",
    principles: [
      {
        title: "只写有出处、可验证的东西",
        body: "每条规范都对应一个具体的失败场景：公式为什么变红、图片为什么换台电脑就跑、题号为什么会在转 PDF 时重排。没有具体场景的经验之谈不收。",
      },
      {
        title: "宁可少写，不凑字数",
        body: "一个主题写透，好过十个主题各写 500 字。内容不够的题目先挂着，不发布会显得单薄的页面——薄页面对整站的抓取信任是有害的。",
      },
      {
        title: "不复制别人的文章",
        body: "同一件事如果别处已经写清楚，这里只写它没讲到的部分，并给出可复现的操作步骤。批量生成的相似内容会被搜索引擎整体降权，这个风险不值得冒。",
      },
    ],
    articlesHeading: "全部文章",
    readingLabel: "约 {n} 分钟",
    updatedLabel: "更新于",
    usageHeading: "怎么用这个知识库",
    usageLead: "它不是教程合集，是一份可以随时查的规范手册。",
    usage: [
      {
        title: "按问题跳读，不用通读",
        body: "每篇的二级标题就是问题清单：公式为什么变红、图片为什么换台电脑就跑、题号为什么转 PDF 会重排。遇到哪个点进去看哪节，页首目录可以直接跳。",
      },
      {
        title: "要动手时回工具页",
        body: "知识页不提供上传入口，也不抢「在线转换」这类词。需要真的转文件，从导航或文末的配套工具进去，两边各管一段。",
      },
      {
        title: "交付前对着清单过一遍",
        body: "每篇文末都有一份检查清单，是给「已经排完、准备发出去」的阶段用的。逐条勾比凭感觉检查可靠得多。",
      },
    ],
    faqHeading: "关于这个栏目",
    faqs: [
      {
        q: "为什么现在只有五篇文章？",
        a: "因为只发写完的。内容不够厚就先不建页面——薄页面对整站抓取信任的伤害，比少几篇文章大得多。已确定的题目列在「接下来会写」里，写完才上线。",
      },
      {
        q: "这些内容多久更新一次？",
        a: "工具行为变化时同步更新，例如转换引擎升级、支持的文件类型调整。每篇页首都标了更新日期，改过就会变。",
      },
      {
        q: "知识库和工具页的内容会重复吗？",
        a: "刻意不重复。工具页写「怎么用、支持什么、有什么限制」，知识库写「为什么这样、规范应该怎么定、出错怎么排查」，标题里不会出现同一个主关键词。",
      },
      {
        q: "可以指定想看的题目吗？",
        a: "可以，从联系页提。被采纳的题目会进「接下来会写」清单，但不承诺时间——写不透的题目不会为了凑数发出来。",
      },
    ],
    plannedHeading: "接下来会写",
    plannedLead: "下面是已确定要写、但还没动笔的题目。不建空页面，写完才上线。",
    planned: [
      "HEIC 是什么：iPhone 照片为什么在 Windows 上打不开",
      "透明背景转 JPG 变黑：从原理到三种补救",
      "扫描版 PDF 转 Word：为什么必须先 OCR，以及 OCR 之后还会错在哪",
      "LaTeX 公式转图片：分辨率、透明背景与批量导出",
    ],
    toolHeading: "配套工具",
    tools: [
      { label: "Markdown & LaTeX 编辑器", href: "/editor", desc: "边写边预览，公式即时渲染" },
      { label: "文档转换（Word ↔ PDF）", href: "/docx", desc: "双引擎转换，保留排版" },
      { label: "图片格式转换", href: "/formats", desc: "20 组格式互转，浏览器本地完成" },
    ],
  },
  en: {
    metaTitle: "Guides — LaTeX Math, Markdown Typography, and Format Choices",
    metaDescription:
      "UpMaths guides: how to write LaTeX math, the complete Markdown to Word and PDF workflow, typesetting rules for math exams, and measured evidence for choosing between PNG and JPG. Only rules and failure cases that hold up — nothing that duplicates the tool pages.",
    keywords: ["LaTeX guide", "Markdown formatting", "math notation", "exam typesetting", "format selection", "PNG vs JPG"],
    h1: "Guides",
    dek:
      "This is not where “convert X to Y online” lives — that is the tool pages’ job. This is where the things a tool page cannot hold go: why a construct fails, what a rule should be, and where batch work breaks.",
    introHeading: "What this section covers — and what it deliberately skips",
    introBody:
      "Tool pages handle moving the file; guides handle what you should settle before you convert. The split is deliberate: no guide headline contains “online converter” or “free conversion”, so they never compete with the 40 tool pages for the same query. Conversely, the tool pages do not explain theory — that lives here.",
    principles: [
      {
        title: "Only what can be verified",
        body: "Every rule maps to a specific failure: why a formula turns red, why a figure moves on another machine, why question numbers renumber on PDF export. General advice without a concrete failure case does not get published.",
      },
      {
        title: "Fewer pieces, written properly",
        body: "One subject covered thoroughly beats ten subjects at 500 words each. Topics that are not ready stay unpublished — thin pages damage a site’s crawl trust far more than they add.",
      },
      {
        title: "No rewriting other people’s articles",
        body: "If something is already well explained elsewhere, only the missing part gets written here, with reproducible steps. Mass-produced near-duplicate content is exactly what search engines now demote site-wide.",
      },
    ],
    articlesHeading: "All guides",
    readingLabel: "{n} min read",
    updatedLabel: "Updated",
    usageHeading: "How to use this section",
    usageLead: "Not a tutorial series — a reference you can dip into at any point.",
    usage: [
      {
        title: "Jump by problem, not by chapter",
        body: "The H2s are a list of problems: why a formula turns red, why a figure moves on another machine, why numbering renumbers on export. The table of contents jumps straight there.",
      },
      {
        title: "Go back to the tool page to actually work",
        body: "Guides carry no uploader and do not target “online converter” queries. When you need to convert a file, use the navigation or the tool links at the end of each article.",
      },
      {
        title: "Run the checklist before delivery",
        body: "Every article ends with a checklist written for the moment you are about to send the file. Ticking items beats trusting your eye.",
      },
    ],
    faqHeading: "About this section",
    faqs: [
      {
        q: "Why are there only five articles?",
        a: "Because only finished pieces get published. If a topic is not yet substantial, no page is created — thin pages damage a site’s crawl trust far more than a smaller article count does. Planned topics are listed, and pages appear only when written.",
      },
      {
        q: "How often is this content updated?",
        a: "Whenever the underlying tool behaviour changes — a new conversion engine, a change in supported file types. Each article shows its update date at the top.",
      },
      {
        q: "Will guides duplicate the tool pages?",
        a: "Deliberately not. Tool pages cover usage, supported formats, and limits; guides cover why things work, what the rules should be, and how to debug failures. No headline repeats the same primary keyword.",
      },
      {
        q: "Can I request a topic?",
        a: "Yes, through the contact page. Accepted topics go into the “coming next” list, with no promised date — a topic that cannot be written properly will not be published to pad the count.",
      },
    ],
    plannedHeading: "Coming next",
    plannedLead: "Decided, not yet written. No placeholder pages — articles appear only when they are finished.",
    planned: [
      "What HEIC is: why iPhone photos will not open on Windows",
      "Transparent PNG to JPG turns black: the mechanism and three fixes",
      "Scanned PDF to Word: why OCR must come first, and what still goes wrong after it",
      "LaTeX to image: resolution, transparency, and batch export",
    ],
    toolHeading: "Tools that go with these guides",
    tools: [
      { label: "Markdown & LaTeX editor", href: "/editor", desc: "Write and preview with live math rendering" },
      { label: "Document converter (Word ↔ PDF)", href: "/docx", desc: "Dual engines, layout preserved" },
      { label: "Image format converter", href: "/formats", desc: "20 conversion pairs, entirely in your browser" },
    ],
  },
};
