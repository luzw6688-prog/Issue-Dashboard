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

test("subscription statuses normalize into the six dashboard groups", () => {
  const cases = [
    ["active", "订阅用户"], ["paid", "订阅用户"],
    ["trialing", "订阅试用用户"], ["免费试用", "订阅试用用户"],
    ["free", "免费用户"], ["未订阅", "免费用户"],
    ["cancelled", "取消订阅用户"], ["取消订阅", "取消订阅用户"],
    ["expired", "订阅过期用户"], ["past_due", "订阅过期用户"],
    ["", "未知状态用户"], ["unexpected-state", "未知状态用户"],
  ];
  for (const [value, expected] of cases) assert.equal(api.normalizeSubscriptionStatus(value), expected, value);
});

test("subscription filter supports multiple selections", () => {
  const rows = [
    { subscriptionStatus: "订阅用户" },
    { subscriptionStatus: "免费用户" },
    { subscriptionStatus: "取消订阅用户" },
    {},
  ];
  assert.deepEqual(api.filterBySubscriptionStatuses(rows, new Set(["订阅用户", "免费用户"])), rows.slice(0, 2));
  assert.deepEqual(api.filterBySubscriptionStatuses(rows, ["未知状态用户"]), [rows[3]]);
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
  assert.equal(mapped.subscriptionStatus, "未知状态用户");
  assert.equal(mapped.primary, "事业工作");
});

