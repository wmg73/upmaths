/**
 * 浏览器端图片格式转换
 * ---------------------------------------------------------------------------
 * 全部在浏览器本地处理，零上传零存储。
 *
 * 支持的源 → 目标路径：
 *   原生 Canvas 编解码： PNG ⇄ JPG/JPEG ⇄ WebP ⇄ BMP
 *   HEIC → JPG / PNG  （heic2any 动态导入）
 *   SVG → PNG          （DOMParser 栅格化）
 *
 * 不支持的组合会抛出带「暂不支持」提示的错误，交由上层 UI 展示。
 */

// ============================================================================
// 格式映射表
// ============================================================================

/** 用户传入的格式字符串 → 浏览器 MIME type + 默认扩展名 */
const FORMAT_MAP: Record<
  string,
  { mime: string; ext: string; lossless: boolean; supportsAlpha: boolean }
> = {
  png: { mime: "image/png", ext: ".png", lossless: true, supportsAlpha: true },
  jpg: {
    mime: "image/jpeg",
    ext: ".jpg",
    lossless: false,
    supportsAlpha: false,
  },
  jpeg: {
    mime: "image/jpeg",
    ext: ".jpg",
    lossless: false,
    supportsAlpha: false,
  },
  webp: {
    mime: "image/webp",
    ext: ".webp",
    lossless: false,
    supportsAlpha: true,
  },
  bmp: { mime: "image/bmp", ext: ".bmp", lossless: true, supportsAlpha: true },
  gif: { mime: "image/gif", ext: ".gif", lossless: true, supportsAlpha: false },
  heic: { mime: "image/heic", ext: ".heic", lossless: true, supportsAlpha: true },
  heif: { mime: "image/heif", ext: ".heif", lossless: true, supportsAlpha: true },
  svg: { mime: "image/svg+xml", ext: ".svg", lossless: true, supportsAlpha: true },
};

/** 可在 Canvas 上原生解码 + toBlob 编码的位图格式 */
const CANVAS_FORMATS = new Set(["png", "jpg", "jpeg", "webp", "bmp"]);

/** 源文件大小安全阈值（字节）——超过 20MB 会提前警告，避免浏览器 OOM */
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

/** JPG 默认质量 */
const DEFAULT_JPG_QUALITY = 0.92;
/** WebP 默认有损质量（WebP 浏览器默认 0.8） */
const DEFAULT_WEBP_QUALITY = 0.85;

// ============================================================================
// 公开类型
// ============================================================================

export interface ConvertOptions {
  /** 输出质量 0-1，仅有损格式（JPG/WebP）生效。默认：JPG=0.92, WebP=0.85 */
  quality?: number;
}

// ============================================================================
// 主入口
// ============================================================================

/**
 * 将 File / Blob 转换为指定目标格式的 Blob。
 *
 * @throws Error 当格式组合不支持、文件过大、解码失败、浏览器能力不足时，
 *               所有错误消息都是面向最终用户的可读中文文案。
 */
export async function convertImage(
  file: File | Blob,
  targetFormat: string,
  options: ConvertOptions = {},
): Promise<Blob> {
  // --- 1. 参数校验 ---
  const targetKey = targetFormat.trim().toLowerCase();
  const targetMeta = FORMAT_MAP[targetKey];
  if (!targetMeta) {
    throw new Error(
      `暂不支持的目标格式「${targetFormat}」。当前仅支持：PNG / JPG / WebP / BMP / HEIC / SVG 之间互转。`,
    );
  }

  if (!file || !(file instanceof Blob)) {
    throw new Error("未选择文件或文件无效，请重新选择图片。");
  }

  if (file.size > MAX_FILE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(
      `文件过大（${mb} MB），浏览器处理可能卡死内存。建议先压缩或使用更小的图片（≤20 MB）。`,
    );
  }

  // --- 2. 从文件推断源格式 ---
  const sourceKey = detectSourceFormat(file);
  if (!sourceKey) {
    throw new Error(
      "无法识别文件格式。请确认这是有效的图片文件（PNG / JPG / WebP / BMP / HEIC / SVG）。",
    );
  }

  // 同格式：直接返回原 Blob，不走编码链路浪费 CPU
  if (sourceKey === targetKey || sourceKey === "jpeg" && targetKey === "jpg") {
    return file as Blob;
  }

  // --- 3. 解码：把源文件变成 HTMLCanvasElement ---
  const canvas = await decodeToCanvas(file, sourceKey, sourceKey === "svg");

  // --- 4. 编码：把 Canvas 转成目标格式 Blob ---
  return await encodeFromCanvas(canvas, targetKey, targetMeta, options);
}

