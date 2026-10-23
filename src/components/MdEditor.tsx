"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

const DEFAULT_MD = `# Markdown & LaTeX 在线编辑器

欢迎使用 **UpMaths · Markdown & LaTeX 在线编辑器** 👋

左栏写 Markdown 源码，右栏**实时预览**。所有计算都在浏览器本地完成，内容不会上传到任何服务器。

---

## ✏️ 基础 Markdown

**粗体** · *斜体* · ~~删除线~~ · \`行内代码\`

> 这是一段引用文字，用来强调重要内容。

### 列表

- 无序列表项 1
- 无序列表项 2
  - 嵌套项

1. 有序列表项
2. 有序列表项
3. 有序列表项

### 表格

| 工具 | 格式 | 说明 |
| :--- | :--- | :--- |
| Word → PDF | .docx → .pdf | LibreOffice 引擎 |
| PDF → Word | .pdf → .docx | 高质量排版 |
| Markdown | .md | 实时预览 + LaTeX |

---

## 🧮 LaTeX 数学公式

行内公式用 **单美元符** \`$...$\`，例如：勾股定理 $a^2 + b^2 = c^2$。

块级公式用 **双美元符** \`$$...$$\`：

$$
x_{1,2} = {-b \pm \sqrt{b^2 - 4ac} \over 2a}
$$

微积分基本定理：

$$
\int_{a}^{b} f(x)\,dx = F(b) - F(a)
$$

矩阵：

$$
A = \begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

---

## 🛠️ 试试改改看

在左边编辑区直接修改文字，右边会实时更新。
\`Ctrl/Cmd + B\` 插入粗体，\`Ctrl/Cmd + I\` 插入斜体。
\`Ctrl/Cmd + S\` 下载 .md 文件，点击工具栏 📥 下载 HTML。
`;

/** 工具栏按钮定义 */
const TOOLBAR_BTNS: {
  label: string;
  icon: string;
  insert: (before: string, after: string) => [string, string];
  shortcut?: string;
  title: string;
}[] = [
  {
    label: "H1",
    icon: "H1",
    title: "一级标题 (Ctrl+1)",
    insert: () => ["# ", ""],
  },
  {
    label: "H2",
    icon: "H2",
    title: "二级标题 (Ctrl+2)",
    insert: () => ["## ", ""],
  },
  {
    label: "H3",
    icon: "H3",
    title: "三级标题 (Ctrl+3)",
    insert: () => ["### ", ""],
  },
  {
    label: "粗体",
    icon: "B",
    title: "粗体 (Ctrl+B)",
    insert: () => ["**", "**"],
    shortcut: "b",
  },
  {
    label: "斜体",
    icon: "I",
    title: "斜体 (Ctrl+I)",
    insert: () => ["*", "*"],
    shortcut: "i",
  },
  {
    label: "删除线",
    icon: "S",
    title: "删除线",
    insert: () => ["~~", "~~"],
  },
  {
    label: "引用",
    icon: "❝",
    title: "引用块",
    insert: () => ["> ", ""],
  },
  {
    label: "列表",
    icon: "•",
    title: "无序列表",
    insert: () => ["- ", ""],
  },
  {
    label: "代码",
    icon: "</>",
    title: "行内代码",
    insert: () => ["`", "`"],
  },
  {
    label: "代码块",
    icon: "{ }",
    title: "代码块",
    insert: () => ["```\n", "\n```"],
  },
  {
    label: "链接",
    icon: "🔗",
    title: "链接",
    insert: () => ["[", "](https://)"],
  },
  {
    label: "行内公式",
    icon: "$",
    title: "行内 LaTeX $...$",
    insert: () => ["$", "$"],
  },
  {
    label: "块公式",
    icon: "$$",
    title: "块级 LaTeX $$...$$",
    insert: () => ["$$\n", "\n$$"],
  },
];

