/**
 * pairs.json 数据校验脚本
 * ---------------------------------------------------------------------------
 * 在构建前自动执行，确保所有转换对数据符合规范。
 *
 * 校验规则：
 *   1. slug 全局唯一
 *   2. related 指向的 slug 必须存在于 pairs 数组中
 *   3. note 长度 >= 40 字符（中文字符算 1 个 Unicode 码点）
 *   4. useCases 至少 2 条
 *   5. faq 至少 3 条，每条 question 和 answer 非空
 *   6. 必需字段存在且类型正确
 *   7. conversionType 只能是 "有损" 或 "无损"
 *
 * 任何一条失败 → process.exit(1)，next build 被阻断。
 */

import pairs from "@/data/pairs.json";
import type { Pair } from "@/components/PairTemplate";

type Raw = Record<string, unknown>;

interface ValidationError {
  slug: string;
  field: string;
  message: string;
}

const errors: ValidationError[] = [];
const seenSlugs = new Set<string>();
const allSlugs = new Set<string>(pairs.map((p: Raw) => String(p.slug)));

function pushError(slug: string, field: string, message: string) {
  errors.push({ slug, field, message });
}

// ============================================================================
// 逐条校验
// ============================================================================

for (const raw of pairs as Raw[]) {
  const p = raw as unknown as Pair;
  const slug = String(p.slug ?? "<no-slug>");

  // --- 1. slug 唯一 ---
  if (seenSlugs.has(slug)) {
    pushError(slug, "slug", `slug 重复：「${slug}」已出现过`);
  } else {
    seenSlugs.add(slug);
  }

  // --- 7. 必需字段 ---
  const requiredFields: (keyof Pair)[] = [
    "source",
    "target",
    "slug",
    "mimeSource",
    "mimeTarget",
    "conversionType",
    "typicalSize",
    "note",
    "useCases",
    "related",
    "faq",
  ];
  for (const field of requiredFields) {
    const v = p[field];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      pushError(slug, field as string, `缺少必填字段或为空：${field}`);
    }
  }

  // --- 7. conversionType 枚举 ---
  if (p.conversionType !== "有损" && p.conversionType !== "无损") {
    pushError(slug, "conversionType", `conversionType 必须是「有损」或「无损」，当前是「${p.conversionType}」`);
  }

  // --- 3. note 长度 >= 40 ---
  const noteLen = (p.note ?? "").trim().length;
  if (noteLen < 40) {
    pushError(slug, "note", `note 长度不足 40 字符（当前 ${noteLen} 字符）`);
  }

  // --- 4. useCases >= 2 ---
  if (!Array.isArray(p.useCases) || p.useCases.length < 2) {
    pushError(slug, "useCases", `useCases 至少需要 2 条（当前 ${p.useCases?.length ?? 0} 条）`);
  }

  // --- 2. related 指向的 slug 存在，且 2-4 个 ---
  if (!Array.isArray(p.related) || p.related.length < 2 || p.related.length > 4) {
    pushError(slug, "related", `related 必须有 2-4 个 slug（当前 ${p.related?.length ?? 0} 个）`);
  } else {
    for (const rel of p.related) {
      if (!allSlugs.has(rel)) {
        pushError(slug, "related", `related 中的 slug 「${rel}」不存在于 pairs 数组中（断链）`);
      }
      if (rel === slug) {
        pushError(slug, "related", `related 不能指向自身：${rel}`);
      }
    }
  }

  // --- 5. faq >= 3，非空 ---
  if (!Array.isArray(p.faq) || p.faq.length < 3) {
    pushError(slug, "faq", `faq 至少需要 3 条（当前 ${p.faq?.length ?? 0} 条）`);
  } else {
    p.faq.forEach((f, i) => {
      if (!f.question || !f.question.trim()) {
        pushError(slug, `faq[${i}].question`, `第 ${i + 1} 条 FAQ 的 question 为空`);
      }
      if (!f.answer || !f.answer.trim()) {
        pushError(slug, `faq[${i}].answer`, `第 ${i + 1} 条 FAQ 的 answer 为空`);
      }
    });
  }
}

// ============================================================================
// 内链网络连通性检查（整张图的弱连通性）
// ============================================================================

function isConnected(): { connected: boolean; unreachable: string[] } {
  if (pairs.length === 0) return { connected: true, unreachable: [] };

  const graph = new Map<string, string[]>();
  for (const p of pairs as Pair[]) {
    graph.set(p.slug, p.related);
  }

  const visited = new Set<string>();
  const stack: string[] = [String(pairs[0].slug)];
  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const n of graph.get(node) ?? []) {
      if (!visited.has(n)) stack.push(n);
    }
  }

  const unreachable = [...allSlugs].filter((s) => !visited.has(s));
  return { connected: unreachable.length === 0, unreachable };
}

// ============================================================================
// 输出结果
// ============================================================================

console.log(`\n📋 pairs.json 数据校验 — 共 ${pairs.length} 条转换对`);
console.log("=".repeat(60));

if (errors.length > 0) {
  console.error(`\n❌ 校验失败：共 ${errors.length} 处错误\n`);
  for (const e of errors) {
    console.error(`  [${e.slug}] ${e.field}: ${e.message}`);
  }
  process.exit(1);
}

const net = isConnected();
if (!net.connected) {
  console.error(`\n❌ 内链网络不连通：以下 slug 从首节点不可达`);
  for (const s of net.unreachable) console.error(`  - ${s}`);
  process.exit(1);
}

console.log(`✅ 校验通过`);
console.log(`   - 所有 slug 唯一`);
console.log(`   - 所有 related 指链有效且 2-4 个`);
console.log(`   - 所有 note ≥ 40 字符`);
console.log(`   - 所有 useCases ≥ 2 条`);
console.log(`   - 所有 faq ≥ 3 条`);
console.log(`   - 内链网络弱连通\n`);
