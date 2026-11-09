/**
 * Steve Zim《6周打造好莱坞体态》(6 Weeks to a Hollywood Body)
 * 四维核心基石架构索引 (Theory Domains Architecture)
 * 围绕实操体系与心智系统两大板块重构
 */

import { CHAPTERS_DATA } from './chaptersData.js';

export const BOOK_META = {
    title: {
        zh: "6周打造好莱坞体态",
        en: "6 Weeks to a Hollywood Body"
    },
    subtitle: {
        zh: "好莱坞顶级明星私教的极简形体雕刻与减脂秘诀",
        en: "Look Fit and Feel Fabulous with the Secrets of the Stars"
    },
    authors: "Steve Zim & Mark Laska",
    publisher: "John Wiley & Sons, Inc.",
    year: "2006",
    coverImage: "/book-assets/cover.jpg",
    googleTalk: {
        title: {
            zh: "Talks at Google · 6周打造好莱坞体态",
            en: "Talks at Google: 6 Weeks to a Hollywood Body"
        },
        originalTitle: "6 Weeks to a Hollywood Body | Steve Zim | Talks at Google",
        location: "Google Santa Monica Office, CA",
        date: "2007-08-29",
        duration: "45 Min",
        videoUrl: "https://www.youtube.com/watch?v=aJRzBLTsNMQ",
        embedUrl: "https://www.youtube.com/embed/aJRzBLTsNMQ",
        videoId: "aJRzBLTsNMQ",
        summary: {
            zh: "好莱坞明星私教 **Steve Zim** 亲临 Google 加州圣莫尼卡研发中心（Authors@Google 演讲系列），向谷歌工程师与全球读者面对面拆解《**6周打造好莱坞体态**》的核心架构。深入阐述 **Hollywood Nutrition**（2:1 视觉餐盘与生化供能）、**Hollywood Heart**（靶心率精准燃脂）与 **Hollywood Sculpt**（零惯性与关节微调孤立雕刻）三大引擎，并现场演示纠正传统健身中的借力代偿与动作损伤。",
            en: "Celebrity fitness trainer **Steve Zim** visits Google's Santa Monica, CA office (Authors@Google series) to present *6 Weeks to a Hollywood Body*. He breaks down **Hollywood Nutrition** (2:1 visual plate & fuel timing), **Hollywood Heart** (Target Heart Rate cardio), and **Hollywood Sculpt** (zero-momentum joint isolation), followed by live demonstrations correcting common biomechanical compensations."
        },
        pillars: [
            {
                number: "01",
                name: "Hollywood Nutrition",
                badge: "2:1 视觉餐盘",
                title: { zh: "2:1 视觉餐盘与全天候生化供能", en: "2:1 Visual Plate & Metabolic Timing" },
                desc: {
                    zh: "复合碳水与精瘦蛋白严格以 2:1 配比，每 3 小时规律摄入，全天候平稳胰岛素与代谢引擎，拒绝盲目饥饿式节食。",
                    en: "Feed every 3 hours with 2 parts complex carbs to 1 part lean protein; stabilizes blood sugar and fuels fat oxidation without muscle wasting."
                }
            },
            {
                number: "02",
                name: "Hollywood Heart",
                badge: "靶心率心肺",
                title: { zh: "靶心率精准燃脂心肺", en: "Target Heart Rate Cardio" },
                desc: {
                    zh: "通过精准靶心率（THR）区间坡度快走氧化纯脂肪，告别伤膝盖的盲目长跑，守护深层瘦体重与关节韧带。",
                    en: "Target Heart Rate (THR) incline walking burns pure adipose tissue while protecting joints and preserving hard-earned lean mass."
                }
            },
            {
                number: "03",
                name: "Hollywood Sculpt",
                badge: "零惯性力学",
                title: { zh: "零惯性生物力学孤立雕刻", en: "Zero Momentum & Isolation" },
                desc: {
                    zh: "消除一切身体回弹与摆动借力，从静止死点启动，微调手腕与手肘夹角锁死协同肌代偿，使深层肌纤维承受 100% 机械张力。",
                    en: "Initiate every rep from a dead stop; subtle joint rotations lock secondary movers out, delivering 100% tension into target fibers."
                }
            }
        ],
        keyTopics: [
            {
                time: "00:00",
                seconds: 0,
                shortTitle: { zh: "迷思与真相", en: "Demystifying" },
                title: { zh: "明星身材特权迷思与真相", en: "Demystifying Celebrity Genetics" },
                desc: { zh: "好莱坞明星身材并非昂贵基因特权，而是精密生物力学与代谢科学的公式产物。", en: "Camera-ready aesthetics are the formulaic byproduct of biomechanics and metabolic timing." }
            },
            {
                time: "08:30",
                seconds: 510,
                shortTitle: { zh: "三大科学支柱", en: "Three Pillars" },
                title: { zh: "三大支柱：营养、心肺与雕刻", en: "Three Pillars: Nutrition, Heart & Sculpt" },
                desc: { zh: "每 3 小时摄入高阶复合碳水与精瘦蛋白，维持代谢引擎全天候高速运转；靶心率区间快走氧化纯脂肪。", en: "Fueling every 3 hours stabilizes blood sugar; target heart rate cardio preserves lean tissue while incinerating fat." }
            },
            {
                time: "17:45",
                seconds: 1065,
                shortTitle: { zh: "零惯性演示", en: "Isolation Demo" },
                title: { zh: "零惯性力学与动作孤立演示", en: "Zero Momentum & Isolation Demo" },
                desc: { zh: "消除任何摆动借力与回弹势能，手腕微旋锁死协同肌代偿，使深层高爆发 IIx 肌纤维承受 100% 张力。", en: "Dead-stop repetition starts and joint rotation physically lock secondary movers out of the movement chain." }
            },
            {
                time: "28:10",
                seconds: 1690,
                shortTitle: { zh: "三大体型自测", en: "Somatotypes" },
                title: { zh: "三大体型自测与破局方案", en: "Somatotype Diagnostics & Splits" },
                desc: { zh: "根据骨架腕围判定外胚/中胚/内胚体型，定制阶梯式组数、间歇与加餐配比。", en: "Deploying targeted training splits and meal timings matched to individual metabolic rate and bone structure." }
            },
            {
                time: "36:50",
                seconds: 2210,
                shortTitle: { zh: "脑力工作者答疑", en: "Tech Workers" },
                title: { zh: "高强度脑力工作者精力问答", en: "Q&A: Tech Worker Energy & Posture" },
                desc: { zh: "解答长时间伏案、久坐导致的骨盆前倾与圆肩驼背，如何在 30 分钟内完成高效形体唤醒。", en: "Actionable routines for sedentary engineers to reverse anterior pelvic tilt and rounded shoulders in 30 focused minutes." }
            }
        ]
    },
    pillars: [
        {
            id: "isolation",
            domainId: "domain-biomechanics",
            badge: "BIOMECHANICS 01",
            icon: "ri-focus-3-line",
            title: {
                zh: "绝对肌肉孤立与零惯性力学",
                en: "Absolute Muscle Isolation & Zero Momentum"
            },
            desc: {
                zh: "消除惯性借力，从静止启动，封锁辅助肌群代偿，把张力100%轰击在目标肌纤维上。",
                en: "Zero momentum from a dead stop. Lock secondary movers out to deliver 100% mechanical tension to target fibers."
            },
            axiom: {
                zh: "从静止起步，消灭所有回弹势能与借力，张力 100% 轰击目标肌纤维。",
                en: "Initiate every repetition from a dead stop. Eliminate stretch reflex and momentum so 100% of tension lands on target fibers."
            },
            mechanism: {
                zh: "传统健美常见身体晃动借力，实际是将负荷转移到了肌腱、关节韧带与辅助协同肌群（如二头弯举借力三角肌前束与下背）。Steve Zim 通过调整发力角度、手腕与手肘微倾角，关闭辅助肌群神经传导通路，实现针对深层 IIx 型高爆发肌纤维的绝对孤立。",
                en: "Conventional lifting uses body sway, dumping load onto connective tissues and dominant secondary movers. Steve Zim modifies joint angles and wrist tilts to physically lock auxiliary movers out, isolating deep Type-IIx fast-twitch fibers."
            },
            formula: {
                zh: "起步停顿 1 秒 + 手腕关节微旋锁死协同肌 + 关节严禁锁死 (Unlock at Peak)",
                en: "1s Dead Stop Reset + Scapular/Wrist Mechanical Anchoring + No Joint Lockout"
            },
            fatalError: {
                zh: "用大重量摆动起步，欺骗自己以为力量增长，实则磨损关节而目标肌肉未被充分募集。",
                en: "Swinging heavier dumbbells with momentum, straining joints while the target muscle remains under-stimulated."
            }
        },
        {
            id: "tempo",
            domainId: "domain-biomechanics",
            badge: "TEMPO ARCHITECTURE",
            icon: "ri-timer-line",
            title: {
                zh: "4-2-2-1 受张时间与神经肌肉控制",
                en: "4-2-2-1 Time Under Tension Protocol"
            },
            desc: {
                zh: "严格执行 4-2-2-1 节奏：极慢离心 4 秒，顶峰强力挤压 2 秒，绝不锁死关节破坏张力。",
                en: "Strict 4-2-2-1 tempo: 4s eccentric descent, 2s peak squeeze, without locking joints at full range."
            },
            axiom: {
                zh: "控制速度胜过增加重量。4 秒离心下落释放深层微损伤刺激信号。",
                en: "Velocity control supersedes weight. 4s eccentric descent triggers high-yield micro-damage hypertrophic signaling."
            },
            mechanism: {
                zh: "向心阶段（推/拉起）只完成做功的一半，离心阶段（下落）才是诱导肌原纤维深层微损伤与肌肥大生化信号的关键。4 秒慢速离心配合 2 秒顶峰等长收缩，彻底破坏弹性能量利用，让单组受张时间达到 45~60 秒的黄金增肌窗口。",
                en: "The concentric lift is only half the work. The 4s eccentric descent maximizes mechanical strain on titin and actin-myosin filaments without requiring joint-crushing weights, sustaining optimal 45-60s set duration."
            },
            formula: {
                zh: "4秒离心（下落）- 2秒顶峰收缩（强力挤压）- 2秒向心（启动）- 1秒底部静止（归零）",
                en: "4s Eccentric - 2s Peak Squeeze - 2s Concentric - 1s Dead Stop Pause"
            },
            fatalError: {
                zh: "快速上下自由落体（1秒砸下1秒推起），不仅破坏肌张力，而且给韧带施加危险剪切力。",
                en: "Free-falling weights (1s down, 1s up), completely wasting the muscle-building negative phase and stressing tendons."
            }
        },
        {
            id: "nutrition",
            domainId: "domain-metabolism",
            badge: "METABOLIC NUTRITION",
            icon: "ri-restaurant-line",
            title: {
                zh: "2:1 视觉餐盘与 3 小时代谢供能",
                en: "2:1 Visual Plate & 3-Hour Metabolic Pacing"
            },
            desc: {
                zh: "基于瘦体重的蛋白质预算，主次蛋白质与碳水 2:1 / 1:1 搭配，每3小时进餐维持稳定代谢。",
                en: "LBM-based protein intake, 2:1 & 1:1 carb-protein plate logic, feeding every 3 hours to fuel metabolism."
            },
            axiom: {
                zh: "智胜身体饥饿自保机制。用瘦体重预算蛋白质，每 3 小时稳定进餐。",
                en: "Outthink your body's starvation reflex. Budget protein from LBM and feed every 3 hours."
            },
            mechanism: {
                zh: "当卡路里断崖式削减或两餐间隔超过 4~5 小时，甲状腺素分泌受抑，身体启动古老饥荒自保机制，优先分解肌肉并固化脂肪。每 3 小时摄入优质蛋白质与主要碳水，能向大脑持续释放安全信号，维持全天候高代谢率与平稳胰岛素波动。",
                en: "Prolonged gaps between meals suppress thyroid output and trigger muscle catabolism to hoard fat. Eating every 3 hours keeps blood glucose level, curbs ghrelin spikes, and sustains non-stop mitochondrial thermogenesis."
            },
            formula: {
                zh: "2:1 餐盘（2份蔬菜:1份主要蛋白）+ 瘦体重(LBM)×1.0~1.25g 蛋白质 + 每日饮水=体重(磅)÷2(盎司)",
                en: "2:1 Plate (2 Veg:1 Protein) + LBM × 1.0-1.25g Protein + Daily Water = Weight(lbs) / 2 (oz)"
            },
            fatalError: {
                zh: "节食少吃甚至绝食，体重秤数字下降但全是水分和肌肉，代谢暴跌，一旦正常饮食迅速报复性暴肥。",
                en: "Crash dieting down to near starvation, losing precious lean muscle while ruining basal metabolic rate."
            }
        },
        {
            id: "bodytypes",
            domainId: "domain-somatotypes",
            badge: "SOMATOTYPE BLUEPRINT",
            icon: "ri-body-scan-line",
            title: {
                zh: "三大体型解剖学分化与专属重塑",
                en: "Somatotype Specialization Protocols"
            },
            desc: {
                zh: "外胚型（增肌抗阻）、中胚型（超组雕刻）、内胚型（高密燃脂），量体裁衣拒绝千篇一律。",
                en: "Customized protocols for Ectomorph (mass), Mesomorph (definition), and Endomorph (fat burn)."
            },
            axiom: {
                zh: "拒绝一刀切套路。根据骨架骨径与代谢基因定制有氧上限与超级组矩阵。",
                en: "Reject one-size-fits-all routines. Calibrate cardio limits and supersets based on bone structure and metabolism."
            },
            mechanism: {
                zh: "外胚型（Ectomorph）代谢极高、肌糖原易耗尽，必须严格限制有氧（每周≤2次），依靠大重量复合动作锁住卡路里；中胚型（Mesomorph）对机械张力极其敏感，采用高密度超级组雕刻分离度；内胚型（Endomorph）胰岛素敏感性偏低，必须执行 30 秒极短间歇巨型组与高频坡度心肺。",
                en: "Ectomorphs burn calories rapidly and must strictly cap cardio to avoid muscle wasting; Mesomorphs thrive on high-tension supersets; Endomorphs suffer lower insulin sensitivity and demand 30s rest metabolic giant sets."
            },
            formula: {
                zh: "外胚型（限制心肺+1:1配餐）/ 中胚型（超级组+2:1配餐）/ 内胚型（30秒间歇巨型组+坡度走）",
                en: "Ectomorph (Low Cardio + 1:1 Plate) / Mesomorph (Supersets + 2:1 Plate) / Endomorph (Giant Sets + 30s Rest)"
            },
            fatalError: {
                zh: "外胚型瘦人盲目跟风天天长跑导致更干瘪；内胚型肥胖人群只做大重量低次数导致体脂居高不下。",
                en: "Ectomorphs running miles every day getting stringy; Endomorphs lifting heavy with long rests staying soft."
            }
        },
        {
            id: "mindset",
            domainId: "domain-longevity",
            badge: "IDENTITY & LONGEVITY",
            icon: "ri-mental-health-line",
            title: {
                zh: "好莱坞心智固化与终生维持",
                en: "Identity Architecture & Lifelong Maintenance"
            },
            desc: {
                zh: "告别短期节食与过度疲劳，30分钟高效爆发，将健康生活方式固化为终身身份认同。",
                en: "Move beyond starvation and overtraining. High-efficiency 30-min workouts built into lifelong identity."
            },
            axiom: {
                zh: "摆脱单纯依靠体重秤的误区，以衣物合身度与身体状态作为客观衡量标准。",
                en: "Abandon the scale's tyranny. Anchor your transformation into wardrobe milestones and lifetime identity."
            },
            mechanism: {
                zh: "体态雕刻不是为期 6 周的短期苦役，而是对自我神经递质与生活秩序的重新夺权。通过建立衣物尺码里程碑（如裤腰松动），以及彻底捐赠淘汰旧的大码衣服，在潜意识中切断妥协退路，将 30 分钟高效自律固化为永不反弹的自然习惯。",
                en: "Physical transformation is not a 6-week prison sentence; it is reprogramming your subconscious identity. Using wardrobe fit rather than deceptive bathroom scales, and purging oversized clothes, permanently cements your new reality."
            },
            formula: {
                zh: "以腰围/衣码为唯一度量衡 + 捐赠旧衣服心理仪式 + 90/10 长期维持课表",
                en: "Wardrobe Fit as Primary Metric + Purging Old Clothes Ritual + 90/10 Lifetime Routine"
            },
            fatalError: {
                zh: "天天紧盯体重秤数字，因经期或饮水引起的 1~2 斤正常波动产生心理焦虑而中途放弃。",
                en: "Obsessing over daily water weight fluctuations on the scale and spiraling into emotional quitting."
            }
        }
    ]
};