function MdEditor() {
  const [text, setText] = useState(DEFAULT_MD);
  const [split, setSplit] = useState(true); // true=双栏, false=仅预览
  const [copied, setCopied] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  /** Markdown 渲染（带 LaTeX + GFM + HTML 支持） */
  const rendered = useMemo(
    () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        disallowedElements={[]}
      >
        {text}
      </ReactMarkdown>
    ),
    [text]
  );

  /** 插入模板到 textarea（保留选中） */
  const insertTemplate = useCallback(
    (before: string, after: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = text.slice(start, end);
      const newVal =
        text.slice(0, start) + before + (selected || "文本") + after + text.slice(end);
      setText(newVal);
      requestAnimationFrame(() => {
        const cursorStart = start + before.length;
        const cursorEnd = cursorStart + (selected ? selected.length : 2);
        ta.focus();
        ta.setSelectionRange(cursorStart, cursorEnd);
      });
    },
    [text]
  );

  /** 快捷键 + 工具栏按钮统一处理 */
  const handleAction = useCallback(
    (type: string) => {
      switch (type) {
        case "h1": insertTemplate("# ", ""); break;
        case "h2": insertTemplate("## ", ""); break;
        case "h3": insertTemplate("### ", ""); break;
        case "bold": insertTemplate("**", "**"); break;
        case "italic": insertTemplate("*", "*"); break;
        case "strike": insertTemplate("~~", "~~"); break;
        case "quote": insertTemplate("> ", ""); break;
        case "ul": insertTemplate("- ", ""); break;
        case "code": insertTemplate("`", "`"); break;
        case "codeblock": insertTemplate("```\n", "\n```"); break;
        case "link": insertTemplate("[", "](https://)"); break;
        case "inline-math": insertTemplate("$", "$"); break;
        case "block-math": insertTemplate("$$\n", "\n$$"); break;
      }
    },
    [insertTemplate]
  );

  /** 键盘快捷键 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "b") { e.preventDefault(); handleAction("bold"); }
      else if (key === "i") { e.preventDefault(); handleAction("italic"); }
      else if (key === "s") { e.preventDefault(); downloadMd(); }
      else if (key === "1") { e.preventDefault(); handleAction("h1"); }
      else if (key === "2") { e.preventDefault(); handleAction("h2"); }
      else if (key === "3") { e.preventDefault(); handleAction("h3"); }
    },
    [handleAction]
  );

  const downloadMd = () => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMd = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const downloadHtml = () => {
    // 生成完整 HTML 文档（用 DOMParser 从渲染节点取 innerHTML）
    const previewEl = document.getElementById("md-preview");
    const body = previewEl ? previewEl.innerHTML : "";
    const html = `<!DOCTYPE html>
<html lang="zh-CN"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Markdown Export</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<style>
body{max-width:800px;margin:2rem auto;padding:0 1rem;font-family:"Inter","PingFang SC",system-ui,sans-serif;line-height:1.8;color:#1e293b}
h1,h2,h3{border-bottom:1px solid #e2e8f0;padding-bottom:.3rem}
pre{background:#0f172a;color:#e2e8f0;padding:1rem;border-radius:.5rem;overflow-x:auto}
code{background:#f1f5f9;padding:.1rem .4rem;border-radius:.25rem;color:#be123c;font-size:.9em}
pre code{background:transparent;color:inherit;padding:0}
blockquote{border-left:4px solid #60a5fa;background:#eff6ff;padding:.5rem 1rem;margin:1rem 0;color:#475569}
table{border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:.4rem .8rem}th{background:#f1f5f9}
img{max-width:100%;border:1px solid #e2e8f0;border-radius:.25rem}
.katex-display{overflow-x:auto}
</style></head><body>${body}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    if (confirm("确定要清空所有内容吗？")) setText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[480px]">
      {/* === 工具栏 === */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-3 py-2">
        {TOOLBAR_BTNS.map((btn) => (
          <button
            key={btn.label}
            title={btn.title}
            onClick={() => {
              const actionMap: Record<string, () => void> = {
                H1: () => handleAction("h1"),
                H2: () => handleAction("h2"),
                H3: () => handleAction("h3"),
                粗体: () => handleAction("bold"),
                斜体: () => handleAction("italic"),
                删除线: () => handleAction("strike"),
                引用: () => handleAction("quote"),
                列表: () => handleAction("ul"),
                代码: () => handleAction("code"),
                代码块: () => handleAction("codeblock"),
                链接: () => handleAction("link"),
                行内公式: () => handleAction("inline-math"),
                块公式: () => handleAction("block-math"),
              };
              actionMap[btn.label]?.();
            }}
            className="min-w-[34px] rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            {btn.icon}
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <button
          onClick={() => setSplit(!split)}
          title={split ? "切换到仅预览" : "切换到双栏"}
          className="rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          {split ? "⇄ 双栏" : "◉ 仅预览"}
        </button>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <button
          onClick={copyMd}
          title="复制 Markdown 源码"
          className="rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          {copied ? "✓ 已复制" : "📋 复制"}
        </button>
        <button
          onClick={downloadMd}
          title="下载 .md 文件 (Ctrl+S)"
          className="rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          📥 .md
        </button>
        <button
          onClick={downloadHtml}
          title="下载 HTML 文件"
          className="rounded px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          🌐 .html
        </button>
        <button
          onClick={clear}
          title="清空"
          className="rounded px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          🗑 清空
        </button>

        <div className="ml-auto text-xs text-slate-400">
          {text.length} 字符 · {text.split("\n").length} 行
        </div>
      </div>

      {/* === 编辑区 === */}
      {split ? (
        <div className="grid flex-1 min-h-0" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* 左：textarea */}
          <div className="flex flex-col min-h-0 border-r border-slate-200">
            <textarea
              ref={taRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="在这里输入 Markdown..."
              className="md-editor-textarea flex-1 w-full resize-none bg-slate-50 p-4 text-sm outline-none focus:bg-white"
            />
          </div>
          {/* 右：预览 */}
          <div
            id="md-preview"
            className="md-preview flex-1 overflow-auto bg-white p-6"
          >
            {rendered}
          </div>
        </div>
      ) : (
        <div
          id="md-preview"
          className="md-preview flex-1 overflow-auto bg-white p-6"
        >
          {rendered}
        </div>
      )}
    </div>
  );
}

export default MdEditor;
