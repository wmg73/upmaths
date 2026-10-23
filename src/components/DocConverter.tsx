"use client";

/**
 * 文档格式转换组件（PDF ↔ Word）
 * ---------------------------------------------------------------------------
 * 与 Converter.tsx（图片转换、纯浏览器本地）不同，本组件通过
 * POST /api/convert-doc 将文件上传到服务器，由 LibreOffice headless
 * 执行转换后返回结果文件。
 *
 * 状态机：IDLE → UPLOADING → PROCESSING → SUCCESS / ERROR
 * 上传与转换合并为一次 fetch（服务端接收 FormData 后直接调用 soffice）
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface DocConverterProps {
  /** "docx-to-pdf" | "pdf-to-docx" */
  direction: "docx-to-pdf" | "pdf-to-docx";
}

type Status = "idle" | "processing" | "success" | "error";

const MAX_MB = 50;

const EXT_MAP: Record<string, { accept: string; outputExt: string; label: string }> = {
  "docx-to-pdf": { accept: ".docx,.doc", outputExt: "pdf", label: "Word → PDF" },
  "pdf-to-docx": { accept: ".pdf", outputExt: "docx", label: "PDF → Word" },
};

export function DocConverter({ direction }: DocConverterProps) {
  const cfg = EXT_MAP[direction];

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [outputName, setOutputName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (outputBlob) URL.revokeObjectURL(URL.createObjectURL(outputBlob));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatBytes = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(2)} MB`;
  };

  const reset = () => {
    if (outputBlob) {
      URL.revokeObjectURL(URL.createObjectURL(outputBlob));
      setOutputBlob(null);
    }
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    setOutputSize(0);
    setOutputName("");
  };

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    reset();
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`文件太大（${(f.size / 1024 / 1024).toFixed(1)} MB），上限 ${MAX_MB} MB`);
      setStatus("error");
      return;
    }
    setFile(f);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
    if (e.target) e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const runConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("direction", direction);

      const res = await fetch("/api/convert-doc", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let msg = `服务器返回 ${res.status}`;
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      const blob = await res.blob();
      // 从 header 拿文件名（若有），否则自己算
      let name = "";
      const cd = res.headers.get("Content-Disposition") || "";
      const m = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
      if (m) name = decodeURIComponent(m[1]);
      if (!name) {
        const dotIdx = file.name.lastIndexOf(".");
        const base = dotIdx > 0 ? file.name.slice(0, dotIdx) : file.name;
        name = `${base}.${cfg.outputExt}`;
      }

      setOutputBlob(blob);
      setOutputSize(blob.size);
      setOutputName(name);
      setStatus("success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "转换失败，请重试";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const downloadOutput = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // =========================================================================
  // 渲染
  // =========================================================================

  const sourceLabel = direction === "docx-to-pdf" ? "Word / .docx" : "PDF";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* 1. 拖拽 / 选择区 */}
      {status !== "success" && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          className={`relative flex flex-col items-center justify-center cursor-pointer transition-all p-8 text-center border-2 border-dashed ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={cfg.accept}
            className="sr-only"
            onChange={onFileChange}
          />
          <div className="text-4xl mb-3">{direction === "docx-to-pdf" ? "📄" : "📑"}</div>
          <div className="font-semibold text-slate-800">
            拖拽 {sourceLabel} 文件到这里，或 <span className="text-blue-600">点击选择文件</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            支持 {cfg.accept.replace(/,/g, " / ")} · 单个文件 ≤ {MAX_MB} MB · 转换过程在服务器上完成
          </div>
        </div>
      )}

      {/* 2. 已选文件信息 + 转换区 */}
      {file && status !== "success" && (
        <div className="p-5">
          <div className="mb-5 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded bg-slate-200 flex items-center justify-center font-mono text-xs text-slate-600 uppercase">
                {(file.name.split(".").pop() || "?").slice(0, 4)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-slate-800">{file.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">大小：{formatBytes(file.size)}</div>
              </div>
              <button
                onClick={reset}
                className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
              >清除</button>
            </div>
          </div>

          {status === "error" && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <div className="font-semibold mb-1">转换失败</div>
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <button
            onClick={runConvert}
            disabled={status === "processing"}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {status === "processing" ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                服务器处理中，请稍候…
              </>
            ) : (
              <>{cfg.label.split(" → ")[0]} 转 {cfg.label.split(" → ")[1]} <span className="text-blue-200 text-sm">▶</span></>
            )}
          </button>
        </div>
      )}

      {/* 3. 成功：下载区 */}
      {status === "success" && outputBlob && (
        <div className="p-6">
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <span>✓</span>
              <span>转换完成</span>
            </div>
            <div className="mt-1 text-xs text-green-700">
              输出文件大小：{formatBytes(outputSize)}
            </div>
          </div>

          <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center font-mono text-xs font-bold text-blue-700 uppercase">
              {cfg.outputExt}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-slate-800">{outputName}</div>
              <div className="text-xs text-slate-500">{formatBytes(outputSize)}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadOutput}
              className="flex-1 rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 transition"
            >
              下载 .{cfg.outputExt}
            </button>
            <button
              onClick={reset}
              className="px-4 rounded-lg border border-slate-300 bg-white py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
            >再转一份</button>
          </div>
        </div>
      )}
    </div>
  );
}