test("record mapping reads common subscription status headers", () => {
  const mapped = api.normalizeRecord({ question: "最近工作顺利吗？", subscription_status: "trialing" }, 2);
  assert.equal(mapped.subscriptionStatus, "订阅试用用户");
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

test("expanded classifier covers common divination questions across domains", () => {
  const cases = [
    ["我和男朋友最近总冷战，还能继续吗？", "感情婚恋"],
    ["他还会主动联系我吗？", "感情婚恋"],
    ["我们两个人以后能走下去吗？", "感情婚恋"],
    ["单位这次会给我转正吗？", "事业工作"],
    ["最近跳槽到新公司是否合适？", "事业工作"],
    ["这个项目最后能顺利交付吗？", "事业工作"],
    ["今年工资收入能提高吗？", "财运财富"],
    ["欠我的钱什么时候可以收回来？", "财运财富"],
    ["投资这只基金会有收益吗？", "财运财富"],
    ["论文答辩能顺利通过吗？", "学业考试"],
    ["孩子这次高考能考好吗？", "学业考试"],
    ["婆媳关系什么时候能缓和？", "家庭子女"],
    ["这次体检结果会不会有问题？", "健康状态"],
    ["最近总是失眠，身体状态如何？", "健康状态"],
    ["这套房子今年能顺利过户吗？", "房产居住"],
    ["去国外发展是否适合我？", "出行迁移"],
    ["劳动仲裁结果对我有利吗？", "法律纠纷"],
    ["闺蜜为什么突然疏远我？", "人际关系"],
    ["未来半年整体发展怎么样？", "综合运势"],
    ["什么时候适合开店？", "时机选择"],
    ["丢失的证件还能找回来吗？", "具体事件"],
    ["这件事最后会有消息吗？", "具体事件"],
    ["A方案还是B方案，应该选哪个？", "选择决策"],
    ["今年財運會變好嗎？", "财运财富"],
  ];
  for (const [question, primary] of cases) {
    assert.equal(api.classifyQuestion(question).primary, primary, question);
  }
  const otherRate = cases.filter(([question]) => api.classifyQuestion(question).primary === "其他").length / cases.length;
  assert.ok(otherRate <= 0.05, `representative other rate was ${otherRate}`);
});

test("stored classifications can be recalculated without losing row metadata", () => {
  const [restored] = api.reclassifyStoredRows([{
    id: "Q-old-1",
    question: "他还会主动联系我吗？",
    date: "2026-08-05T10:30:00.000Z",
    product: "Web",
    primary: "其他",
    secondary: "无法判断",
    valid: true,
  }]);
  assert.equal(restored.id, "Q-old-1");
  assert.equal(restored.product, "Web");
  assert.equal(restored.date.toISOString(), "2026-08-05T10:30:00.000Z");
  assert.equal(restored.primary, "感情婚恋");
  assert.equal(restored.secondary, "联系互动");
});

test("classifier handles representative multilingual questions from the production export", () => {
  const cases = [
    ["how does she feel about me right now romantically", "感情婚恋", "亲密吸引"],
    ["What is the trajectory of our relationship", "感情婚恋", "关系走向"],
    ["when will Donaldo contact me", "感情婚恋", "联系互动"],
    ["i really wanna know if reconciliation with my ex is possible", "感情婚恋", "复合"],
    ["What are her thoughts of me like today", "感情婚恋", "对方想法"],
    ["Will I pass my pathology test tomorrow?", "学业考试", "考试结果"],
    ["Where will I be in my job search by next month?", "事业工作", "求职录用"],
    ["I bought a powerball ticket. Will I win the next drawing?", "财运财富", "投资"],
    ["Why have I been feeling anxious about the political situation?", "健康状态", "身心压力"],
    ["引っ越しは新しい機会につながるでしょうか？", "房产居住", "装修搬迁"],
    ["Cosa prova Gennaro per me?", "感情婚恋", "对方想法"],
    ["Каково реальное состояние моего ментального здоровья?", "健康状态", "身心压力"],
    ["what is my intuition trying to tell me?", "灵性指引", "直觉能量"],
    ["我梦到蛇了，意味着什么？", "灵性指引", "梦境征兆"],
    ["我这个月能减肥5斤吗", "健康状态", "身体状态"],
    ["我和Matthew八月的情感走向", "感情婚恋", "关系走向"],
    ["今天适合上班吗", "事业工作", "项目成败"],
    ["27年年底，我们住在哪里", "出行迁移", "异地迁移"],
    ["Should he move on", "选择决策", "行动建议"],
    ["\"What is the primary reason she hasn't responded?\"", "感情婚恋", "联系互动"],
  ];
  for (const [question, primary, secondary] of cases) {
    assert.deepEqual(api.classifyQuestion(question), { primary, secondary, valid: true }, question);
  }
});

test("prompt-control text and low-information repeated strings are not business topics", () => {
  assert.deepEqual(api.classifyQuestion("1111"), { primary: "无效问题", secondary: "无效内容", valid: false });
  assert.deepEqual(api.classifyQuestion("iiiiii"), { primary: "无效问题", secondary: "无效内容", valid: false });
  assert.deepEqual(api.classifyQuestion("Do not hedge. Answer the question."), { primary: "无效问题", secondary: "提示或解读要求", valid: false });
});

test("high-frequency words do not override their sentence context", () => {
  const cases = [
    ["what opportunities does the i ching see coming after the movie release", "事业工作"],
    ["What is the trajectory of our relationship if I sleep with other people", "感情婚恋"],
    ["does vince know his feelings and has he admitted it to himself", "感情婚恋"],
    ["should I sign on as a police officer?", "选择决策"],
    ["I brought her a Monster energy drink", "其他"],
    ["Can I trust this person with what I'm about to share?", "人际关系"],
    ["If I continue investing in this relationship, what do I gain?", "感情婚恋"],
    ["Какой главный урок из его судьбы?", "灵性指引"],
    ["我和A这段关系要健康地发展，需要什么态度？", "感情婚恋"],
    ["我今年能瘦40斤吗", "健康状态"],
  ];
  for (const [question, primary] of cases) {
    assert.equal(api.classifyQuestion(question).primary, primary, question);
  }
});

test("repeat-question metrics count users and only repeats after the first record", () => {
  const rows = [
    { user: "u1", question: "Will it work?", valid: true },
    { user: "u1", question: "  will it work  ", valid: true },
    { user: "u1", question: "A different question", valid: true },
    { user: "u2", question: "同一个问题？", valid: true },
    { user: "u2", question: "同一个问题", valid: true },
    { user: "u2", question: "同一个问题！", valid: true },
    { user: null, question: "Will it work?", valid: true },
    { user: "anonymous", question: "Will it work?", valid: true },
    { user: "u3", question: "Will it work?", valid: false },
  ];
  assert.deepEqual(api.calculateRepeatQuestionMetrics(rows), {
    repeatUserCount: 2,
    repeatedQuestionCount: 3,
    repeatedGroupCount: 2,
    eligibleRecordCount: 6,
  });
});

test("repeat-question metrics exclude placeholder user identifiers", () => {
  for (const value of [null, "", "unknown", "Unknown visitor", "anonymous", "未知", "—", "N/A"]) {
    assert.equal(api.hasUsableUserId(value), false, String(value));
  }
  assert.equal(api.hasUsableUserId("user-001"), true);
});

test("repeat normalization keeps semantic text while ignoring case, spacing and trailing punctuation", () => {
  assert.equal(api.normalizeQuestionForRepeat("  HOW   ARE YOU？！ "), "how are you");
  assert.notEqual(api.normalizeQuestionForRepeat("how are you"), api.normalizeQuestionForRepeat("how were you"));
});

test("shared rows remove source identifiers and hash user IDs", async () => {
  const [row] = await api.prepareSharedRows([{
    id: "raw-question-id",
    question: "Will it work?",
    date: new Date("2026-08-06T03:00:00.000Z"),
    user: "raw-user-123",
    product: "Web",
    platform: "browser",
    subscriptionStatus: "paid",
    primary: "具体事件",
    secondary: "事情成败",
    valid: true,
  }]);
  assert.equal("id" in row, false);
  assert.match(row.user, /^sha256:[a-f0-9]{64}$/);
  assert.notEqual(row.user, "raw-user-123");
  assert.equal(row.date, "2026-08-06T03:00:00.000Z");
  assert.equal(row.subscriptionStatus, "订阅用户");
});

test("Excel import selects one best analysis sheet instead of double-counting duplicate sheets", () => {
  const selected = api.selectBestAnalysisSheet([
    { name: "All Records", rows: [{ Question: "Q1", "Created At": "2026-08-06", Platform: "web" }, { Question: "Q2", "Created At": "2026-08-06", Platform: "web" }] },
    { name: "By User", rows: [{ "User ID": "u1", Question: "Q1", "Created At": "2026-08-06", Platform: "web" }, { "User ID": "u2", Question: "Q2", "Created At": "2026-08-06", Platform: "web" }] },
  ]);
  assert.equal(selected.name, "By User");
  assert.equal(selected.rows.length, 2);
});
