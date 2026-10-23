"use client";

/**
 * 核心图片格式转换组件
 * ---------------------------------------------------------------------------
 * 本组件只运行在浏览器端，所有处理通过 lib/convert.ts 本地完成。
 *
 * 状态机：
 *   IDLE        → 等待用户上传
 *   PROCESSING  → 解码 / 编码进行中
 *   SUCCESS     → 转换完成，展示预览 + 下载
 *   ERROR       → 出错，展示错误信息，允许重新开始
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  convertImage,
  formatBytes,
  normalizeFormatKey,
} from "@/lib/convert";

// 每种格式对应的文件扩展名 accept 值
const ACCEPT_MAP: Record<string, string> = {
  png: ".png,image/png",
  jpg: ".jpg,.jpeg,image/jpeg",
  jpeg: ".jpg,.jpeg,image/jpeg",
  webp: ".webp,image/webp",
  bmp: ".bmp,image/bmp",
  gif: ".gif,image/gif",
  heic: ".heic,.heif",
  heif: ".heic,.heif",
  svg: ".svg,image/svg+xml",
};

interface ConverterProps {
  /** 目标格式 slug，如 'png' 'jpg' 'webp' */
  targetSlug: string;
}

type Status = "idle" | "processing" | "success" | "error";

export function Converter({ targetSlug }: ConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [sourceKey, setSourceKey] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);

  // 拖拽状态
  const [dragActive, setDragActive] = useState(false);

  // 清理 Blob URL 避免内存泄漏
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // 文件选择
  // ---------------------------------------------------------------------------

  const handleFile = useCallback(
    (f: File | null) => {
      if (!f) return;
      // 清理上一个结果
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setOutputBlob(null);
      setOutputSize(0);
      setErrorMsg("");
      setStatus("idle");

      setFile(f);
      setFileName(f.name);
      setFileSize(f.size);

      // 推断源格式（仅用于 UI 展示，实际转换时 convertImage 会再推断一次）
      const mime = (f.type || "").toLowerCase();
      const extFromName = f.name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() || "";
      const key = normalizeFormatKey(mime) || normalizeFormatKey(extFromName) || "";
      setSourceKey(key || "未知");
    },
    [previewUrl],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
    // 允许再次选同一个文件
    if (e.target) e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  // ---------------------------------------------------------------------------
  // 转换
  // ---------------------------------------------------------------------------

  const runConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMsg("");
    setOutputBlob(null);
    try {
      const blob = await convertImage(file, targetSlug, {});
      const url = URL.createObjectURL(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setOutputBlob(blob);
      setOutputSize(blob.size);
      setStatus("success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "转换失败，请重试。";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  // ---------------------------------------------------------------------------
  // 下载
  // ---------------------------------------------------------------------------

  const downloadOutput = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    // 保留原文件名，只换扩展名
    const dotIdx = fileName.lastIndexOf(".");
    const baseName = dotIdx > 0 ? fileName.slice(0, dotIdx) : fileName || "converted";
    const ext = outputBlob.type.split("/")[1] || targetSlug;
    a.href = url;
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setOutputBlob(null);
    setFile(null);
    setFileName("");
    setFileSize(0);
    setSourceKey("");
    setErrorMsg("");
    setStatus("idle");
  };

  // ---------------------------------------------------------------------------
  // 渲染
  // ---------------------------------------------------------------------------

  const accept = ACCEPT_MAP[targetSlug] || "image/*";
  const targetUpper = targetSlug.toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* 拖拽 / 选择区 */}
      {status !== "success" && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
          className={`relative flex flex-col items-center justify-center cursor-pointer transition-all p-8 text-center border-2 border-dashed ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
          />
          <div className="text-4xl mb-3">🖼️</div>
          <div className="font-semibold text-slate-800">
            拖拽图片到这里，或 <span className="text-blue-600">点击选择文件</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            支持 PNG / JPG / WebP / BMP / HEIC / SVG · 单个文件 ≤ 20 MB · 全部本地处理，不上传
          </div>
        </div>
      )}

      {/* 已选文件信息 + 转换区 */}
      {file && status !== "success" && (
        <div className="p-5">
          <div className="mb-5 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded bg-slate-200 flex items-center justify-center font-mono text-xs text-slate-600 uppercase">
                {(sourceKey || "?").slice(0, 4)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-slate-800">
                  {fileName}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  大小：{formatBytes(fileSize)}
                  {sourceKey && (
                    <>
                      {" "}· 源格式：<span className="font-mono">{sourceKey.toUpperCase()}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={resetAll}
                className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                aria-label="清除已选文件"
              >
                清除
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {status === "error" && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <div className="font-semibold mb-1">转换失败</div>
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* 转换按钮 */}
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
                转换中，请稍候…
              </>
            ) : (
              <>
                <span>转成 {targetUpper}</span>
                <span className="text-blue-200 text-sm">▶</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 转换成功：预览 + 下载 */}
      {status === "success" && previewUrl && outputBlob && (
        <div className="p-6">
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <span>✓</span>
              <span>转换完成</span>
            </div>
            <div className="mt-1 text-xs text-green-700">
              {sourceKey.toUpperCase()} → {targetUpper} · {formatBytes(fileSize)} → {formatBytes(outputSize)}
              {outputSize < fileSize && (
                <span className="ml-1 text-green-700 font-medium">
                  (节省 {((1 - outputSize / fileSize) * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          </div>

          {/* 预览 */}
          <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="转换结果预览"
              className="max-w-full max-h-72 rounded shadow-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadOutput}
              className="flex-1 rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 transition"
            >
              下载 .{targetSlug}
            </button>
            <button
              onClick={resetAll}
              className="px-4 rounded-lg border border-slate-300 bg-white py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              再转一张
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
