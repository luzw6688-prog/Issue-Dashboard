(function () {
  "use strict";

  const CATEGORY_RULES = [
    ["感情婚恋", [
      ["复合", /复合|前任|回来找我|重新在一起/], ["对方想法", /他.*想|她.*想|喜欢我|爱我|心里.*我|态度/], ["婚姻", /结婚|婚姻|离婚|夫妻|老公|老婆/], ["桃花", /桃花|对象|脱单|姻缘|恋爱/], ["关系走向", /感情|关系|缘分|在一起|分手|暧昧|第三者/]
    ]],
    ["事业工作", [
      ["求职录用", /面试|录用|offer|入职|找到工作|求职/], ["换工作", /换工作|跳槽|辞职|离职|职业方向/], ["晋升加薪", /升职|晋升|加薪|提拔/], ["创业", /创业|开公司/], ["项目成败", /项目|工作.*成|事业|职场|老板|领导/]
    ]],
    ["财运财富", [
      ["投资", /投资|股票|基金|币|理财/], ["副业", /副业|兼职/], ["生意", /生意|赚钱|财运|收入|盈利/], ["合作", /合伙|合作/], ["回款", /回款|欠款|债务|借钱/]
    ]],
    ["综合运势", [["近期运势", /运势|最近.*顺|近期.*如何|未来.*如何/], ["年度流年", /流年|今年|明年|年度/], ["人生方向", /人生|命运|方向|未来发展/]]],
    ["学业考试", [["考试结果", /考试|考过|通过|成绩|上岸/], ["升学", /升学|学校|大学|高中/], ["考研考公", /考研|考公|公务员|编制/], ["留学", /留学|出国读书/], ["专业选择", /专业|学业/]]],
    ["人际关系", [["职场人际", /同事|领导|老板/], ["朋友关系", /朋友|友情|闺蜜/], ["贵人与小人", /贵人|小人/], ["合作伙伴", /伙伴|合伙人/]]],
    ["家庭子女", [["父母", /父母|爸爸|妈妈|家人|长辈/], ["子女", /孩子|子女|儿子|女儿/], ["生育", /怀孕|生育|宝宝/], ["家庭关系", /家庭|家里/]]],
    ["健康状态", [["身体状态", /健康|身体|生病|疾病|医院|手术/], ["身心压力", /焦虑|抑郁|失眠|压力|情绪/]]],
    ["时机选择", [["联系表白", /联系|表白|主动/], ["签约开业", /签约|开业|开店/], ["搬家出行", /搬家|出行|旅行|出差/], ["择日", /时机|什么时候|哪天|择日/]]],
    ["具体事件", [["失物", /丢|失物|找回|不见了/], ["事情成败", /能否办成|会不会成功|结果如何|事情.*成/], ["交易结果", /交易|买房|卖房|合同/], ["失联", /失联|联系不上/]]]
  ];
  const CATEGORY_PRIORITY = ["感情婚恋", "学业考试", "健康状态", "人际关系", "家庭子女", "事业工作", "财运财富", "具体事件", "时机选择", "综合运势"];
  const CATEGORY_COLORS = ["#62e8ff", "#9d8cff", "#ffb86b", "#5da8ff", "#7ce7b6"];
  const MAX_ANALYSIS_ROWS = 50000;
  const aliases = {
    question: ["question_text", "question", "questioncontent", "content", "message", "query", "prompt", "用户提问", "提问内容", "问题内容", "问卦内容", "问题"],
    date: ["created_at", "createdat", "event_timestamp", "eventtimestamp", "event_time", "eventtime", "question_time", "questiontime", "timestamp", "datetime", "date", "time", "提问时间", "创建时间", "日期时间", "日期"],
    user: ["user_id", "userid", "anonymous_id", "anonymousid", "device_id", "deviceid", "uid", "用户id", "用户ID", "设备id", "用户"],
    product: ["product", "product_type", "producttype", "client", "client_type", "clienttype", "app_web", "appweb", "产品端", "客户端", "产品", "端"],
    platform: ["platform", "device_type", "devicetype", "operating_system", "operatingsystem", "os", "系统", "平台", "设备类型"]
  };
  const QUESTION_FIELD_BLOCKLIST = /(^|)(id|type|status|category|分类|标签)$/i;

  const sampleQuestions = [
    ["我和前任还有复合机会吗？", "App"], ["他现在心里还有我吗？", "App"], ["这段感情还值得继续吗？", "Web"], ["今年会遇到适合结婚的人吗？", "App"],
    ["最近适合换工作吗？", "Web"], ["下周的面试能拿到 offer 吗？", "App"], ["这个项目最后能不能做成？", "Web"], ["我应该辞职创业吗？", "Web"],
    ["现在开始做副业能赚到钱吗？", "App"], ["这笔投资是否值得继续？", "Web"], ["合作款这个月能回来吗？", "Web"], ["今年整体财运怎么样？", "App"],
    ["未来三个月整体运势如何？", "App"], ["今年下半年会顺利一些吗？", "Web"], ["我接下来的人生方向在哪里？", "Web"],
    ["这次公务员考试能上岸吗？", "App"], ["应该留学还是留在国内读研？", "Web"], ["孩子今年升学顺利吗？", "App"],
    ["领导最近是不是对我有意见？", "App"], ["这个合作伙伴值得信任吗？", "Web"], ["最近是否会遇到贵人？", "App"],
    ["妈妈最近身体状态怎么样？", "App"], ["最近压力很大，什么时候能缓过来？", "Web"],
    ["现在适合主动联系他吗？", "App"], ["这个月哪天适合签约？", "Web"], ["近期适合搬家吗？", "App"],
    ["丢失的戒指还能找回来吗？", "Web"], ["这次买房交易能顺利完成吗？", "Web"], ["联系不上的朋友还安全吗？", "App"]
  ];

  function makeDemoData() {
    const now = new Date();
    return Array.from({ length: 168 }, (_, index) => {
      const base = sampleQuestions[index % sampleQuestions.length];
      const dayOffset = (index * 7 + index % 5) % 30;
      const date = new Date(now); date.setDate(now.getDate() - dayOffset); date.setHours(8 + (index * 3) % 15, (index * 11) % 60, 0, 0);
      return normalizeRecord({ question_text: base[0], product: index % 6 === 0 ? (base[1] === "App" ? "Web" : "App") : base[1], platform: base[1] === "Web" ? "Web" : (index % 2 ? "iOS" : "Android"), user_id: `U${String(index % 91).padStart(4, "0")}`, created_at: date.toISOString() }, index);
    });
  }

  function normalizeKey(value) { return String(value || "").trim().toLowerCase().replace(/[\s_\-./（）()]/g, ""); }
  function findField(row, group) {
    const keys = Object.keys(row || {});
    const exact = keys.find(key => aliases[group].some(alias => normalizeKey(key) === normalizeKey(alias)));
    if (exact) return exact;
    return keys.find(key => {
      const normalized = normalizeKey(key);
      if (group === "question" && QUESTION_FIELD_BLOCKLIST.test(normalized.replace(/^question/, ""))) return false;
      return aliases[group].filter(alias => normalizeKey(alias).length >= 4).some(alias => normalized.includes(normalizeKey(alias)));
    });
  }
  function classifyQuestion(text) {
    const value = String(text || "").trim();
    if (!value || value.length < 3 || /^(test|测试|你好|您好|哈喽|hello|123+)$/i.test(value)) return { primary: "无效问题", secondary: "无效内容", valid: false };
    const candidates = [];
    for (const [primary, secondaryRules] of CATEGORY_RULES) {
      for (const [secondary, pattern] of secondaryRules) {
        if (pattern.test(value)) candidates.push({ primary, secondary, valid: true });
      }
    }
    candidates.sort((a, b) => CATEGORY_PRIORITY.indexOf(a.primary) - CATEGORY_PRIORITY.indexOf(b.primary));
    return candidates[0] || { primary: "其他", secondary: "无法判断", valid: true };
  }
  function normalizeProduct(value, platform) {
    const text = `${value || ""} ${platform || ""}`.toLowerCase();
    if (/web|网页|网站|h5|browser/.test(text)) return "Web";
    if (/\bapp\b|ios|android|mobile|客户端|应用/.test(text)) return "App";
    return "未知";
  }
  function parseDateValue(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (value == null || String(value).trim() === "") return null;
    if (typeof value === "number" && Number.isFinite(value)) {
      if (value > 20000 && value < 100000) return new Date(Math.round((value - 25569) * 86400 * 1000));
      if (value > 1e12) return new Date(value);
      if (value > 1e9) return new Date(value * 1000);
    }
    const raw = String(value).trim();
    const direct = new Date(raw);
    if (!Number.isNaN(direct.getTime())) return direct;
    const normalized = raw.replace(/[年/.]/g, "-").replace(/月/g, "-").replace(/日/g, "");
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  function normalizeRecord(row, index) {
    const qField = findField(row, "question");
    const dField = findField(row, "date");
    const uField = findField(row, "user");
    let pField = findField(row, "product");
    const platformField = findField(row, "platform");
    if (!pField) pField = Object.keys(row).find(key => ["source", "来源", "数据来源"].includes(normalizeKey(key)) && normalizeProduct(row[key], "") !== "未知");
    const question = String(row[qField] ?? "").trim();
    const classification = classifyQuestion(question);
    const parsedDate = parseDateValue(row[dField]);
    const platform = String(row[platformField] || "").trim() || "未知";
    const rawUser = uField == null ? "" : String(row[uField] ?? "").trim();
    return {
      id: `Q${Date.now()}-${index}`,
      question,
      date: parsedDate,
      user: rawUser || null,
      product: normalizeProduct(row[pField], platform),
      platform,
      ...classification
    };
  }

  let allData = makeDemoData();
  let filteredData = [];
  let tableExpanded = false;
  const $ = id => document.getElementById(id);
  const fmt = new Intl.NumberFormat("zh-CN");
  const percent = (value, total) => total ? `${(value / total * 100).toFixed(1)}%` : "0%";
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function validData(data) { return data.filter(item => item.valid); }
  function countBy(data, field) {
    return data.reduce((acc, item) => { const key = item[field] || "未知"; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  }
  function sortedEntries(object) { return Object.entries(object).sort((a, b) => b[1] - a[1]); }
  function dateKey(date) { return `${date.getMonth() + 1}/${date.getDate()}`; }
  function getDateAnchor() {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const dates = allData.map(item => item.date).filter(date => date instanceof Date && !Number.isNaN(date.getTime()) && date <= tomorrow).sort((a,b) => b-a);
    const anchor = dates[0] ? new Date(dates[0]) : new Date(); anchor.setHours(0,0,0,0); return anchor;
  }
  function lastNDays(n, anchor = getDateAnchor()) {
    const days = [];
    const end = new Date(anchor); end.setHours(0,0,0,0);
    for (let i = n - 1; i >= 0; i--) { const d = new Date(end); d.setDate(end.getDate() - i); days.push(d); }
    return days;
  }

  function updateFilterOptions() {
    const categories = sortedEntries(countBy(validData(allData), "primary")).map(([name]) => name);
    const selected = $("categoryFilter").value;
    $("categoryFilter").innerHTML = '<option value="all">全部类型</option>' + categories.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
    if (categories.includes(selected)) $("categoryFilter").value = selected;
    const products = [...new Set(allData.map(item => item.product))];
    const selectedProduct = $("productFilter").value;
    $("productFilter").innerHTML = '<option value="all">全部产品</option><option value="App">App</option><option value="Web">Web</option>' + (products.includes("未知") ? '<option value="未知">未知</option>' : '');
    if (["App", "Web", "未知"].includes(selectedProduct) && products.includes(selectedProduct)) $("productFilter").value = selectedProduct;
    updateSecondaryOptions();
  }
  function updateSecondaryOptions() {
    const category = $("categoryFilter").value;
    const source = validData(allData).filter(item => category === "all" || item.primary === category);
    const options = sortedEntries(countBy(source, "secondary")).map(([name]) => name);
    const selected = $("secondaryFilter").value;
    $("secondaryFilter").innerHTML = '<option value="all">全部场景</option>' + options.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
    if (options.includes(selected)) $("secondaryFilter").value = selected;
  }
  function applyFilters() {
    const days = $("dateFilter").value;
    const product = $("productFilter").value;
    const category = $("categoryFilter").value;
    const secondary = $("secondaryFilter").value;
    const anchor = getDateAnchor(); const cutoff = new Date(anchor); if (days !== "all") cutoff.setDate(cutoff.getDate() - Number(days) + 1);
    filteredData = allData.filter(item => (days === "all" || (item.date && item.date >= cutoff && item.date < new Date(anchor.getTime() + 86400000))) && (product === "all" || item.product === product) && (category === "all" || item.primary === category) && (secondary === "all" || item.secondary === secondary));
    const parts = [days === "all" ? "全部时间" : `最近 ${days} 天`, product === "all" ? "全部产品" : product, category === "all" ? "全部类型" : category, secondary === "all" ? null : secondary].filter(Boolean);
    $("filterSummary").textContent = parts.join(" · ");
    renderAll();
  }

  function renderMetrics() {
    const valid = validData(filteredData);
    const knownUsers = valid.filter(item => item.user);
    const users = new Set(knownUsers.map(item => item.user)).size;
    const categories = sortedEntries(countBy(valid, "primary"));
    const unclassified = valid.filter(item => item.primary === "其他").length;
    const userCoverage = valid.length ? knownUsers.length / valid.length : 0;
    const values = [
      ["有效提问数", fmt.format(valid.length), `筛选范围内原始记录 ${fmt.format(filteredData.length)} 条`, true],
      ["提问用户数", knownUsers.length ? fmt.format(users) : "—", knownUsers.length ? `用户 ID 覆盖 ${(userCoverage*100).toFixed(1)}%` : "文件未提供用户 ID"],
      ["一级类型数", fmt.format(categories.length), "当前筛选范围内"],
      ["最高热度类型", categories[0]?.[0] || "—", categories[0] ? `${categories[0][1]} 条 · ${percent(categories[0][1], valid.length)}` : "暂无数据"],
      ["无法分类率", percent(unclassified, valid.length), `归入“其他” ${fmt.format(unclassified)} 条`]
    ];
    $("metricGrid").innerHTML = values.map((item, index) => `<article class="metric-card ${item[3] ? "primary" : ""}" data-index="0${index + 1}" style="animation-delay:${index * 55}ms"><span class="metric-label">${item[0]}</span><strong class="metric-value">${item[1]}</strong><span class="metric-note">${item[2]}</span></article>`).join("");
  }

  function lineSvg(series, options = {}) {
    const width = 760, height = options.height || 270, pad = { l: 42, r: 14, t: 14, b: 30 };
    const rawMax = Math.max(1, ...series.flatMap(s => s.values));
    const step = Math.max(1, Math.ceil(rawMax / 4)); const max = step * 4;
    const pointsFor = values => values.map((value, index) => ({ x: pad.l + index * ((width - pad.l - pad.r) / Math.max(1, values.length - 1)), y: pad.t + (height - pad.t - pad.b) * (1 - value / max), value }));
    let svg = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(options.label || "趋势图")}"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#62e8ff" stop-opacity=".23"/><stop offset="1" stop-color="#62e8ff" stop-opacity="0"/></linearGradient></defs>`;
    for (let i = 0; i < 5; i++) { const y = pad.t + i * ((height-pad.t-pad.b)/4); const value = max - i * step; svg += `<line class="chart-grid" x1="${pad.l}" x2="${width-pad.r}" y1="${y}" y2="${y}"/><text class="chart-axis" x="0" y="${y+3}">${value}</text>`; }
    const labelEvery = Math.max(1, Math.ceil(options.labels.length / 7));
    options.labels.forEach((label, i) => { if (i % labelEvery === 0 || i === options.labels.length - 1) { const x = pad.l + i * ((width-pad.l-pad.r)/Math.max(1,options.labels.length-1)); svg += `<text class="chart-axis" text-anchor="middle" x="${x}" y="${height-6}">${escapeHtml(label)}</text>`; } });
    series.forEach((s, si) => { const points = pointsFor(s.values); const path = points.map((p,i) => `${i ? "L":"M"}${p.x},${p.y}`).join(" "); if (si === 0 && series.length === 1) { const area = `${path} L${points.at(-1)?.x || pad.l},${height-pad.b} L${points[0]?.x || pad.l},${height-pad.b} Z`; svg += `<path class="chart-area" d="${area}"/>`; } svg += `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="${si===0?2.5:2}" vector-effect="non-scaling-stroke"/>`; if (series.length === 1) points.forEach((p,i) => svg += `<circle class="chart-dot" cx="${p.x}" cy="${p.y}" r="3" data-point="${i}" data-value="${p.value}"/>`); });
    return svg + `</svg>`;
  }

  function renderVolumeTrend() {
    const selectedDays = Number($("dateFilter").value); const windowDays = selectedDays ? Math.min(selectedDays, 14) : 14;
    const days = lastNDays(windowDays);
    const valid = validData(filteredData);
    const values = days.map(day => valid.filter(item => item.date && item.date.toDateString() === day.toDateString()).length);
    const dateCoverage = valid.length ? valid.filter(item => item.date).length / valid.length : 0;
    document.querySelector(".trend-panel .legend").innerHTML = `<span><i class="legend-total"></i>近 ${windowDays} 日 · 日期覆盖 ${(dateCoverage*100).toFixed(0)}%</span>`;
    $("volumeTrend").innerHTML = lineSvg([{ values, color: "#62e8ff" }], { labels: days.map(dateKey), label: `最近${windowDays}天有效提问趋势` });
  }
  function renderCategoryBars() {
    const valid = validData(filteredData);
    const entries = sortedEntries(countBy(valid, "primary")).slice(0, 8);
    const max = entries[0]?.[1] || 1;
    $("categoryBars").innerHTML = entries.length ? entries.map(([name, count], i) => `<div class="bar-row"><span class="bar-name">${escapeHtml(name)}</span><span class="bar-track"><i class="bar-fill" style="width:${count/max*100}%;animation-delay:${i*45}ms"></i></span><span class="bar-value">${percent(count,valid.length)}</span></div>`).join("") : '<p class="empty-table">暂无数据</p>';
  }
  function renderTopicTrend() {
    const selectedDays = Number($("dateFilter").value); const windowDays = selectedDays ? Math.min(selectedDays, 10) : 10;
    const days = lastNDays(windowDays);
    const valid = validData(filteredData);
    const top = sortedEntries(countBy(valid,"primary")).slice(0,4).map(([name]) => name);
    const series = top.map((name, i) => ({ name, color: CATEGORY_COLORS[i], values: days.map(day => valid.filter(item => item.primary === name && item.date && item.date.toDateString() === day.toDateString()).length) }));
    $("topicLegend").innerHTML = series.map(s => `<span><i style="background:${s.color}"></i>${escapeHtml(s.name)}</span>`).join("");
    $("topicTrend").innerHTML = series.length ? lineSvg(series, { labels: days.map(dateKey), height: 240, label: "主要问题类型趋势" }) : '<p class="empty-table">暂无数据</p>';
  }
  function renderProductCompare() {
    if ($("productFilter").value !== "all") { $("productCompare").innerHTML = '<p class="empty-table">当前已筛选单一产品端<br>切换“全部产品”查看端间对比</p>'; return; }
    const valid = validData(filteredData);
    const app = valid.filter(item => item.product === "App"); const web = valid.filter(item => item.product === "Web");
    const knownProductData = [...app, ...web];
    const categories = sortedEntries(countBy(knownProductData,"primary")).slice(0,6).map(([name]) => name);
    $("productCompare").innerHTML = categories.length ? categories.map(name => { const a = app.filter(item=>item.primary===name).length/app.length*100 || 0; const w = web.filter(item=>item.primary===name).length/web.length*100 || 0; return `<div class="compare-row"><span class="compare-name">${escapeHtml(name)}</span><div class="compare-bars"><div class="compare-bar"><span>APP</span><span class="compare-track"><i class="compare-fill" style="width:${a}%"></i></span><b>${a.toFixed(0)}%</b></div><div class="compare-bar web"><span>WEB</span><span class="compare-track"><i class="compare-fill" style="width:${w}%"></i></span><b>${w.toFixed(0)}%</b></div></div></div>`; }).join("") : '<p class="empty-table">暂无数据</p>';
  }
  function renderSecondaryRanking() {
    const valid = validData(filteredData);
    const entries = sortedEntries(countBy(valid,"secondary")).slice(0,7);
    $("secondaryRanking").innerHTML = entries.length ? entries.map(([name,count],i) => `<li><span class="ranking-index">${String(i+1).padStart(2,"0")}</span><span class="ranking-name">${escapeHtml(name)}</span><span class="ranking-meta">${count} · ${percent(count,valid.length)}</span></li>`).join("") : '<li class="empty-table">暂无数据</li>';
  }
  function maskSensitive(text) { return String(text).replace(/1\d{10}/g, "1**********").replace(/\d{17}[\dXx]/g, "******************"); }
  function renderTable() {
    const query = $("questionSearch").value.trim().toLowerCase();
    const rows = validData(filteredData).filter(item => !query || item.question.toLowerCase().includes(query)).sort((a,b)=>(b.date?.getTime() || 0)-(a.date?.getTime() || 0));
    $("tableCount").textContent = `${fmt.format(rows.length)} 条`;
    const shown = tableExpanded ? rows.slice(0,50) : rows.slice(0,12);
    $("questionTable").innerHTML = shown.length ? shown.map(item => `<tr><td><span class="type-tag">${escapeHtml(item.primary)}</span></td><td><span class="secondary-tag">${escapeHtml(item.secondary)}</span></td><td class="question-cell">${escapeHtml(maskSensitive(item.question))}</td><td><span class="product-tag">${escapeHtml(item.product)}</span></td><td>${item.date ? item.date.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}) : "日期缺失"}</td></tr>`).join("") : '<tr><td colspan="5" class="empty-table">当前筛选条件下暂无问题</td></tr>';
    $("showMore").hidden = rows.length <= 12; $("showMore").textContent = tableExpanded ? "收起" : "展开更多";
  }
  function renderAll() {
    renderMetrics(); renderVolumeTrend(); renderCategoryBars(); renderTopicTrend(); renderProductCompare(); renderSecondaryRanking(); renderTable();
    const dates = allData.map(item=>item.date).filter(Boolean).sort((a,b)=>b-a); $("freshnessText").textContent = dates[0] ? `数据最新时间 ${dates[0].toLocaleString("zh-CN",{month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}` : "未识别到有效时间字段";
  }

  function parseCSV(text) {
    const rows = []; let row = []; let value = ""; let quoted = false;
    const source = String(text || "").replace(/^\uFEFF/, "");
    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      if (char === '"' && quoted && source[i + 1] === '"') { value += '"'; i += 1; }
      else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { row.push(value); value = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && source[i + 1] === "\n") i += 1; row.push(value); if (row.some(cell => String(cell).trim() !== "")) rows.push(row); row = []; value = ""; }
      else value += char;
    }
    row.push(value); if (row.some(cell => String(cell).trim() !== "")) rows.push(row);
    if (!rows.length) return [];
    const headers = rows.shift().map(header => String(header).trim());
    return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
  }

  async function parseFile(file) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "json") {
      const parsed = JSON.parse(await file.text());
      const arrays = Array.isArray(parsed) ? [parsed] : Object.values(parsed).filter(Array.isArray);
      const rows = arrays.filter(items => items.slice(0,20).some(row => row && typeof row === "object" && findField(row,"question"))).flat();
      if (!rows.length) throw new Error("JSON 中未找到包含提问字段的数据数组");
      return rows;
    }
    if (ext === "csv") {
      return parseCSV(await file.text());
    }
    if (["xlsx","xls"].includes(ext)) {
      if (!window.XLSX) throw new Error("Excel 解析组件尚未加载，请稍后重试或上传 CSV");
      const workbook = XLSX.read(await file.arrayBuffer(),{type:"array",cellDates:true});
      return workbook.SheetNames.flatMap(sheetName => {
        const sheetRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{defval:"",raw:true});
        const hasQuestionField = sheetRows.slice(0,20).some(row => findField(row,"question"));
        return hasQuestionField ? sheetRows.map(row => ({...row,__sheet:sheetName})) : [];
      });
    }
    throw new Error("暂不支持该文件格式");
  }
  function limitAnalysisRows(rows) {
    return { rows: rows.slice(0, MAX_ANALYSIS_ROWS), total: rows.length, limited: rows.length > MAX_ANALYSIS_ROWS };
  }
  async function handleFile(file) {
    if (!file) return;
    $("uploadError").textContent = ""; $("analysisProgress").hidden = false;
    const setProgress = (value,title,done=[]) => { $("progressBar").style.width=`${value}%`; $("progressPercent").textContent=`${value}%`; $("progressTitle").textContent=title; ["stepRead","stepClean","stepClassify"].forEach(id=>$(id).classList.toggle("is-done",done.includes(id))); };
    try {
      setProgress(16,"正在读取文件"); const rows = await parseFile(file); if (!rows.length) throw new Error("文件中没有可读取的数据");
      const questionField = rows.slice(0,20).map(row => findField(row,"question")).find(Boolean); if (!questionField) throw new Error("未识别到提问内容字段，请使用 question_text、question、用户提问或提问内容");
      setProgress(42,`已识别 ${fmt.format(rows.length)} 条记录`,["stepRead"]); await new Promise(r=>setTimeout(r,280));
      setProgress(68,"正在清洗无效内容",["stepRead"]); await new Promise(r=>setTimeout(r,220));
      const analysisScope = limitAnalysisRows(rows);
      const analysisRows = analysisScope.rows;
      const normalized = analysisRows.map(normalizeRecord);
      setProgress(88,"正在完成问题分类",["stepRead","stepClean"]); await new Promise(r=>setTimeout(r,360));
      allData = normalized; tableExpanded = false; $("questionSearch").value = ""; $("dateFilter").value = "30"; $("productFilter").value = "all"; $("categoryFilter").value = "all"; updateFilterOptions(); $("secondaryFilter").value = "all"; applyFilters();
      setProgress(100,"分析完成，正在生成看板",["stepRead","stepClean","stepClassify"]); await new Promise(r=>setTimeout(r,450));
      closeModal(); document.querySelector(".data-state").classList.add("is-live"); const validCount = validData(normalized).length; const scopeText = analysisScope.limited ? `分析前 ${fmt.format(analysisRows.length)} / ${fmt.format(analysisScope.total)} 条` : `${fmt.format(analysisScope.total)} 条`; $("dataStateText").textContent=`${file.name} · ${scopeText} · 有效 ${percent(validCount,analysisRows.length)}`; window.scrollTo({top:document.querySelector(".overview-section").offsetTop-70,behavior:"smooth"});
    } catch (error) { $("uploadError").textContent = error.message || "文件解析失败"; setProgress(0,"分析未完成"); }
  }
  function openModal() { $("uploadModal").hidden=false; document.body.style.overflow="hidden"; $("analysisProgress").hidden=true; $("uploadError").textContent=""; $("fileInput").value=""; }
  function closeModal() { $("uploadModal").hidden=true; document.body.style.overflow=""; }

  const dashboardApi = Object.freeze({ classifyQuestion, normalizeProduct, parseDateValue, parseCSV, parseFile, limitAnalysisRows, normalizeRecord, findField, getState: () => ({ allData: [...allData], filteredData: [...filteredData] }) });
  if (typeof module !== "undefined" && module.exports) { module.exports = dashboardApi; return; }
  window.QuestionDashboard = dashboardApi;

  $("openUpload").addEventListener("click",openModal);
  document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));
  $("fileInput").addEventListener("change",event=>handleFile(event.target.files[0]));
  $("dropZone").addEventListener("dragover",event=>{event.preventDefault();$("dropZone").classList.add("is-dragging");});
  $("dropZone").addEventListener("dragleave",()=>$("dropZone").classList.remove("is-dragging"));
  $("dropZone").addEventListener("drop",event=>{event.preventDefault();$("dropZone").classList.remove("is-dragging");handleFile(event.dataTransfer.files[0]);});
  $("categoryFilter").addEventListener("change",()=>{updateSecondaryOptions();applyFilters();});
  ["dateFilter","productFilter","secondaryFilter"].forEach(id=>$(id).addEventListener("change",applyFilters));
  $("resetFilters").addEventListener("click",()=>{$("dateFilter").value="30";$("productFilter").value="all";$("categoryFilter").value="all";updateSecondaryOptions();$("secondaryFilter").value="all";$("questionSearch").value="";tableExpanded=false;applyFilters();});
  $("questionSearch").addEventListener("input",renderTable);
  $("showMore").addEventListener("click",()=>{tableExpanded=!tableExpanded;renderTable();});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("uploadModal").hidden)closeModal();});

  updateFilterOptions(); applyFilters();
})();