export const THEORY_DOMAINS = [
    // PART 1: 实操体系 (EXECUTION SYSTEM)
    {
        id: "domain-biomechanics",
        part: "execute",
        domainNumber: 1,
        badge: "DOMAIN 01",
        icon: "ri-compass-3-line",
        title: {
            zh: "认知与生物力学",
            en: "Biomechanics & Architecture"
        },
        subtitle: {
            zh: "破除明星神话、30分钟正向成瘾、体态铁三角几何学与 7 大生物力学定律",
            en: "Demystifying Genetics, Positive Addiction, V-Taper Geometry & 7 Biomechanical Laws"
        },
        category: {
            zh: "实操体系 · 生物力学",
            en: "Execution · Physics"
        },
        readTime: {
            zh: "12 分钟",
            en: "12 min read"
        },
        provenance: {
            zh: "整合原著：引言、第 1 章、第 2 章、第 5 章",
            en: "Consolidated from Intro, Chapter 1, Chapter 2 & Chapter 5"
        },
        highlights: {
            zh: "打破局部减脂神话、男女核心肌群审美优先级、消除惯性借力、4-2-2-1 受张时间、7 大生物力学定律、装备采购清单。",
            en: "The spot toning myth, aesthetic hierarchy, zero momentum, 4-2-2-1 TUT, 7 Biomechanical Laws & essential gear."
        }
    },
    {
        id: "domain-metabolism",
        part: "execute",
        domainNumber: 2,
        badge: "DOMAIN 02",
        icon: "ri-fire-line",
        title: {
            zh: "能量代谢与饮食全案",
            en: "Fuel, Metabolism & Diets"
        },
        subtitle: {
            zh: "视觉餐盘黄金法则、主次食材清单、外胚与内胚体型定制饮食战术、细胞水合与靶心率有氧",
            en: "2:1 Visual Plate, Food Lists, Somatotype Diets, Hydration & Target Heart Rate Cardio"
        },
        category: {
            zh: "实操体系 · 营养代谢",
            en: "Execution · Nutrition & Fuel"
        },
        readTime: {
            zh: "12 分钟",
            en: "12 min read"
        },
        provenance: {
            zh: "整合原著：第 3 章（营养原则）、第 4 章（心肺原则）、第 8 章（外胚饮食）、第 10 章（内胚饮食）",
            en: "Consolidated from Chapter 3, Chapter 4, Chapter 8 & Chapter 10"
        },
        highlights: {
            zh: "2:1 与 1:1 视觉餐盘（配图 page39.jpg）、主要 vs 次要食物清单、避坑食物黑名单、外胚型高频加餐抗分解营养、内胚型纯绿叶胰岛素重置战术、靶心率 (THR) 数学计算、五大心肺器械指南。",
            en: "2:1 & 1:1 plate diagrams (page39.jpg), food classification table, water hydration formula, Ectomorph anti-catabolic feeding, Endomorph pure-green insulin reset, THR calculation math, and 5 cardio machines."
        }
    },
    {
        id: "domain-somatotypes",
        part: "execute",
        domainNumber: 3,
        badge: "DOMAIN 03",
        icon: "ri-body-scan-line",
        title: {
            zh: "体型自测与定制课表",
            en: "Somatotype Diagnosis & Custom Schedules"
        },
        subtitle: {
            zh: "手腕骨架自测诊断、男女启动期分化课表、外胚/中胚/内胚专属 4 周进阶雕刻方案",
            en: "Wrist Test Diagnostics, Weeks 1-2 Initiation Splits & 4-Week Custom Somatotype Routes"
        },
        category: {
            zh: "实操体系 · 体型方案",
            en: "Execution · Somatotype Routes"
        },
        readTime: {
            zh: "12 分钟",
            en: "12 min read"
        },
        provenance: {
            zh: "整合原著：第 6 章（启动期课表）、第 7 章（体型自测）、第 8 章（外胚方案）、第 9 章（中胚方案）、第 10 章（内胚方案）",
            en: "Consolidated from Chapter 6 (Initiation), Chapter 7 (Somatotype Test), Chapter 8, Chapter 9 & Chapter 10"
        },
        highlights: {
            zh: "手腕骨突自测法精准测定外胚/中胚/内胚、混合体型研判技巧、前两周男女启动期分化课表、外胚型增肌抗阻方案、中胚型倒三角分离度超级组、内胚型 30 秒高密燃脂矩阵。",
            en: "Wrist wrap test for Ecto/Meso/Endo, mixed somatotype calibration, Weeks 1-2 Initiation splits, Ectomorph mass plan, Mesomorph V-taper supersets, and Endomorph 30s fat-burning matrix."
        }
    },
    {
        id: "domain-exercises",
        part: "execute",
        domainNumber: 4,
        badge: "DOMAIN 04",
        icon: "ri-boxing-line",
        title: {
            zh: "50 大原著动作技术规格工坊",
            en: "Master 50 Exercise Workshop"
        },
        subtitle: {
            zh: "胸/背/肩/臂/腹/腿 6 大部位全息实操规约、即时检索与防代偿纠错对策",
            en: "50 Authentic Photo Specs across 6 Muscle Groups with Instant Search & Form Cues"
        },
        category: {
            zh: "实操体系 · 动作技术库",
            en: "Execution · Exercise Workshop"
        },
        readTime: {
            zh: "15 分钟",
            en: "15 min read"
        },
        provenance: {
            zh: "整合原著：第 6 章（全套 50 个训练动作实拍与技术规约）",
            en: "Consolidated from Chapter 6 (Complete 50 Photo Exercise Specifications)"
        },
        highlights: {
            zh: "50 个全尺寸原著高清动作规约、全字段即时模糊搜索、7 大肌群分类标签、标准准备姿势（Setup）、黄金发力口诀（Cues）、常见代偿纠错、4-2-2-1 节拍与拉伸规程。",
            en: "50 full-scale original photo specs, instant search with zero typing lag, 7 muscle group filter chips, setup cues, anti-compensation form corrections, 4-2-2-1 tempo, and stretching protocols."
        }
    },
    // PART 2: 心智系统 (MINDSET & LONGEVITY)
    {
        id: "domain-longevity",
        part: "sustain",
        domainNumber: 5,
        badge: "DOMAIN 05",
        icon: "ri-award-line",
        title: {
            zh: "终身维持与心智系统",
            en: "Longevity, LBM & Identity"
        },
        subtitle: {
            zh: "瘦体重科学模型、终极维持课表、90/10 饮食法则与衣橱里程碑心理仪式",
            en: "Lean Body Mass Formulas, Final Cut 3-Day Split, 90/10 Lifestyle & Wardrobe Purge Ritual"
        },
        category: {
            zh: "心智系统 · 长期维持",
            en: "Sustainability · Mindset"
        },
        readTime: {
            zh: "10 分钟",
            en: "10 min read"
        },
        provenance: {
            zh: "整合原著：第 11 章（终极塑形与长期生活方式）、第 12 章（未来展望与成就庆祝）",
            en: "Consolidated from Chapter 11 (Final Cut Lifestyle) & Chapter 12 (What Next?)"
        },
        highlights: {
            zh: "瘦体重 (LBM) 计算模型（原书图解 page193-1, 193-2）、交互式瘦体重与蛋白质预算计算器、好莱坞每周 3 天终身维持课表、衣橱里程碑系统与淘汰旧衣服仪式。",
            en: "Lean Body Mass calculation model with original diagrams, interactive LBM & protein calculator, Hollywood Final Cut 3-day schedule, and wardrobe purge ritual."
        }
    }
];