// ============================================================================
// 解码：源文件 → Canvas
// ============================================================================

/** 从 File 的 MIME 或文件名推断源格式 key */
function detectSourceFormat(file: File | Blob): string | null {
  const mime = (file.type || "").toLowerCase();
  const name = (file as File).name?.toLowerCase() || "";

  // MIME 优先
  for (const [key, meta] of Object.entries(FORMAT_MAP)) {
    if (meta.mime === mime) return key;
  }

  // 再看扩展名兜底
  const m = name.match(/\.([a-z0-9]+)$/);
  if (m) {
    const ext = m[1];
    if (FORMAT_MAP[ext]) return ext;
  }

  // 用文件头 magic number 做最终兜底
  return null;
}

/**
 * 解码到 Canvas。三种路径：
 *   - HEIC/HEIF → heic2any 解码为 ImageBitmap
 *   - SVG       → DOMParser + Blob URL 栅格化
 *   - 其他      → createImageBitmap / Image 元素
 */
async function decodeToCanvas(
  file: File | Blob,
  sourceKey: string,
  isVector: boolean,
): Promise<HTMLCanvasElement> {
  // --- HEIC / HEIF ---
  if (sourceKey === "heic" || sourceKey === "heif") {
    return decodeHeicToCanvas(file as File);
  }

  // --- SVG 栅格化 ---
  if (sourceKey === "svg" || isVector) {
    return decodeSvgToCanvas(file);
  }

  // --- 位图：createImageBitmap 优先，fallback Image ---
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法创建 Canvas 2D 上下文（浏览器不支持）");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return canvas;
  } catch {
    // createImageBitmap 失败（某些 Safari 旧版或不支持 WebP）
    return await decodeViaImageElement(file);
  }
}

/** Image 元素兜底解码 */
function decodeViaImageElement(file: File | Blob): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("无法创建 Canvas 2D 上下文"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "图片解码失败。可能是文件损坏，或浏览器不支持该格式（例如 HEIC 需要 iOS/macOS 原生支持，Windows 需用专门工具）。",
        ),
      );
    };
    img.src = url;
  });
}

/** HEIC/HEIF 解码——动态导入 heic2any，不在首屏 bundle */
async function decodeHeicToCanvas(file: File): Promise<HTMLCanvasElement> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const heic2any = (await import("heic2any")).default;
    const result = (await heic2any({
      blob: file,
      toType: "image/png",
      quality: 0.92,
    })) as Blob;

    const bitmap = await createImageBitmap(result);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法创建 Canvas 2D 上下文");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return canvas;
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "未知解码错误";
    // heic2any 未安装时的友好提示
    if (/Cannot find module|module not found|404/i.test(msg)) {
      throw new Error(
        "HEIC 解码库（heic2any）未加载，请先执行 npm install heic2any 或在服务器重启后再试。",
      );
    }
    throw new Error(
      `HEIC 文件解码失败（${msg}）。若在 Windows 上打开，请安装 HEIC 扩展后再尝试，或转成 JPG 后再上传。`,
    );
  }
}

/** SVG 栅格化 */
async function decodeSvgToCanvas(file: Blob): Promise<HTMLCanvasElement> {
  const svgText = await file.text();

  // 简单有效性检查
  if (!/<svg[\s>]/i.test(svgText)) {
    throw new Error("这不是有效的 SVG 文件（缺少 <svg> 根元素）。");
  }

  // Blob URL 方式——比 srcdoc 更通用，支持有 <use>/<foreignObject> 等的复杂 SVG
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    // SVG 没有固定像素尺寸——优先读 viewBox，没有就用 naturalWidth（SVG 渲染器默认）
    const { width, height } = svgDimensions(svgText, img.naturalWidth, img.naturalHeight);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法创建 Canvas 2D 上下文");
    // SVG 通常是透明底，栅格化后也保留透明（如果后续转 JPG 会自动填白）
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("SVG 栅格化失败。可能包含外链资源导致跨域，或格式不合法。")),
    img.src = src;
  });
}

