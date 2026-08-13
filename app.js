(function () {
  "use strict";

  const CATEGORY_RULES = [
    ["感情婚恋", [
      ["复合", /复合|复联|挽回|前任|前男友|前女友|重新在一起|重归于好/], ["对方想法", /(?:他|她|对方|[A-Za-z]).{0,10}(?:想法|怎么想|态度|心里|心意|感觉|喜欢|爱|在意)|喜欢我|爱我|想我|对我的感觉|对我的态度|对我.{0,4}(?:感觉|态度|心意)|这个人怎么样/], ["婚姻", /结婚|婚姻|离婚|夫妻|老公|老婆|丈夫|妻子|婚期/], ["桃花", /桃花|对象|脱单|姻缘|恋爱|恋情|相亲|正缘|伴侣/], ["联系互动", /(?:他|她|对方|[A-Za-z]{1,30}).{0,10}(?:联系|找我|回我|回复|回消息|主动|邀请|理我|疏远)|不回消息|断联|拉黑|删除好友|邀请我|不想理我/], ["关系走向", /感情|情感|恋爱关系|两人关系|我们的关系|我们接下来|我[与和跟].{0,12}(?:关系|情感|缘分|可能|未来)|缘分|在一起|分手|冷战|暧昧|第三者|出轨|异地恋|走下去|有结果|有未来|故事的结局|关系.{0,6}健康|健康地发展/]
    ]],
    ["事业工作", [
      ["求职录用", /面试|录用|offer|入职|入编|找到工作|求职|应聘|招聘|工作机会/], ["换工作", /换工作|跳槽|辞职|离职|转岗|调岗|职业方向|工作变动/], ["晋升加薪", /升职|晋升|加薪|提拔|转正|评职称|待遇/], ["创业", /创业|开公司|创办|合伙创业/], ["项目成败", /项目|工作.{0,8}(?:成|顺利|结果)|事业|职场|老板|领导|业绩|客户|订单|上班|活动|合作项目|机会.{0,8}(?:推进|进展)/]
    ]],
    ["财运财富", [
      ["投资", /投资|股票|基金|期货|币圈|理财|炒股|收益率/], ["副业", /副业|兼职|第二收入/], ["生意", /生意|赚钱|财运|收入|盈利|亏损|营收|客源|店铺/], ["合作", /商业合作|生意合作|合伙做生意|合伙投资/], ["回款", /回款|欠款|债务|借钱|还钱|收款|账款/]
    ]],
    ["综合运势", [["近期运势", /运势|近况|最近.{0,8}(?:顺|发展|如何)|近期.{0,8}(?:如何|怎样)|未来.{0,8}(?:如何|发展)/], ["年度流年", /流年|今年|明年|本年度|下半年|上半年/], ["人生方向", /人生|命运|方向|未来发展|迷茫|转运/]]],
    ["学业考试", [["考试结果", /考试|考过|通过|成绩|分数|上岸|录取|笔试|面试成绩/], ["升学", /升学|学校|大学|高中|中考|高考|小升初/], ["考研考公", /考研|考公|公务员|事业编|编制|研究生/], ["留学", /留学|出国读书|学校申请|签证学习/], ["专业选择", /专业|学业|选科|课程|论文|毕业/]]],
    ["人际关系", [["职场人际", /同事|领导|老板|上司|下属|职场关系/], ["朋友关系", /朋友|友情|闺蜜|兄弟|室友|同学关系/], ["贵人与小人", /贵人|小人|被人针对|背后使坏/], ["合作伙伴", /合作伙伴|伙伴|合伙人|搭档/]]],
    ["家庭子女", [["父母", /父母|爸爸|妈妈|父亲|母亲|家人|长辈|公婆|岳父|岳母/], ["子女", /孩子|子女|儿子|女儿|小孩|亲子/], ["生育", /怀孕|生育|备孕|宝宝|胎儿|生产/], ["家庭关系", /家庭|家里|亲戚|兄弟姐妹|婆媳|家庭关系/]]],
    ["健康状态", [["身体状态", /健康|身体|生病|疾病|医院|手术|康复|体检|病情|症状|疼痛|治疗|减肥|瘦身|瘦.{0,4}斤|体重|减重/], ["身心压力", /焦虑|抑郁|失眠|压力|情绪|心情|精神状态|内耗/]]],
    ["房产居住", [["买卖租赁", /买房|卖房|购房|房产|房子|租房|出租|房贷|过户/], ["装修搬迁", /装修|搬家|乔迁|入住|居住环境/]]],
    ["出行迁移", [["旅行出行", /旅行|旅游|出行|出差|行程|旅途|出门|去纽约|去raleigh|去SF|演唱会/], ["异地迁移", /移民|迁移|异地|定居|换城市|去外地|回老家|住在哪里/], ["出国签证", /出国|签证|海外|国外发展/]]],
    ["法律纠纷", [["诉讼仲裁", /官司|诉讼|起诉|仲裁|法院|判决|律师/], ["纠纷维权", /纠纷|维权|报警|赔偿|争议|被骗|诈骗/], ["合同争议", /合同纠纷|违约|解约|劳动仲裁/]]],
    ["时机选择", [["联系表白", /(?:何时|什么时候|现在|近期|最近|适合).{0,8}(?:联系|表白|主动)|联系.{0,6}(?:时机|合适)/], ["签约开业", /(?:何时|哪天|什么时候|适合).{0,8}(?:签约|开业|开店)/], ["搬家出行", /(?:何时|哪天|什么时候|近期|最近|适合).{0,8}(?:搬家|出行|旅行|出差)/], ["择日", /时机|什么时候|何时|哪天|吉日|择日/]]],
    ["具体事件", [["失物", /丢失|丢了|失物|找回|不见了|遗失/], ["消息进展", /有消息|收到消息|等消息|通知|回复|答复|进展|谈话结果|沟通结果/], ["事情成败", /能否办成|会不会成功|能不能成功|结果如何|结果会|事情.{0,6}(?:成|结果)|这件事|此事|能成吗|顺利吗/], ["交易结果", /交易|买卖|成交|合同.{0,6}(?:结果|顺利)/], ["失联", /失联|联系不上|找不到人|走失/]]],
    ["选择决策", [["两难选择", /还是|二选一|怎么选|如何选择|选哪个|怎么安排|如何安排|优先做|prioritize/], ["行动建议", /要不要|该不该|应不应该|是否应该|应该|是否值得|值不值得|是否适合/]]]
  ];
  const CATEGORY_PRIORITY = ["学业考试", "健康状态", "法律纠纷", "家庭子女", "感情婚恋", "人际关系", "事业工作", "财运财富", "房产居住", "出行迁移", "灵性指引", "具体事件", "时机选择", "综合运势", "选择决策"];
  const GENERIC_CATEGORIES = new Set(["具体事件", "时机选择", "综合运势", "选择决策"]);
  const PRIMARY_FALLBACK_RULES = [
    ["感情婚恋", "其他感情", /恋爱|感情|爱情|婚恋|姻缘|缘分|桃花|对象|伴侣|男朋友|女朋友|男友|女友|喜欢|暗恋|相亲|单身|夫妻|婚姻/],
    ["学业考试", "其他学业", /学习|学业|考试|学校|升学|成绩|毕业|论文|读书|录取|专业|考研|考公/],
    ["健康状态", "其他健康", /健康|身体|病|医院|医生|治疗|康复|手术|体检|睡眠|情绪|心理|精神|压力/],
    ["法律纠纷", "其他法律", /法律|官司|诉讼|仲裁|法院|律师|纠纷|维权|违约|赔偿|报警/],
    ["家庭子女", "其他家庭", /家庭|家人|父母|孩子|子女|亲戚|长辈|兄弟姐妹|婆媳/],
    ["人际关系", "其他人际", /人际|朋友|同事|同学|闺蜜|伙伴|合伙人|贵人|小人|相处|关系处理/],
    ["事业工作", "其他事业", /工作|事业|职业|公司|单位|岗位|职场|领导|老板|客户|项目|创业|就业|求职|生意经营/],
    ["财运财富", "其他财运", /钱|财富|财运|收入|工资|收益|亏损|投资|理财|债务|欠款|回款|赚钱|资金/],
    ["房产居住", "其他房产", /房|住宅|楼盘|租住|居住|装修|搬家|房贷|物业|新家/],
    ["出行迁移", "其他迁移", /出行|旅行|旅游|出差|出国|移民|异地|迁移|定居|外地/],
    ["综合运势", "综合咨询", /运势|命运|未来|以后|发展|走势|近况|顺不顺|转运/]
  ];
  const MULTILINGUAL_RULES = [
    ["感情婚恋", "关系走向", /男朋友|女朋友|男友|女友|恋人|情侣/iu, 6],
    ["感情婚恋", "关系走向", /关系.{0,8}健康|健康地.{0,6}(?:发展|相处)|健康的关系/iu, 6],
    ["感情婚恋", "复合", /\b(reconcil\w*|reconnect\w*|reunion|get back together|come back|win (?:him|her|them) back|ex(?:\s|-|$)|breakup|broke up)\b|復縁|復合|volver|reconcili|вернут|бывш/iu, 4],
    ["感情婚恋", "婚姻", /\b(marri\w*|husband|wife|spouse|wedding|divorc\w*)\b|結婚|離婚|casament|matrimoni|жен(?:а|иться)|муж/iu, 4],
    ["感情婚恋", "桃花", /\b(love life|find love|romance luck|life partner|soulmate|right partner|future partner|romantic partner|new love)\b|恋愛|恋人|愛情|amor|amore|pareja|любов|партнер/iu, 4],
    ["感情婚恋", "亲密吸引", /\b(romanti\w*|attract\w*|crush|dating|date\b|girlfriend|boyfriend|kiss\w*|sexual|sex\b|intimate|chemistry|lover|love me|in love|feelings for me)\b|好き|惹か|attratt|innamorat|atraíd|atraid|романтич|целова|секс/iu, 4],
    ["感情婚恋", "联系互动", /\b(contact me|reach out|reply|respond|response|text(?:ed)?|write me|message\w*|send\w*.{0,20}message|call(?:ed|ing)?|unread|ignor\w*|invite\w*|meet tonight|see .{0,18}tonight|ghost(?:ing|ed)?|blocked? me|unblock|no contact|apolog\w*|miss me|avoiding me|(?:hasn't|has not|not) responded|not responding|not answering|flake\w*|heart(?:ed)? my)\b|連絡|返信|contactar|responder|scriver|avvicin|написать|ответит|связаться/iu, 4],
    ["感情婚恋", "对方想法", /\b(?:how|howdoes|what|why)\s*(?:does|do|did|would|will|is|are|was|were|has|dos|oes)?\b.{0,60}\b(feel|feels|felt|feeling|feelings|fee+l|frel|think|thinks|thoughts?|view|views|perceive|want|react|treat|understand|communicat\w*|conflict\w*|appreciate|believe|anger|distance)\b|\bsee me as\b|\b(?:his|her|their) feelings\b|\b(?:thoughts?|feelings?|mind|intentions?|motives?|goal|plan|influence|desire|interest)\s+(?:of|about|with|toward|towards|regarding|on)\b|\b(?:think|thinks|thinking) (?:of|about) me\b|\b(?:on|in) (?:his|her) mind\b|\b(?:special|important) (?:man|woman|person)?\s*(?:to|for) (?:him|her|them)\b|\bwhat does (?:he|she|[a-z'-]+) want from me\b|\bdoes (?:he|she|this person|[a-z'-]+) (?:like|love|want|miss) me\b|cosa (?:prova|sente)|как.{0,30}(?:относит|чувств)|что.{0,25}(?:думает|чувствует)|загаданн.{0,20}человек/iu, 3],
    ["感情婚恋", "关系走向", /\b(relationsh\w*|relatonship|relatioship|relationsuo\w*|relation\b|connection|connnection|bond\b|bonds\b|together|between us|our future|future (?:with|between)|future holds between|future together|pursuit|talking stage|healthy (?:relationship|dynamic)|trajectory.{0,35}(?:relationship|relation|connection|bond|us)|where.{0,35}(?:relationship|relation|connection|bond).{0,25}going|invest\w* in (?:this|our|the) relationship)\b|関係|縁|relazione|relación|relação|relacionamento|отношен|связь/iu, 5],

    ["学业考试", "考试结果", /\b(exam\w*|test\b|tests\b|grade\w*|score\w*|pass(?:ed)? my|pathology|physiology|parasitology)\b|試験|テスト|成績|exame|prueba|esame|экзамен|оценк/iu, 5],
    ["学业考试", "升学", /\b(university|college|school admission|admitted (?:to|into|by) (?:a |the )?(?:university|college|school)|enroll\w*|dream university)\b|大学|学校|入学|universidade|universidad|университет/iu, 5],
    ["学业考试", "专业选择", /\b(thesis|dissertation|semester|course\b|class\b|education|academic|stud(?:y|ies|ying)|major\b|graduat\w*)\b|論文|学期|勉強|curso|estudio|tesi|учеб|диплом/iu, 4],

    ["健康状态", "身心压力", /\b(mental health|anxi\w*|depress\w*|stress\w*|suicid\w*|don[’']t wanna live|dont wanna live|fear\b|panic|burnout|insecure|unstable|tension|trauma)\b|メンタル|不安|うつ|ansiedad|ansiedade|depress|тревог|депресс|страх|напряж|менталь/iu, 5],
    ["健康状态", "身体状态", /\b(health|body|illness|disease|sick|chronic pain|physical pain|pain in|painful|ache|surgery|recover\w*|weight|lose weight|diet|medicine|doctor|hospital|addiction|insomnia|sleep problems?|can't sleep|cannot sleep)\b|健康|病気|体調|saúde|salud|malattia|здоров|тело|болезн/iu, 5],

    ["法律纠纷", "诉讼仲裁", /\b(lawsuit|court|legal|lawyer|attorney|arbitration|tribunal|case outcome)\b|裁判|訴訟|法律|processo|tribunale|суд(?:а|е|ом|ебн)|юрист/iu, 5],
    ["法律纠纷", "纠纷维权", /\b(refund|dispute|complaint|insurance claim|legal claim|file a claim|compensation|scam|fraud|consumer rights)\b|返金|詐欺|reembolso|estafa|мошенн|возврат/iu, 4],

    ["家庭子女", "父母", /\b(mother|father|mom\b|mum\b|dad\b|parents?|mother-in-law|father-in-law)\b|母親|父親|両親|madre|padre|mãe|pai|мать|отец|родител/iu, 5],
    ["家庭子女", "子女", /\b(child|children|son\b|daughter|kids?\b|parenting)\b|子供|息子|娘|hijo|filho|ребен|дети/iu, 5],
    ["家庭子女", "生育", /\b(pregnan\w*|fertility|conceive|baby\b|giving birth)\b|妊娠|出産|embaraz|grávid|беремен|родить/iu, 5],
    ["家庭子女", "家庭关系", /\b(family|relatives?|siblings?|brother|sister)\b|家族|家庭|familia|семь/iu, 4],

    ["人际关系", "朋友关系", /\b(friendship|best friend|my friend|friends? think|platonic|roommate)\b|朋友|闺蜜|友情|友達|amistad|amizade|дружб|подруг/iu, 5],
    ["人际关系", "职场人际", /\b(coworker|co-worker|colleague|manager|boss|supervisor|workplace relationship)\b|同僚|上司|colega|коллег|начальник/iu, 4],
    ["人际关系", "贵人与小人", /\b(trust|betray\w*|enemy|rival|jealous|gossip|supporter|mentor)\b|信頼|裏切|confian|traición|довер|предат/iu, 3],

    ["事业工作", "求职录用", /\b(job search|job opportunit\w*|find a job|new job|first job|employment|employer|interview|hiring|hired|job application|applying for the role|rejection|offer\b|sponsor ep|work visa)\b|就職|転職活動|面接|emprego|trabajo|colloquio|работ|ваканси|собеседован/iu, 5],
    ["事业工作", "换工作", /\b(change jobs?|switch jobs?|new role|move to a new role|career change|quit my job|leave (?:my|the) company|resign\w*|corporate job)\b|転職|退職|mudar de emprego|cambiar de trabajo|сменить работу|увол/iu, 5],
    ["事业工作", "晋升加薪", /\b(promotion|promoted|raise\b|salary increase|career advancement|advance at work)\b|昇進|昇給|promoción|promoção|повышен/iu, 5],
    ["事业工作", "创业", /\b(start (?:a |my )?(?:business|company|something of my own)|entrepreneur\w*|startup|self-employed|own business)\b|起業|開業|negócio próprio|创业|бизнес/iu, 5],
    ["事业工作", "项目成败", /\b(project|business|career|job\b|work\b|company|client|professional|exhibition|launch|release|production|role\b|contract|deal\b)\b|仕事|事業|projeto|proyecto|lavoro|карьер|проект/iu, 3],

    ["财运财富", "投资", /\b(investment|investor|investing|stock\w*|shares\b|fund\b|funds\b|crypto|market|trading|portfolio|powerball|lottery|ticket.{0,15}win)\b|投資|株|mercado|investimento|инвест|акци/iu, 5],
    ["财运财富", "生意", /\b(money|wealth|financial|financially|finances|income|salary|earnings|profit|loss|afford|rich|prosperity)\b|お金|金運|dinheiro|dinero|soldi|negócio|financeiro|деньг|финанс|богат/iu, 4],
    ["财运财富", "回款", /\b(debt|loan|repay|payment|paid|pay me|owe|cash flow)\b|借金|支払|dívida|deuda|долг|оплат/iu, 4],

    ["房产居住", "买卖租赁", /\b(buy (?:a )?(?:house|home)|sell (?:a |my )?(?:house|home)|property|real estate|rent\b|rental|mortgage)\b|住宅|不動産|aluguel|alquiler|недвижим|ипотек/iu, 5],
    ["房产居住", "装修搬迁", /\b(move house|moving house|new home|relocat\w*|move abroad|move to .{1,20}(?:city|country)|living situation)\b|引っ越し|転居|mudança|mudarse|переезд/iu, 5],

    ["出行迁移", "旅行出行", /\b(travel|trip\b|journey|vacation|holiday|flight|tour\b|visit .{1,20}(?:city|country))\b|旅行|旅|viagem|viaje|viaggio|путешеств/iu, 4],
    ["出行迁移", "出国签证", /\b(abroad|overseas|visa|immigra\w*|foreign country|homecountry)\b|海外|国外|visto|visado|эмигра|виза/iu, 4],

    ["灵性指引", "直觉能量", /\b(intuition|energies|energetic|energy (?:of|between|around|flow|gets|will|introduced)|universe|spiritual|soul purpose|life purpose|inner block|alignment|aligned|manifest\w*|aura|biofield|cosmic)\b|能量|直感|宇宙|エネルギー|intuição|intuición|energia|интуиц|энерги|биопол|душ|воплощ|реинкарнац|мисси/iu, 4],
    ["灵性指引", "梦境征兆", /\b(dream|dreamt|dreamed|omen|a sign|sign from|sign of|symboli[sz]e|meaning of seeing)\b|梦到|梦见|寓意|征兆|意味着什么|夢|夢占い|sonho|sueño|sogno|сон|знак/iu, 4],
    ["灵性指引", "卦象追问", /\b(i ching|oracle|hexagram|tarot|cards? (?:mean|reading)|reading for|what does it mean|ten of swords|pentacles|tower moment)\b|易経|卦|タロット|oráculo|tarocchi|оракул|таро/iu, 3],
    ["灵性指引", "人生课题", /\b(lesson|guidance|what do i need to (?:know|hear|understand)|what should i focus|my path|life path|talents? and gifts?|higher self)\b|導き|人生の課題|orientação|lección|lezione|урок|наставник|путь/iu, 3],

    ["综合运势", "近期运势", /\b(how will my day|how was my day|how will today|how will tomorrow|how will .{0,15}(?:week|month|year) go|outlook|general reading|collective reading|what (?:is|will be) in store|what to expect)\b|今日の運勢|今週|今月|fortuna|previsão|прогноз/iu, 3],
    ["综合运势", "人生方向", /\b(my future|future holds|life direction|where will i be|turn my life around|next chapter|opportunities coming)\b|将来|未来|futuro|будущ/iu, 3],

    ["选择决策", "行动建议", /\b(should (?:i|we|he|she|they)|is it better|would it be better|what should i do|what action should|how can i best|do i need to|is it wise|good idea|best way to|let go|move on)\b|べき|どうすれば|devo|debería|dovrei|стоит ли|что делать/iu, 2],
    ["时机选择", "择日", /\b(when will|when should|right time|best time|auspicious|timing|how soon|what day)\b|いつ|良い日|quando|cuándo|quando|когда/iu, 2],
    ["具体事件", "事情成败", /\b(successful|succeed|work out|move forward|go well|outcome|result|will happen|what happens|how will .{0,35} go|able to|possible|possibility|likely)\b|成功|結果|うまく|sucesso|resultado|éxito|успех|результат/iu, 2],
    ["具体事件", "日常活动", /\b(my|her|his|our|their) (?:day|night|evening|morning)|\b(today|tonight|tomorrow|yesterday)\b|\b(interaction|conversation|talk|meeting|event)\b/iu, 1],
    ["具体事件", "事实验证", /^(?:is|are|was|were|did|does|do|has|have|had|will|would|can|could)\b/iu, 1],
    ["具体事件", "其他具体问题", /^(?:what|how|why|where|who|which|when|if|am i)\b|[吗么？?]$/iu, 1]
  ];
  const META_INSTRUCTION_PATTERN = /\b(?:do not|don't|dont|not)\s+(?:hedge|reframe|coach|provide coaching|move (?:the )?goalposts?)\b|\banswer (?:the|my) question\b|\byes\s*\/\s*no (?:question|answer)\b|\binterpret (?:the )?oracle\b/iu;
  const CATEGORY_COLORS = ["#62e8ff", "#9d8cff", "#ffb86b", "#5da8ff", "#7ce7b6"];
  const MAX_ANALYSIS_ROWS = 50000;
  const CLASSIFIER_VERSION = 3;
  const STORAGE_DB_NAME = "wenxiang-question-dashboard";
  const STORAGE_STORE_NAME = "datasets";
  const STORAGE_RECORD_KEY = "active-dataset";
  const STORAGE_SCHEMA_VERSION = 1;
  const SUPABASE_URL = "https://reuzomfznynrzhwtmblv.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_q5EtMfCMg3aIhdNeDUKbig_4d_8YtAg";
  const SHARED_DATASET_URL = `${SUPABASE_URL}/rest/v1/dashboard_dataset?dataset_key=eq.main&select=payload,published_at,record_count`;
  const SHARED_PUBLISH_URL = `${SUPABASE_URL}/functions/v1/dashboard-data`;
  const SUBSCRIPTION_STATUSES = ["订阅用户", "订阅试用用户", "免费用户", "取消订阅用户", "订阅过期用户", "未知状态用户"];
  const aliases = {
    question: ["question_text", "question", "questioncontent", "content", "message", "query", "prompt", "用户提问", "提问内容", "问题内容", "问卦内容", "问题"],
    date: ["created_at", "createdat", "event_timestamp", "eventtimestamp", "event_time", "eventtime", "question_time", "questiontime", "timestamp", "datetime", "date", "time", "提问时间", "创建时间", "日期时间", "日期"],
    user: ["user_id", "userid", "anonymous_id", "anonymousid", "device_id", "deviceid", "uid", "用户id", "用户ID", "设备id", "用户"],
    product: ["product", "product_type", "producttype", "client", "client_type", "clienttype", "app_web", "appweb", "产品端", "客户端", "产品", "端"],
    platform: ["platform", "device_type", "devicetype", "operating_system", "operatingsystem", "os", "系统", "平台", "设备类型"],
    subscription: ["subscribed", "subscription_status", "subscriptionstatus", "subscription_state", "subscriptionstate", "subscriber_status", "subscriberstatus", "membership_status", "membershipstatus", "entitlement_status", "entitlementstatus", "billing_status", "billingstatus", "plan_status", "planstatus", "user_type", "usertype", "用户类型", "用户状态", "订阅状态", "会员状态", "付费状态", "套餐状态"]
  };
  const QUESTION_FIELD_BLOCKLIST = /(^|)(id|type|status|category|分类|标签)$/i;

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
    const value = String(text || "").trim().replace(/^["'“”‘’\s]+|["'“”‘’\s]+$/g, "").replace(/[復財運業學試醫買賣遷離職錢體關係會時麼]/g, char => ({ 復:"复", 財:"财", 運:"运", 業:"业", 學:"学", 試:"试", 醫:"医", 買:"买", 賣:"卖", 遷:"迁", 離:"离", 職:"职", 錢:"钱", 體:"体", 關:"关", 係:"系", 會:"会", 時:"时", 麼:"么" }[char]));
    if (!value || value.length < 3 || /^(?:test|测试|你好|您好|哈喽|hello|good|thanks?|thank you|wow.*|yes|no|yes or no|ty+|\d{3,}|(.)\1{4,}|gh+h+g)$/iu.test(value)) return { primary: "无效问题", secondary: "无效内容", valid: false };
    const candidates = [];
    for (const [primary, secondaryRules] of CATEGORY_RULES) {
      for (const [secondary, pattern] of secondaryRules) {
        if (pattern.test(value)) candidates.push({ primary, secondary, score: GENERIC_CATEGORIES.has(primary) ? 2 : 3 });
      }
    }
    for (const [primary, secondary, pattern] of PRIMARY_FALLBACK_RULES) {
      if (pattern.test(value)) candidates.push({ primary, secondary, score: 2 });
    }
    for (const [primary, secondary, pattern, score] of MULTILINGUAL_RULES) {
      if (pattern.test(value)) candidates.push({ primary, secondary, score });
    }
    if (META_INSTRUCTION_PATTERN.test(value) && !candidates.some(candidate => candidate.score >= 3)) {
      return { primary: "无效问题", secondary: "提示或解读要求", valid: false };
    }
    candidates.sort((a, b) => b.score - a.score || CATEGORY_PRIORITY.indexOf(a.primary) - CATEGORY_PRIORITY.indexOf(b.primary));
    if (!candidates.length) return { primary: "其他", secondary: "无法判断", valid: true };
    const { primary, secondary } = candidates[0];
    return { primary, secondary, valid: true };
  }
  function normalizeProduct(value, platform) {
    const text = `${value || ""} ${platform || ""}`.toLowerCase();
    if (/web|网页|网站|h5|browser/.test(text)) return "Web";
    if (/\bapp\b|ios|android|mobile|客户端|应用/.test(text)) return "App";
    return "未知";
  }
  function normalizeSubscriptionStatus(value) {
    const text = String(value ?? "").normalize("NFKC").trim().toLowerCase();
    if (!text || /^(?:unknown|undefined|null|n\/a|na|未知|不明|—|-)$/i.test(text)) return "未知状态用户";
    const canonical = text.replace(/[\s-]+/g, "_");
    if (["free_trial", "trial", "trialing", "in_trial"].includes(canonical) || /试用/.test(text)) return "订阅试用用户";
    if (["canceled", "cancelled", "unsubscribed", "will_cancel"].includes(canonical) || /已取消|取消订阅|退订/.test(text)) return "取消订阅用户";
    if (["expired", "past_due", "lapsed", "inactive", "overdue"].includes(canonical) || /已过期|订阅过期|失效|到期/.test(text)) return "订阅过期用户";
    if (["not_subscribed", "never_subscribed", "non_subscriber", "free", "basic"].includes(canonical) || /免费|未订阅|从未订阅|非订阅/.test(text)) return "免费用户";
    if (["active", "subscribed", "subscriber", "premium", "paid", "pro", "current"].includes(canonical) || /订阅用户|已订阅|会员|付费/.test(text)) return "订阅用户";
    return "未知状态用户";
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
    const subscriptionField = findField(row, "subscription");
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
      subscriptionStatus: normalizeSubscriptionStatus(row[subscriptionField]),
      ...classification
    };
  }

  let allData = [];
  let filteredData = [];
  let tableExpanded = false;
  const $ = id => document.getElementById(id);
  const fmt = new Intl.NumberFormat("zh-CN");
  const percent = (value, total) => total ? `${(value / total * 100).toFixed(1)}%` : "0%";
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function openStorage() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") { reject(new Error("当前浏览器不支持本地持久化存储")); return; }
      const request = indexedDB.open(STORAGE_DB_NAME, STORAGE_SCHEMA_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORAGE_STORE_NAME)) request.result.createObjectStore(STORAGE_STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("无法打开浏览器存储"));
    });
  }
  async function writeStoredDataset(payload) {
    const db = await openStorage();
    try {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORAGE_STORE_NAME, "readwrite");
        transaction.objectStore(STORAGE_STORE_NAME).put(payload, STORAGE_RECORD_KEY);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error("数据保存失败"));
        transaction.onabort = () => reject(transaction.error || new Error("数据保存被中止"));
      });
    } finally { db.close(); }
  }
  async function readStoredDataset() {
    const db = await openStorage();
    try {
      return await new Promise((resolve, reject) => {
        const request = db.transaction(STORAGE_STORE_NAME, "readonly").objectStore(STORAGE_STORE_NAME).get(STORAGE_RECORD_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error("数据读取失败"));
      });
    } finally { db.close(); }
  }
  async function deleteStoredDataset() {
    const db = await openStorage();
    try {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORAGE_STORE_NAME, "readwrite");
        transaction.objectStore(STORAGE_STORE_NAME).delete(STORAGE_RECORD_KEY);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error("数据清除失败"));
      });
    } finally { db.close(); }
  }
  function rehydrateStoredRows(rows) {
    return Array.isArray(rows) ? rows.map(item => ({ ...item, date: parseDateValue(item?.date), subscriptionStatus: normalizeSubscriptionStatus(item?.subscriptionStatus) })) : [];
  }
  function reclassifyStoredRows(rows) {
    return rehydrateStoredRows(rows).map(item => ({ ...item, ...classifyQuestion(item.question) }));
  }
  function cloudSharingAvailable() {
    return typeof location !== "undefined" && ["http:", "https:"].includes(location.protocol);
  }
  async function hashUserIdentifier(value) {
    if (!hasUsableUserId(value)) return null;
    if (!globalThis.crypto?.subtle) throw new Error("当前浏览器不支持用户 ID 脱敏");
    const bytes = new TextEncoder().encode(String(value).normalize("NFKC").trim());
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return `sha256:${Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")}`;
  }
  async function prepareSharedRows(rows) {
    const values = Array.isArray(rows) ? rows : [];
    const userHashes = new Map();
    await Promise.all([...new Set(values.map(item => item?.user).filter(hasUsableUserId))].map(async user => userHashes.set(user, await hashUserIdentifier(user))));
    return values.map(item => ({
      question: String(item?.question || "").slice(0, 1200),
      date: item?.date instanceof Date && !Number.isNaN(item.date.getTime()) ? item.date.toISOString() : parseDateValue(item?.date)?.toISOString?.() || null,
      user: userHashes.get(item?.user) || null,
      product: String(item?.product || "未知").slice(0, 40),
      platform: String(item?.platform || "未知").slice(0, 80),
      subscriptionStatus: normalizeSubscriptionStatus(item?.subscriptionStatus),
      primary: String(item?.primary || "其他").slice(0, 40),
      secondary: String(item?.secondary || "无法判断").slice(0, 60),
      valid: item?.valid === true,
    }));
  }
  async function readSharedDataset() {
    const response = await fetch(SHARED_DATASET_URL, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`共享数据读取失败（${response.status}）`);
    const [record] = await response.json();
    return record?.payload || null;
  }
  async function publishSharedDataset(dataset, passcode, action = "publish") {
    const response = await fetch(SHARED_PUBLISH_URL, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ action, passcode, dataset }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `共享数据发布失败（${response.status}）`);
    return result;
  }
  function resetControls() {
    tableExpanded = false;
    $("questionSearch").value = "";
    $("dateFilter").value = "30";
    $("productFilter").value = "all";
    $("categoryFilter").value = "all";
    setAllSubscriptionStatuses(true);
    updateFilterOptions();
    $("secondaryFilter").value = "all";
  }
  function showEmptyState(message = "共享看板暂未发布数据") {
    allData = [];
    resetControls();
    applyFilters();
    document.querySelector(".data-state").classList.remove("is-live");
    $("dataStateText").textContent = message;
    $("clearData").hidden = true;
  }
  async function restoreStoredDataset() {
    try {
      const stored = cloudSharingAvailable() ? await readSharedDataset() : await readStoredDataset();
      const classifierUpdated = stored?.classifierVersion !== CLASSIFIER_VERSION;
      const restored = classifierUpdated ? reclassifyStoredRows(stored?.rows) : rehydrateStoredRows(stored?.rows);
      if (!restored.length) { showEmptyState(); return; }
      if (classifierUpdated && !cloudSharingAvailable()) {
        await writeStoredDataset({ ...stored, classifierVersion: CLASSIFIER_VERSION, reclassifiedAt: new Date().toISOString(), rows: restored });
      }
      allData = restored;
      resetControls();
      applyFilters();
      document.querySelector(".data-state").classList.add("is-live");
      $("clearData").hidden = false;
      $("dataStateText").textContent = `${stored.sourceName || "共享数据"} · ${classifierUpdated ? "已按新版规则重新分类" : cloudSharingAvailable() ? "共享数据已同步" : "已从当前浏览器恢复"} · ${fmt.format(restored.length)} 条`;
    } catch (error) {
      if (cloudSharingAvailable()) {
        try {
          const cached = await readStoredDataset();
          const restored = rehydrateStoredRows(cached?.rows);
          if (restored.length) {
            allData = restored; resetControls(); applyFilters();
            document.querySelector(".data-state").classList.add("is-live");
            $("dataStateText").textContent = `共享连接失败 · 已显示本地缓存 ${fmt.format(restored.length)} 条`;
            $("clearData").hidden = false;
            return;
          }
        } catch (_) {}
      }
      showEmptyState(cloudSharingAvailable() ? "共享数据连接失败 · 请稍后刷新" : "未读取到本地数据 · 可重新上传");
    }
  }

  function validData(data) { return data.filter(item => item.valid); }
  function countBy(data, field) {
    return data.reduce((acc, item) => { const key = item[field] || "未知"; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  }
  function normalizeQuestionForRepeat(text) {
    return String(text || "").normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ").replace(/[。！？!?.,，；;:：]+$/g, "").trim();
  }
  function hasUsableUserId(value) {
    const normalized = String(value ?? "").normalize("NFKC").trim().toLowerCase();
    return Boolean(normalized) && !/^(?:unknown(?: visitor)?|anonymous|匿名|未知|无|暂无|—|-|null|undefined|n\/a|na)$/i.test(normalized);
  }
  function calculateRepeatQuestionMetrics(data) {
    const eligible = (Array.isArray(data) ? data : []).filter(item => item?.valid && hasUsableUserId(item.user) && normalizeQuestionForRepeat(item.question));
    const groups = new Map();
    for (const item of eligible) {
      const questionKey = normalizeQuestionForRepeat(item.question);
      const key = `${String(item.user)}\u0000${questionKey}`;
      const current = groups.get(key) || { user: String(item.user), count: 0 };
      current.count += 1;
      groups.set(key, current);
    }
    const repeatUsers = new Set();
    let repeatedQuestionCount = 0;
    let repeatedGroupCount = 0;
    for (const group of groups.values()) {
      if (group.count < 2) continue;
      repeatUsers.add(group.user);
      repeatedQuestionCount += group.count - 1;
      repeatedGroupCount += 1;
    }
    return { repeatUserCount: repeatUsers.size, repeatedQuestionCount, repeatedGroupCount, eligibleRecordCount: eligible.length };
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
  function getSelectedSubscriptionStatuses() {
    return new Set([...document.querySelectorAll('input[name="subscriptionStatus"]:checked')].map(input => input.value));
  }
  function setAllSubscriptionStatuses(checked) {
    document.querySelectorAll('input[name="subscriptionStatus"]').forEach(input => { input.checked = checked; });
    updateSubscriptionFilterSummary();
  }
  function updateSubscriptionFilterSummary() {
    const selected = getSelectedSubscriptionStatuses();
    const summary = selected.size === SUBSCRIPTION_STATUSES.length ? "全部状态" : selected.size === 1 ? [...selected][0] : `已选 ${selected.size} 项`;
    $("subscriptionFilterSummary").textContent = summary;
  }
  function setSubscriptionPopoverOpen(open) {
    const popover = $("subscriptionFilterPopover");
    popover.hidden = !open;
    $("subscriptionFilterButton").setAttribute("aria-expanded", String(open));
    $("subscriptionFilter").classList.toggle("is-open", open);
    document.querySelector(".filter-rail").classList.toggle("is-filter-open", open);
  }
  function filterBySubscriptionStatuses(data, statuses) {
    const selected = statuses instanceof Set ? statuses : new Set(statuses || []);
    return (Array.isArray(data) ? data : []).filter(item => selected.has(normalizeSubscriptionStatus(item?.subscriptionStatus)));
  }
  function applyFilters() {
    const days = $("dateFilter").value;
    const product = $("productFilter").value;
    const category = $("categoryFilter").value;
    const secondary = $("secondaryFilter").value;
    const subscriptionStatuses = getSelectedSubscriptionStatuses();
    const anchor = getDateAnchor(); const cutoff = new Date(anchor); if (days !== "all") cutoff.setDate(cutoff.getDate() - Number(days) + 1);
    filteredData = filterBySubscriptionStatuses(allData, subscriptionStatuses).filter(item => (days === "all" || (item.date && item.date >= cutoff && item.date < new Date(anchor.getTime() + 86400000))) && (product === "all" || item.product === product) && (category === "all" || item.primary === category) && (secondary === "all" || item.secondary === secondary));
    const subscriptionSummary = subscriptionStatuses.size === SUBSCRIPTION_STATUSES.length ? "全部用户状态" : subscriptionStatuses.size === 1 ? [...subscriptionStatuses][0] : `${subscriptionStatuses.size} 类用户状态`;
    const parts = [days === "all" ? "全部时间" : `最近 ${days} 天`, product === "all" ? "全部产品" : product, subscriptionSummary, category === "all" ? "全部类型" : category, secondary === "all" ? null : secondary].filter(Boolean);
    $("filterSummary").textContent = parts.join(" · ");
    renderAll();
  }

  function renderMetrics() {
    const valid = validData(filteredData);
    const knownUsers = valid.filter(item => hasUsableUserId(item.user));
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
  function renderRepeatInsight() {
    const metrics = calculateRepeatQuestionMetrics(filteredData);
    const validCount = validData(filteredData).length;
    const coverage = validCount ? metrics.eligibleRecordCount / validCount : 0;
    $("repeatUserCount").textContent = metrics.eligibleRecordCount ? fmt.format(metrics.repeatUserCount) : "—";
    $("repeatQuestionCount").textContent = metrics.eligibleRecordCount ? fmt.format(metrics.repeatedQuestionCount) : "—";
    $("repeatCoverage").textContent = metrics.eligibleRecordCount ? `用户 ID 可计算记录 ${fmt.format(metrics.eligibleRecordCount)} 条 · 覆盖 ${(coverage * 100).toFixed(1)}%` : "当前范围缺少可用用户 ID";
    $("repeatUserNote").textContent = metrics.repeatUserCount ? `${fmt.format(metrics.repeatedGroupCount)} 个“用户 × 问题”重复组合` : "当前范围未发现重复用户";
    $("repeatQuestionNote").textContent = "仅计算同一用户首次之后的记录";
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
    renderMetrics(); renderRepeatInsight(); renderVolumeTrend(); renderCategoryBars(); renderTopicTrend(); renderProductCompare(); renderSecondaryRanking(); renderTable();
    const dates = allData.map(item=>item.date).filter(Boolean).sort((a,b)=>b-a); $("freshnessText").textContent = !allData.length ? "等待上传数据" : dates[0] ? `数据最新时间 ${dates[0].toLocaleString("zh-CN",{month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}` : "未识别到有效时间字段";
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
      const selected = selectBestAnalysisSheet(workbook.SheetNames.map(sheetName => ({
        name: sheetName,
        rows: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName],{defval:"",raw:true}),
      })));
      if (!selected) throw new Error("Excel 中未找到包含提问字段的明细表");
      return selected.rows.map(row => ({...row,__sheet:selected.name}));
    }
    throw new Error("暂不支持该文件格式");
  }
  function limitAnalysisRows(rows) {
    return { rows: rows.slice(0, MAX_ANALYSIS_ROWS), total: rows.length, limited: rows.length > MAX_ANALYSIS_ROWS };
  }
  function selectBestAnalysisSheet(sheets) {
    const candidates = (Array.isArray(sheets) ? sheets : []).map(sheet => {
      const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
      const sample = rows.slice(0, 20);
      const hasField = field => sample.some(row => findField(row, field));
      const score = (hasField("user") ? 8 : 0) + (hasField("date") ? 3 : 0) + (hasField("product") ? 2 : 0) + (hasField("platform") ? 1 : 0);
      return { name: String(sheet?.name || ""), rows, hasQuestion: hasField("question"), score };
    }).filter(sheet => sheet.hasQuestion && sheet.rows.length);
    candidates.sort((a, b) => b.score - a.score || b.rows.length - a.rows.length);
    return candidates[0] || null;
  }
  async function handleFile(file) {
    if (!file) return;
    $("uploadError").textContent = ""; $("analysisProgress").hidden = false;
    const setProgress = (value,title,done=[]) => { $("progressBar").style.width=`${value}%`; $("progressPercent").textContent=`${value}%`; $("progressTitle").textContent=title; ["stepRead","stepClean","stepClassify"].forEach(id=>$(id).classList.toggle("is-done",done.includes(id))); };
    try {
      const passcode = $("adminPasscode").value.trim();
      if (cloudSharingAvailable() && !passcode) throw new Error("请输入管理员发布口令");
      setProgress(16,"正在读取文件"); const rows = await parseFile(file); if (!rows.length) throw new Error("文件中没有可读取的数据");
      const questionField = rows.slice(0,20).map(row => findField(row,"question")).find(Boolean); if (!questionField) throw new Error("未识别到提问内容字段，请使用 question_text、question、用户提问或提问内容");
      setProgress(42,`已识别 ${fmt.format(rows.length)} 条记录`,["stepRead"]); await new Promise(r=>setTimeout(r,280));
      setProgress(68,"正在清洗无效内容",["stepRead"]); await new Promise(r=>setTimeout(r,220));
      const analysisScope = limitAnalysisRows(rows);
      const analysisRows = analysisScope.rows;
      const normalized = analysisRows.map(normalizeRecord);
      setProgress(86,"正在完成问题分类",["stepRead","stepClean"]); await new Promise(r=>setTimeout(r,300));
      setProgress(94,cloudSharingAvailable() ? "正在发布到共享看板" : "正在保存到当前浏览器",["stepRead","stepClean"]);
      const sharedRows = await prepareSharedRows(normalized);
      const sharedPayload = { version: 2, classifierVersion: CLASSIFIER_VERSION, savedAt: new Date().toISOString(), sourceName: file.name, total: analysisScope.total, rows: sharedRows };
      if (cloudSharingAvailable()) await publishSharedDataset(sharedPayload, passcode);
      await writeStoredDataset(sharedPayload);
      allData = rehydrateStoredRows(sharedRows); resetControls(); applyFilters();
      setProgress(100,"分析完成，正在生成看板",["stepRead","stepClean","stepClassify"]); await new Promise(r=>setTimeout(r,450));
      $("adminPasscode").value = ""; closeModal(); document.querySelector(".data-state").classList.add("is-live"); $("clearData").hidden = false; const validCount = validData(sharedRows).length; const scopeText = analysisScope.limited ? `分析前 ${fmt.format(analysisRows.length)} / ${fmt.format(analysisScope.total)} 条` : `${fmt.format(analysisScope.total)} 条`; $("dataStateText").textContent=`${file.name} · ${scopeText} · 有效 ${percent(validCount,analysisRows.length)} · ${cloudSharingAvailable() ? "已发布共享" : "已保存本地"}`; window.scrollTo({top:document.querySelector(".overview-section").offsetTop-70,behavior:"smooth"});
    } catch (error) { $("uploadError").textContent = error.message || "文件解析失败"; setProgress(0,"分析未完成"); }
  }
  function openModal() { $("uploadModal").hidden=false; document.body.style.overflow="hidden"; $("analysisProgress").hidden=true; $("uploadError").textContent=""; $("fileInput").value=""; $("adminPasscodeField").hidden=!cloudSharingAvailable(); }
  function closeModal() { $("uploadModal").hidden=true; document.body.style.overflow=""; $("adminPasscode").value=""; }

  const dashboardApi = Object.freeze({ classifyQuestion, normalizeProduct, normalizeSubscriptionStatus, filterBySubscriptionStatuses, parseDateValue, parseCSV, parseFile, limitAnalysisRows, selectBestAnalysisSheet, normalizeRecord, findField, rehydrateStoredRows, reclassifyStoredRows, normalizeQuestionForRepeat, hasUsableUserId, calculateRepeatQuestionMetrics, hashUserIdentifier, prepareSharedRows, getState: () => ({ allData: [...allData], filteredData: [...filteredData] }) });
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
  $("subscriptionFilterButton").addEventListener("click",()=>setSubscriptionPopoverOpen($("subscriptionFilterPopover").hidden));
  document.querySelectorAll('input[name="subscriptionStatus"]').forEach(input=>input.addEventListener("change",event=>{const selected=getSelectedSubscriptionStatuses();if(!selected.size){event.target.checked=true;$("subscriptionFilterError").textContent="至少保留一个用户状态";return;}$("subscriptionFilterError").textContent="";updateSubscriptionFilterSummary();applyFilters();}));
  document.addEventListener("click",event=>{if(!$("subscriptionFilter").contains(event.target))setSubscriptionPopoverOpen(false);});
  $("resetFilters").addEventListener("click",()=>{$("dateFilter").value="30";$("productFilter").value="all";setAllSubscriptionStatuses(true);$("subscriptionFilterError").textContent="";$("categoryFilter").value="all";updateSecondaryOptions();$("secondaryFilter").value="all";$("questionSearch").value="";tableExpanded=false;applyFilters();});
  $("questionSearch").addEventListener("input",renderTable);
  $("showMore").addEventListener("click",()=>{tableExpanded=!tableExpanded;renderTable();});
  $("clearData").addEventListener("click",async()=>{
    if (!window.confirm(cloudSharingAvailable() ? "确定清除线上共享的全部提问数据吗？其他访问者也将看不到数据。" : "确定清除当前浏览器中保存的全部提问数据吗？")) return;
    try {
      if (cloudSharingAvailable()) {
        const passcode = window.prompt("请输入管理员发布口令以确认清除：") || "";
        if (!passcode) return;
        await publishSharedDataset({ rows: [], classifierVersion: CLASSIFIER_VERSION }, passcode, "clear");
      }
      await deleteStoredDataset(); showEmptyState(cloudSharingAvailable() ? "共享数据已清除 · 等待重新发布" : "已清除本地数据 · 等待重新上传");
    }
    catch (error) { $("dataStateText").textContent = error.message || "数据清除失败 · 请重试"; }
  });
  document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(!$("uploadModal").hidden)closeModal();if(!$("subscriptionFilterPopover").hidden){setSubscriptionPopoverOpen(false);$("subscriptionFilterButton").focus();}});

  restoreStoredDataset();
})();
