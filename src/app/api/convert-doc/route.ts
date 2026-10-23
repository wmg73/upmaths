import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const DIRECTION_CONFIG: Record<
  string,
  { sourceExt: string[]; targetExt: string; targetMime: string; sofficeFormat: string }
> = {
  "docx-to-pdf": {
    sourceExt: [".docx"],
    targetExt: ".pdf",
    targetMime: "application/pdf",
    sofficeFormat: "pdf",
  },
  "doc-to-pdf": {
    sourceExt: [".doc"],
    targetExt: ".pdf",
    targetMime: "application/pdf",
    sofficeFormat: "pdf",
  },
  "pdf-to-docx": {
    sourceExt: [".pdf"],
    targetExt: ".docx",
    targetMime:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    sofficeFormat: "docx",
  },
};

/** sanitize 文件名：只保留字母数字中文点下划线 */
function sanitizeName(name: string): string {
  return name.replace(/[^\w.\-\u4e00-\u9fa5]/g, "_").slice(0, 128);
}

function getExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i).toLowerCase() : "";
}

/** 跑 soffice，Promise 化。
 *  注意：soffice 出错时退出码可能仍为 0（如 "no export filter"），
 *  因此需要同时检查 stderr 是否包含 Error 关键字。 */
function runSoffice(
  inputPath: string,
  outDir: string,
  targetFormat: string,
): Promise<{ ok: boolean; stderr: string }> {
  return new Promise((resolve) => {
    const args = [
      "--headless",
      "--norestore",
      "--nologo",
      "--nodefault",
      "--nolockcheck",
      "--invisible",
      "--convert-to",
      targetFormat,
      "--outdir",
      outDir,
      inputPath,
    ];
    const proc = spawn("soffice", args, { timeout: 60_000 });
    let err = "";
    proc.stderr?.on("data", (d) => (err += d.toString()));
    proc.stdout?.on("data", (d) => (err += d.toString()));
    proc.on("error", (e) => {
      resolve({ ok: false, stderr: e.message });
    });
    proc.on("close", (code) => {
      // soffice 即使转换失败也可能返回 exit 0，需结合 stderr 判断
      const hasError = /^Error:/im.test(err) || /no export filter/i.test(err);
      resolve({ ok: code === 0 && !hasError, stderr: err });
    });
  });
}

/** 用 pdf2docx 把 PDF 转为 DOCX。
 *  LibreOffice Draw 导出 docx 在此服务器版本有 bug（impl_store 失败），
 *  故 pdf->docx 改用 Python pdf2docx 库。 */
function runPdf2Docx(
  inputPath: string,
  outputPath: string,
): Promise<{ ok: boolean; stderr: string }> {
  return new Promise((resolve) => {
    const script = path.join(process.cwd(), "src", "lib", "convert_pdf_to_docx.py");
    const proc = spawn("/usr/bin/python3", [script, inputPath, outputPath], {
      timeout: 120_000,
    });
    let err = "";
    proc.stderr?.on("data", (d) => (err += d.toString()));
    proc.stdout?.on("data", (d) => (err += d.toString()));
    proc.on("error", (e) => {
      resolve({ ok: false, stderr: e.message });
    });
    proc.on("close", (code) => {
      resolve({ ok: code === 0, stderr: err });
    });
  });
}

export async function POST(req: Request) {
  const tmpDirs: string[] = [];

  try {
    // ---- 1. 解析 FormData ----
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const direction = (form.get("direction") as string | null) || "";

    if (!file || !file.size) {
      return NextResponse.json({ error: "未检测到文件" }, { status: 400 });
    }
    if (!DIRECTION_CONFIG[direction]) {
      return NextResponse.json(
        { error: `不支持的转换方向：${direction}` },
        { status: 400 },
      );
    }
    const cfg = DIRECTION_CONFIG[direction];

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `文件过大（${(file.size / 1024 / 1024).toFixed(1)} MB），上限 50 MB` },
        { status: 413 },
      );
    }

    const ext = getExt(file.name);
    if (!cfg.sourceExt.includes(ext)) {
      return NextResponse.json(
        { error: `文件格式不匹配，只支持 ${cfg.sourceExt.join(" / ")} 转 ${cfg.targetExt} 格式` },
        { status: 400 },
      );
    }
    // ---- 2. 准备临时目录 ----
    const uid = randomUUID();
    const workDir = path.join(os.tmpdir(), `upmaths-convert-${uid}`);
    await mkdir(workDir, { recursive: true });
    tmpDirs.push(workDir);

    const safeName = sanitizeName(file.name);
    const inputPath = path.join(workDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    // ---- 3. 执行转换 ----
    const baseName = safeName.slice(0, safeName.lastIndexOf("."));
    const outPath = path.join(workDir, baseName + cfg.targetExt);

    let result: { ok: boolean; stderr: string };
    if (direction === "pdf-to-docx") {
      // PDF -> DOCX：LibreOffice Draw 导出 docx 在此版本有 bug，改用 pdf2docx
      result = await runPdf2Docx(inputPath, outPath);
    } else {
      // Word -> PDF：继续用 LibreOffice（Writer 导出 pdf 正常）
      result = await runSoffice(inputPath, workDir, cfg.sofficeFormat);
    }

    if (!result.ok) {
      return NextResponse.json(
        { error: "转换失败，请稍后重试。", detail: result.stderr.slice(-500) },
        { status: 502 },
      );
    }

    // ---- 4. 找输出文件 ----
    if (!existsSync(outPath)) {
      return NextResponse.json(
        { error: "转换完成但未找到输出文件", detail: result.stderr.slice(-500) },
        { status: 502 },
      );
    }

    const outBuffer = await readFile(outPath);

    // ---- 5. 返回文件 ----
    const finalName = `${baseName}${cfg.targetExt}`;
    return new NextResponse(outBuffer, {
      status: 200,
      headers: {
        "Content-Type": cfg.targetMime,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(finalName)}"`,
        "Content-Length": outBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[convert-doc] error:", e);
    const msg = e instanceof Error ? e.message : "未知错误";
    // formData() 在非 multipart 请求时会抛 TypeError
    if (msg.includes("multipart/form-data") || msg.includes("application/x-www-form-urlencoded")) {
      return NextResponse.json({ error: "请通过浏览器上传文件" }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    // ---- 6. 清理临时目录 ----
    for (const d of tmpDirs) {
      try {
        await rm(d, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  }
}