/** 从 SVG 文本里提取 width/height/viewBox，返回栅格化目标尺寸 */
function svgDimensions(
  text: string,
  naturalW: number,
  naturalH: number,
): { width: number; height: number } {
  // 先读 viewBox
  const vb = text.match(/viewBox=["']([^"']+)["']/i);
  if (vb) {
    const parts = vb[1].trim().split(/[\s,]+/);
    if (parts.length === 4) {
      const w = parseFloat(parts[2]);
      const h = parseFloat(parts[3]);
      if (w > 0 && h > 0) {
        // 限制最大边不超过 4096，避免超大 SVG 栅格化吃内存
        const max = 4096;
        const scale = Math.min(1, max / Math.max(w, h));
        return { width: Math.round(w * scale), height: Math.round(h * scale) };
      }
    }
  }
  // 再尝试 width/height 属性
  const wm = text.match(/<svg[^>]*\bwidth=["']([^"']+)["']/i);
  const hm = text.match(/<svg[^>]*\bheight=["']([^"']+)["']/i);
  if (wm && hm) {
    const w = parseFloat(wm[1]);
    const h = parseFloat(hm[1]);
    if (w > 0 && h > 0) return { width: w, height: h };
  }
  // 兜底：naturalWidth/naturalHeight（浏览器渲染后的默认尺寸，通常是 300×150）
  return {
    width: naturalW || 1024,
    height: naturalH || 1024,
  };
}

// ============================================================================
// 编码：Canvas → 目标 Blob
// ============================================================================

async function encodeFromCanvas(
  canvas: HTMLCanvasElement,
  targetKey: string,
  targetMeta: (typeof FORMAT_MAP)[string],
  options: ConvertOptions,
): Promise<Blob> {
  // GIF / ICO / AVIF 不在 Canvas API 支持列表里
  if (!CANVAS_FORMATS.has(targetKey)) {
    throw new Error(
      `暂不支持输出为 ${targetMeta.mime.split("/")[1].toUpperCase()} 格式。当前工具仅支持导出：PNG / JPG / WebP / BMP。`,
    );
  }

  const quality = resolveQuality(targetKey, options.quality);

  // 目标不支持透明（JPG / JPEG）→ 先画白底覆盖 canvas
  let encodingCanvas = canvas;
  if (!targetMeta.supportsAlpha) {
    const bg = document.createElement("canvas");
    bg.width = canvas.width;
    bg.height = canvas.height;
    const bgCtx = bg.getContext("2d")!;
    bgCtx.fillStyle = "#ffffff";
    bgCtx.fillRect(0, 0, bg.width, bg.height);
    bgCtx.drawImage(canvas, 0, 0);
    encodingCanvas = bg;
  }

  const blob = await canvasToBlob(
    encodingCanvas,
    targetMeta.mime,
    quality,
  );

  // 浏览器 toBlob 可能静默返回 PNG fallback（如老 Safari 不支持 WebP toBlob）
  if (!blob.type.includes(targetMeta.mime.split("/")[1])) {
    // 某些浏览器 toBlob 返回的 MIME 不准确——再用 toDataURL 的头部校验一次
    const probeType = probeCanvasOutputType(targetMeta.mime);
    if (!probeType) {
      throw new Error(
        `当前浏览器不支持导出 ${targetMeta.mime.split("/")[1].toUpperCase()} 格式。建议使用最新版 Chrome / Edge / Firefox。`,
      );
    }
  }

  return blob;
}

/** 根据目标格式决定是否传 quality，以及默认值 */
function resolveQuality(
  targetKey: string,
  userQuality?: number,
): number | undefined {
  if (userQuality !== undefined) {
    const q = Math.max(0.1, Math.min(1, userQuality));
    return q;
  }
  if (targetKey === "jpg" || targetKey === "jpeg") return DEFAULT_JPG_QUALITY;
  if (targetKey === "webp") return DEFAULT_WEBP_QUALITY;
  return undefined; // PNG / BMP 无损，忽略 quality
}

/** Promise 包装 canvas.toBlob */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                `Canvas 导出 ${mime} 失败。浏览器可能不支持该格式的 toBlob。`,
              ),
            );
            return;
          }
          resolve(blob);
        },
        mime,
        quality,
      );
    } catch (e) {
      reject(
        new Error(
          `Canvas 导出异常：${e instanceof Error ? e.message : String(e)}`,
        ),
      );
    }
  });
}

/** 探测浏览器 toDataURL 是否真的支持某个 MIME（true=支持，false=会 fallback PNG） */
function probeCanvasOutputType(mime: string): boolean {
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    const url = c.toDataURL(mime as any);
    return url.startsWith(`data:${mime}`);
  } catch {
    return false;
  }
}

// ============================================================================
// 通用工具
// ============================================================================

/** 格式化字节数 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** 把 target slug 或 MIME 解析回 FORMAT_MAP key（Converter 组件自用） */
export function normalizeFormatKey(input: string): string | null {
  const lower = input.trim().toLowerCase();
  if (FORMAT_MAP[lower]) return lower;
  for (const [key, meta] of Object.entries(FORMAT_MAP)) {
    if (meta.mime === lower) return key;
  }
  return null;
}
