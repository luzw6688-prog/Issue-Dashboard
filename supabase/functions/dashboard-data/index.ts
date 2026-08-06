const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ADMIN_PASSCODE_SHA256 = "050361781b121d151a3ea9b86ad80395d1e641cbb5950b51a77d37997c1ac018";
const ALLOWED_ORIGINS = new Set([
  "https://luzw6688-prog.github.io",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
]);

function response(origin: string, status: number, body: Record<string, unknown>) {
  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "vary": "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) headers["access-control-allow-origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function sanitizeRow(row: Record<string, unknown>) {
  const user = cleanText(row.user, 72);
  const date = row.date == null || row.date === "" ? null : new Date(String(row.date));
  return {
    question: cleanText(row.question, 1200),
    date: date && !Number.isNaN(date.getTime()) ? date.toISOString() : null,
    user: /^sha256:[a-f0-9]{64}$/.test(user) ? user : null,
    product: cleanText(row.product, 40) || "未知",
    platform: cleanText(row.platform, 80) || "未知",
    primary: cleanText(row.primary, 40) || "其他",
    secondary: cleanText(row.secondary, 60) || "无法判断",
    valid: row.valid === true,
  };
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") || "";
  if (request.method === "OPTIONS") {
    if (!ALLOWED_ORIGINS.has(origin)) return response(origin, 403, { error: "Origin not allowed" });
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-headers": "authorization, apikey, content-type",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-max-age": "86400",
        "vary": "Origin",
      },
    });
  }
  if (request.method !== "POST") return response(origin, 405, { error: "Method not allowed" });
  if (!ALLOWED_ORIGINS.has(origin)) return response(origin, 403, { error: "Origin not allowed" });

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return response(origin, 400, { error: "Invalid JSON" });
  }

  const suppliedHash = await sha256(cleanText(input.passcode, 200));
  if (!constantTimeEqual(suppliedHash, ADMIN_PASSCODE_SHA256)) return response(origin, 401, { error: "管理员发布口令不正确" });

  const action = input.action === "clear" ? "clear" : "publish";
  const rawDataset = input.dataset && typeof input.dataset === "object" ? input.dataset as Record<string, unknown> : {};
  const rawRows = Array.isArray(rawDataset.rows) ? rawDataset.rows : [];
  if (action === "publish" && rawRows.length === 0) return response(origin, 400, { error: "没有可发布的数据" });
  if (rawRows.length > 10000) return response(origin, 413, { error: "单次最多发布 10,000 条记录" });

  const rows = action === "clear" ? [] : rawRows.map(row => sanitizeRow((row && typeof row === "object" ? row : {}) as Record<string, unknown>));
  const publishedAt = new Date().toISOString();
  const payload = {
    version: 2,
    classifierVersion: Number(rawDataset.classifierVersion) || 1,
    savedAt: publishedAt,
    sourceName: action === "clear" ? "" : cleanText(rawDataset.sourceName, 255),
    total: action === "clear" ? 0 : Math.max(rows.length, Number(rawDataset.total) || rows.length),
    rows,
  };

  const databaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/dashboard_dataset?on_conflict=dataset_key`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      dataset_key: "main",
      source_name: payload.sourceName,
      record_count: rows.length,
      classifier_version: payload.classifierVersion,
      payload,
      published_at: publishedAt,
    }),
  });

  if (!databaseResponse.ok) {
    console.error("dashboard_dataset upsert failed", databaseResponse.status, await databaseResponse.text());
    return response(origin, 500, { error: "共享数据保存失败" });
  }
  return response(origin, 200, { ok: true, action, recordCount: rows.length, publishedAt });
});