/**
 * 编译并获取核心领域完整数据
 */
export function getDomainData(domainId) {
    const meta = THEORY_DOMAINS.find(d => d.id === domainId);
    if (!meta) return null;

    if (domainId === 'domain-biomechanics') {
        const intro = CHAPTERS_DATA.intro;
        const ch01 = CHAPTERS_DATA.ch01;
        const ch02 = CHAPTERS_DATA.ch02;
        const ch05 = CHAPTERS_DATA.ch05;

        return {
            ...meta,
            quote: {
                zh: "好莱坞形体不是昂贵的基因特权，而是以消除代偿为铁律、经由生物力学严苛推演的确定性公式。控制速度永远胜过增加重量。",
                en: "The Hollywood body is not a genetic privilege; it is a scientifically honed formula of biomechanics and metabolic precision. Velocity control supersedes weight.",
                author: "Steve Zim"
            },
            summary: {
                zh: "领域 01 阐述身体发力与体态调整的力学原理。打破盲目追求大重量与‘局部减脂’的误区，确立以‘宽肩、窄腰、高臀’为核心的好莱坞黄金比例；系统介绍消除惯性、4-2-2-1 受张时间（TUT）与 7 大生物力学准则，并提供心智准备与器械清单。",
                en: "Domain 01 establishes the biomechanical and neurochemical foundations, answering 'How to apply mechanical force'. We shatter illusions of celebrity genetics and spot reduction, anchoring your vision into the iconic Hollywood V-Taper geometry. You will master the elimination of momentum, 4-2-2-1 Time Under Tension, Steve Zim's 7 Inviolable Biomechanical Laws, and the essential gear shopping list."
            },
            keyPrinciples: [
                {
                    icon: "ri-lightbulb-line",
                    title: { zh: "破除明星基因特权神话", en: "Demystifying Celebrity Genetics" },
                    desc: {
                        zh: "镜头前的极致形体从不是遗传彩票，而是精准力学对骨骼肌的精雕细琢。任何人只要遵循科学公式，都能在 6 周内唤醒休眠肌纤维。",
                        en: "Camera-ready aesthetics are engineered through precise joint alignments and mechanical tension, not lucky genetic inheritance."
                    }
                },
                {
                    icon: "ri-shapes-line",
                    title: { zh: "好莱坞体态铁三角模型", en: "The Hollywood Body Triangle" },
                    desc: {
                        zh: "重点雕刻背阔肌上缘与三角肌中束，拉开肩腰比，在视觉上直接让腰围‘缩小’2~3 个尺码，重塑倒三角与沙漏曲线。",
                        en: "Broaden upper lats and side delts to dramatically alter the shoulder-to-waist ratio, creating the illusion of a razor-thin waist."
                    }
                },
                {
                    icon: "ri-focus-3-line",
                    title: { zh: "零惯性力学与代偿消除", en: "Zero Momentum & Isolation" },
                    desc: {
                        zh: "每次动作从静止死点启动，战术性微调手腕与手肘夹角，锁死辅助肌群代偿通路，确保张力 100% 轰击在目标肌纤维上。",
                        en: "Initiate every repetition from a dead stop. Lock dominant secondary movers out via subtle wrist and elbow adjustments."
                    }
                },
                {
                    icon: "ri-timer-line",
                    title: { zh: "4-2-2-1 受张时间黄金节奏", en: "4-2-2-1 Time Under Tension" },
                    desc: {
                        zh: "4秒极慢离心下落释放微损伤增肌信号，2秒顶峰强力挤压，绝不锁死手肘与膝关节，让单组受张时间达到 45~60 秒黄金窗口。",
                        en: "4s eccentric descent for micro-damage signaling, 2s peak squeeze, with joints unlocked to maintain continuous mechanical load."
                    }
                }
            ],
            sections: [
                ...intro.sections,
                ...ch01.sections,
                ...ch02.sections,
                ...ch05.sections
            ]
        };
    }

    const effectiveDomainId = domainId === 'domain-action' ? 'domain-exercises' : domainId;

    if (effectiveDomainId === 'domain-metabolism') {
        const ch03 = CHAPTERS_DATA.ch03;
        const ch04 = CHAPTERS_DATA.ch04;
        const ch08 = CHAPTERS_DATA.ch08;
        const ch10 = CHAPTERS_DATA.ch10;

        return {
            ...meta,
            quote: {
                zh: "食物不是满足贪欲的奖励，也不是折磨身体的惩罚，它是雕刻肌肉细胞与氧化脂肪的高能燃料。",
                en: "Food is neither a reward to binge nor a punishment to restrict; it is the biochemical fuel that carves muscle and oxidizes fat.",
                author: "Steve Zim"
            },
            summary: {
                zh: "领域 02 整合全书营养学、代谢机制与三大体型饮食定制策略。通过 2:1/1:1 视觉餐盘模型与主次食材清单，确立科学供能基准；针对外胚型高代谢体质提供 6 餐制高频加餐防肌肉分解方案；针对内胚型提供纯绿叶控糖与胰岛素重置战术；同时结合靶心率（THR）计算与五大主流器械实操，确保脂肪平稳高效氧化。",
                en: "Domain 02 unifies nutrition, metabolism, and somatotype diet protocols. Master the 2:1 visual plate, primary vs secondary food lists, Ectomorph anti-catabolic mass meals, Endomorph pure-green insulin reset, and Target Heart Rate cardio protocols across 5 classic machines."
            },
            keyPrinciples: [
                {
                    icon: "ri-pie-chart-line",
                    title: { zh: "2:1 视觉餐盘与少量多餐", en: "2:1 Plate & Frequent Feeding" },
                    desc: {
                        zh: "餐盘划分：2 份高纤维主要蔬菜配 1 份高纯度主要蛋白质。每 3 小时进餐一次，向大脑持续释放安全信号，阻止甲状腺素下跌。",
                        en: "2 parts green fibrous vegetables to 1 part pure protein. Feeding every 3 hours suppresses ghrelin and keeps metabolism elevated."
                    }
                },
                {
                    icon: "ri-restaurant-line",
                    title: { zh: "食材分级与主次食物原则", en: "Primary vs Secondary Food Logic" },
                    desc: {
                        zh: "主要蛋白（蛋白、鸡胸、白鱼）与主要碳水（深绿叶蔬菜）无限量饱腹；次要蛋白与碳水（燕麦、糙米、红薯）严控时机与分量。",
                        en: "Primary proteins and carbs form the unrestricted lean core. Secondary carbs (oats, rice, yams) are strictly timed around training."
                    }
                },
                {
                    icon: "ri-contrast-drop-line",
                    title: { zh: "外胚与内胚体型定制饮食战术", en: "Somatotype Tailored Diets" },
                    desc: {
                        zh: "外胚型严格执行 6 餐制与两餐间防分解加餐；内胚型执行 100% 纯绿叶蔬菜替代淀粉、严禁精制糖与酒精以重启胰岛素敏感度。",
                        en: "Ectomorph: 6 meals with anti-catabolic shakes. Endomorph: 100% green fibrous carbs, zero sugar/alcohol to reset insulin sensitivity."
                    }
                },
                {
                    icon: "ri-heart-pulse-line",
                    title: { zh: "靶心率 (THR) 精准燃脂区间", en: "Target Heart Rate (THR) Math" },
                    desc: {
                        zh: "利用卡沃宁公式锁定 65%~85% 靶心率。快走坡度 8%~12%，严禁抓扶手借力，迫使臀大肌与下肢肌群深度动员脂肪酸供能。",
                        en: "Karvonen formula zones (65-85% THR). Incline walking at 8-12% without touching handrails targets pure subcutaneous fat."
                    }
                }
            ],
            sections: [
                ch03.sections[0],
                ch03.sections[1],
                ch03.sections[2],
                ch03.sections[3],
                {
                    ...ch08.sections[0],
                    title: {
                        zh: "5. 外胚型专属营养与补剂法则",
                        en: "5. Ectomorph Mass Nutrition & Supplement Rules"
                    }
                },
                {
                    ...ch10.sections[0],
                    title: {
                        zh: "6. 内胚型胰岛素重置与饮食战术",
                        en: "6. Endomorph Insulin Reset & Low-Carb Tactics"
                    }
                },
                {
                    ...ch04.sections[0],
                    title: {
                        zh: "7. 有氧 vs 无氧的能量代谢分水岭",
                        en: "7. Aerobic vs Anaerobic Energy Systems"
                    }
                },
                {
                    ...ch04.sections[1],
                    title: {
                        zh: "8. 靶心率 (THR) 精确计算公式与测算实例",
                        en: "8. Target Heart Rate (THR) Math & Application"
                    }
                },
                {
                    ...ch04.sections[2],
                    title: {
                        zh: "9. 五大主流心肺器械的实操要领与生物力学规范",
                        en: "9. Five Core Cardio Modalities & Biomechanics"
                    }
                }
            ]
        };
    }

    if (effectiveDomainId === 'domain-somatotypes') {
        const ch06 = CHAPTERS_DATA.ch06;
        const ch07 = CHAPTERS_DATA.ch07;
        const ch08 = CHAPTERS_DATA.ch08;
        const ch09 = CHAPTERS_DATA.ch09;
        const ch10 = CHAPTERS_DATA.ch10;

        return {
            ...meta,
            quote: {
                zh: "认清骨骼架构与代谢特点，配合科学的课表，就能找到适合自己的形体重塑路径。",
                en: "There are no bad genetics, only misapplied protocols. Identify your skeletal frame and unlock your dedicated 4-week split.",
                author: "Steve Zim"
            },
            summary: {
                zh: "领域 03 聚焦于体型诊断与进阶训练课表定制。读者首先通过手腕骨架自测精准判定外胚型、中胚型或内胚型；接着执行前两周男女启动期分化课表打牢基础；随后进入第 3~6 周专属雕刻阶段——外胚型主攻对抗肌超级组与节流心肺、中胚型打造极致 V-Taper 倒三角、内胚型采用 30 秒高密短间歇燃脂。课表中涉及的全部动作均可在领域 04 动作技术工坊中秒级检索查阅。",
                en: "Domain 03 focuses on skeletal frame diagnosis and custom schedule routes. Diagnose your body type using the wrist wrap test, establish neural adaptations with the Weeks 1-2 Initiation split, then advance to your dedicated 4-week protocol (Ectomorph mass, Mesomorph V-taper, or Endomorph metabolic burn). Look up all exercise specs seamlessly in Domain 04."
            },
            keyPrinciples: [
                {
                    icon: "ri-contrast-line",
                    title: { zh: "手腕骨架客观自测诊断", en: "Wrist Wrap Diagnostic Test" },
                    desc: {
                        zh: "单手拇指与中指环扣另一手手腕骨突：重叠为外胚型、触碰为中胚型、未触碰为内胚型，精准锚定基因架构。",
                        en: "Finger overlap = Ectomorph, tip touching = Mesomorph, gap = Endomorph. Scientifically diagnose dominant bone structure."
                    }
                },
                {
                    icon: "ri-run-line",
                    title: { zh: "前两周启动期神经适应", en: "Weeks 1-2 Initiation Split" },
                    desc: {
                        zh: "男女针对性全身肌群唤醒课表，建立神经肌肉连接与动作轨迹记忆，为第 3~6 周高强度分化铺平道路。",
                        en: "Gender-tailored introductory schedule establishing neuromuscular wiring and joint integrity before Phase 2."
                    }
                },
                {
                    icon: "ri-battery-charge-line",
                    title: { zh: "外胚型：抗阻增肌与节流心肺", en: "Ectomorph Mass Blueprint" },
                    desc: {
                        zh: "每周有氧严格控制在 2~3 次、每次≤20 分钟；利用对抗肌超级组锁死热量，激发深层肌纤维超量恢复。",
                        en: "Cap cardio strictly under 20 mins, prioritize antagonist supersets, and preserve every calorie for skeletal muscle growth."
                    }
                },
                {
                    icon: "ri-stack-line",
                    title: { zh: "中胚与内胚型：高密雕刻与燃脂", en: "Meso & Endo Protocols" },
                    desc: {
                        zh: "中胚型采用多动作巨型组刻画刀切分离度；内胚型执行 30 秒短间歇巨型组，打造全天候燃脂熔炉。",
                        en: "Mesomorph giant sets carve razor striations; Endomorph 30s rest metabolic circuits incinerate stubborn body fat."
                    }
                }
            ],
            sections: [
                ch07.sections[0],
                ch07.sections[1],
                ch07.sections[2],
                {
                    ...ch06.sections[6],
                    title: {
                        zh: "4. 前两周男女启动期分化课表 (Weeks 1 & 2 Schedules)",
                        en: "4. Initiation Schedules for Men & Women (Weeks 1 & 2)"
                    }
                },
                {
                    ...ch08.sections[1],
                    title: {
                        zh: "5. 外胚型第 3~6 周专属分化课表 (Weeks 3-6 Splits)",
                        en: "5. Ectomorph 4-Week Custom Split (Weeks 3-6)"
                    }
                },
                {
                    ...ch09.sections[0],
                    title: {
                        zh: "6. 打造极致倒三角 (V-Taper) 与小蛮腰",
                        en: "6. Sculpting the Ultimate V-Taper & Tiny Waist"
                    }
                },
                {
                    ...ch09.sections[1],
                    title: {
                        zh: "7. 中胚型第 3~6 周巨型组雕刻课表 (Giant Sets Matrix)",
                        en: "7. Mesomorph Giant Sets Matrix (Weeks 3-6)"
                    }
                },
                {
                    ...ch10.sections[1],
                    title: {
                        zh: "8. 内胚型第 3~6 周高密代谢雕刻课表 (Metabolic Matrix)",
                        en: "8. Endomorph Metabolic Density Schedule (Weeks 3-6)"
                    }
                }
            ]
        };
    }

    if (effectiveDomainId === 'domain-exercises') {
        const ch06 = CHAPTERS_DATA.ch06;

        return {
            ...meta,
            quote: {
                zh: "每一个动作都是一把精密的柳叶刀。找准发力角度，封锁辅助代偿，肌肉分离度就会随之而来。",
                en: "Every exercise is a precision surgical instrument. Lock out compensation, align angles, and striations will emerge.",
                author: "Steve Zim"
            },
            summary: {
                zh: "领域 04 是全书核心动作的官方标准技术字典。完整收录胸、背、肩、手臂、腹肌核心与臀部下肢共 50 个原版实拍动作。顶部集成即时模糊检索与 7 大肌群分类标签，支持秒级筛选；每个动作详尽拆解标准准备姿势（Setup）、黄金发力口诀（Cues）、常见代偿错误与纠正对策，并注明 4-2-2-1 节拍与拉伸规约。",
                en: "Domain 04 is the official technical reference encyclopedia. Featuring all 50 authentic photo exercises across 6 muscle groups with instant search, setup positions, execution cues, anti-compensation form fixes, and 4-2-2-1 tempo specifications."
            },
            keyPrinciples: [
                {
                    icon: "ri-search-line",
                    title: { zh: "全息即时搜索与部位过滤", en: "Instant Search & Muscle Filters" },
                    desc: {
                        zh: "支持按动作名、目标肌群、使用器械（哑铃/瑞士球/拉力器）及口诀关键字即时检索，毫秒级响应。",
                        en: "Zero-latency filtering by exercise name, target muscle, equipment, or cue keywords."
                    }
                },
                {
                    icon: "ri-focus-2-line",
                    title: { zh: "标准准备姿势与关节微倾角", en: "Precision Joint Alignment" },
                    desc: {
                        zh: "细致标定肘关节、手腕骨与骨盆倾斜角，物理锁死协同肌群借力通路，让张力 100% 聚焦于目标肌纤维。",
                        en: "Anchored joint angles physically lock secondary movers out to guarantee 100% target mechanical tension."
                    }
                },
                {
                    icon: "ri-flashlight-line",
                    title: { zh: "黄金发力口诀与意念连接", en: "Execution Cues & Mind-Muscle" },
                    desc: {
                        zh: "浓缩好莱坞私教现场提示词（如‘肘尖后拉引肩胛’、‘肚脐吸向脊柱’），瞬间建立高阶神经肌肉传导。",
                        en: "Concise trainer prompts connecting your nervous system directly to deep target motor units."
                    }
                },
                {
                    icon: "ri-shield-check-line",
                    title: { zh: "代偿纠错与 4-2-2-1 严苛节拍", en: "Form Fixes & 4-2-2-1 TUT" },
                    desc: {
                        zh: "点名最容易导致关节磨损或借力的致命错误并给出纠正指南；严格执行 4 秒慢速离心与 2 秒顶峰挤压。",
                        en: "Pinpoint fatal form errors to protect tendons while enforcing 4s eccentric micro-damage stimulation."
                    }
                }
            ],
            sections: ch06.sections.slice(0, 6)
        };
    }

    if (effectiveDomainId === 'domain-longevity') {
        const ch11 = CHAPTERS_DATA.ch11;
        const ch12 = CHAPTERS_DATA.ch12;

        return {
            ...meta,
            quote: {
                zh: "体态重塑不是为期 6 周的短期苦役，而是对自我神经递质与生活秩序的重新夺权。扔掉旧衣服，断绝所有妥协退路。",
                en: "Physical transformation is not a 6-week prison sentence; it is reprogramming your identity. Purge oversized clothes and cut off every path to compromise.",
                author: "Steve Zim"
            },
            summary: {
                zh: "领域 05 聚焦于训练成果的长期维持与健康习惯建立。摆脱单一依靠体重秤的焦虑，建立以瘦体重（LBM）为基准的蛋白质摄入模型；运用内置计算器测算净肌肉质量；掌握好莱坞维持课表（每周 3 天高效维持）；并通过“衣橱里程碑”与“清理旧衣物”等心理学仪式，巩固训练成果，将健康生活方式融入日常。",
                en: "Domain 05 is the spiritual anchor, answering 'How to sustain lifelong mastery'. We abandon bathroom scale tyranny in favor of Lean Body Mass (LBM) calculations and targeted protein coefficients. You will use the interactive LBM calculator, adopt the Hollywood Final Cut 3-day weekly routine, and perform the wardrobe purge ritual to ensure lifelong maintenance."
            },
            keyPrinciples: [
                {
                    icon: "ri-scales-line",
                    title: { zh: "瘦体重 (LBM) 唯一核心度量衡", en: "Lean Body Mass (LBM) Benchmark" },
                    desc: {
                        zh: "体重秤的波动多为水分与糖原，唯有瘦肌肉质量（LBM）决定基础代谢率。用净瘦体重精准预算每日蛋白质摄入量。",
                        en: "The scale reflects water and glycogen shifts. LBM alone governs your basal metabolic rate and sets your precise protein intake."
                    }
                },
                {
                    icon: "ri-calculator-line",
                    title: { zh: "三大进阶目标蛋白质系数阶梯", en: "Targeted Protein Multipliers" },
                    desc: {
                        zh: "减脂塑形每磅瘦体重 1.0 克，好莱坞紧致每磅 1.25 克，增肌增厚每磅 1.5 克。配合常见高蛋白食物表轻松达成。",
                        en: "1.0g/lb for fat loss, 1.25g/lb for tone, and 1.5g/lb for hypertrophy. Fuel repair without spilling over into caloric excess."
                    }
                },
                {
                    icon: "ri-calendar-check-line",
                    title: { zh: "每周 3 天好莱坞长期维持课表", en: "The Hollywood Final Cut Routine" },
                    desc: {
                        zh: "每周仅需 3 天、每次 30 分钟的高效复合雕刻，搭配 90/10 灵活饮食法则（90% 严守 2:1 餐盘，10% 自由社交），轻松维持巅峰状态。",
                        en: "A 3-day weekly 30-min maintenance workout combined with the 90/10 lifestyle rule (90% clean 2:1 plate, 10% flexible enjoyment)."
                    }
                },
                {
                    icon: "ri-t-shirt-air-line",
                    title: { zh: "衣橱里程碑与淘汰旧衣仪式", en: "The Wardrobe Milestone & Purge" },
                    desc: {
                        zh: "以裤腰与肩背的剪裁贴合度作为唯一视觉反馈。将过去臃肿松垮的旧衣物彻底捐赠丢弃，潜意识中斩断复胖妥协的退路。",
                        en: "Use tailoring fit as your true mirror. Permanently donate oversized past garments, psychologically sealing the door against relapse."
                    }
                }
            ],
            sections: [
                ...ch11.sections,
                ...ch12.sections
            ]
        };
    }

    return null;
}

// 兼容性导出别名
export const THEORY_STAGES = THEORY_DOMAINS;
export const getStageData = getDomainData;
