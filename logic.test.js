const test = require("node:test");
const assert = require("node:assert/strict");
const api = require("./app.js");

test("explicit topics take priority over generic time words", () => {
  const cases = [
    ["孩子今年升学顺利吗？", "学业考试", "升学"],
    ["妈妈最近身体状态怎么样？", "健康状态", "身体状态"],
    ["这个合作伙伴值得信任吗？", "人际关系", "合作伙伴"],
    ["今年整体财运怎么样？", "财运财富", "生意"],
    ["他现在心里还有我吗？", "感情婚恋", "对方想法"],
  ];
  for (const [question, primary, secondary] of cases) {
    assert.deepEqual(api.classifyQuestion(question), { primary, secondary, valid: true });
  }
});

test("invalid and unknown questions stay distinguishable", () => {
  assert.equal(api.classifyQuestion("test").valid, false);
  assert.equal(api.classifyQuestion("你好").primary, "无效问题");
  assert.equal(api.classifyQuestion("我想了解一件没有关键词的事情").primary, "其他");
});

test("product normalization never silently defaults unknown values to App", () => {
  assert.equal(api.normalizeProduct("H5", ""), "Web");
  assert.equal(api.normalizeProduct("", "Android"), "App");
  assert.equal(api.normalizeProduct("网页", ""), "Web");
  assert.equal(api.normalizeProduct("客户端", ""), "App");
  assert.equal(api.normalizeProduct("未知渠道", ""), "未知");
  assert.equal(api.normalizeProduct("", ""), "未知");
});

test("date parser handles missing, invalid, Excel serial and epoch values", () => {
  assert.equal(api.parseDateValue(""), null);
  assert.equal(api.parseDateValue("not-a-date"), null);
  assert.equal(api.parseDateValue("2026-08-05T00:00:00.000Z").toISOString(), "2026-08-05T00:00:00.000Z");
  assert.equal(api.parseDateValue("2026年08月05日 10:30").getFullYear(), 2026);
  assert.equal(api.parseDateValue(46204).getFullYear(), 2026);
  assert.equal(api.parseDateValue(1785916800).getFullYear(), 2026);
});

test("CSV parser preserves quoted commas, escaped quotes and embedded newlines", () => {
  const csv = 'question_text,product\n"问题有逗号，继续吗？",App\n"问题有换行\n继续吗？",Web\n"他说""再等等""",App';
  const rows = api.parseCSV(csv);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].question_text, "问题有逗号，继续吗？");
  assert.equal(rows[1].question_text, "问题有换行\n继续吗？");
  assert.equal(rows[2].question_text, '他说"再等等"');
});

test("field detection does not mistake question_id for question text", () => {
  assert.equal(api.findField({ question_id: "q1", created_at: "2026-01-01" }, "question"), undefined);
  assert.equal(api.findField({ question_id: "q1", question_text: "最近好吗" }, "question"), "question_text");
  assert.equal(api.findField({ event_timestamp: "2026-01-01" }, "date"), "event_timestamp");
});

test("record mapping keeps missing dates and users explicit", () => {
  const mapped = api.normalizeRecord({ question_text: "最近适合换工作吗？", product: "mystery" }, 1);
  assert.equal(mapped.date, null);
  assert.equal(mapped.user, null);
  assert.equal(mapped.product, "未知");
  assert.equal(mapped.primary, "事业工作");
});

test("JSON parsing merges only top-level arrays that contain question records", async () => {
  const payload = {
    app_questions: [{ question_text: "最近适合换工作吗？", product: "App" }],
    metadata: [{ name: "export", count: 1 }],
    web_questions: [{ question: "这段感情还值得继续吗？", product: "Web" }],
  };
  const rows = await api.parseFile({ name: "questions.json", text: async () => JSON.stringify(payload) });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].product, "App");
  assert.equal(rows[1].product, "Web");
});

test("large inputs have a deterministic and explicit analysis scope", () => {
  const source = Array.from({ length: 50002 }, (_, index) => ({ index }));
  const scope = api.limitAnalysisRows(source);
  assert.equal(scope.rows.length, 50000);
  assert.equal(scope.total, 50002);
  assert.equal(scope.limited, true);
  assert.equal(scope.rows.at(-1).index, 49999);
});

test("stored rows restore dates without changing missing values", () => {
  const restored = api.rehydrateStoredRows([
    { question: "最近适合换工作吗？", date: "2026-08-05T10:30:00.000Z" },
    { question: "这段感情还值得继续吗？", date: null },
  ]);
  assert.equal(restored[0].date.toISOString(), "2026-08-05T10:30:00.000Z");
  assert.equal(restored[1].date, null);
});
