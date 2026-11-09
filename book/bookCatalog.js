/**
 * Steve Zim《6周打造好莱坞体态》(6 Weeks to a Hollywood Body)
 * 理论全书目录元数据与核心信息架构索引
 */

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
    pillars: [
        {
            id: "isolation",
            chapterId: "ch05",
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
            chapterId: "ch05",
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
            id: "bodytypes",
            chapterId: "ch07",
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
            id: "nutrition",
            chapterId: "ch03",
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
            id: "mindset",
            chapterId: "ch11",
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

export const CHAPTERS_LIST = [
    {
        id: "intro",
        badge: "00",
        number: 0,
        title: {
            zh: "引言：什么是好莱坞体态？",
            en: "Introduction: What Is the Hollywood Body?"
        },
        subtitle: {
            zh: "破除明星神话，建立高能代谢与积极心智",
            en: "Demystifying Celebrity Fitness & Building the Active Mindset"
        },
        category: {
            zh: "理念与心智",
            en: "Mindset"
        },
        readTime: {
            zh: "6 分钟",
            en: "6 min read"
        },
        highlights: {
            zh: "揭示好莱坞体态背后的科学公式，阐述生化激素级的心智重塑，以及 30 分钟高效训练法。",
            en: "The scientific formula behind celebrity physiques, neurochemical stress relief, and 30-min efficiency."
        }
    },
    {
        id: "ch01",
        badge: "01",
        number: 1,
        title: {
            zh: "第 1 章：目标设定与心理动力",
            en: "Chapter 1: Hollywood Body Goals and Motivation"
        },
        subtitle: {
            zh: "告别不切实际的幻想，建立正向成瘾机制",
            en: "Unrealistic Expectations, Positive Addiction & Essential Gear"
        },
        category: {
            zh: "基础法则",
            en: "Foundations"
        },
        readTime: {
            zh: "7 分钟",
            en: "7 min read"
        },
        highlights: {
            zh: "如何设定可达成的阶段性里程碑，建立运动正向成瘾，附好莱坞体态装备与采购清单。",
            en: "Setting progressive milestones, harnessing positive addiction, and the complete gear shopping list."
        }
    },
    {
        id: "ch02",
        badge: "02",
        number: 2,
        title: {
            zh: "第 2 章：明星的秘密与黄金体态",
            en: "Chapter 2: Secrets of the Stars"
        },
        subtitle: {
            zh: "破除局部减脂神话，重塑倒三角与沙漏曲线",
            en: "The Spot Toning Myth, V-Taper Architecture & The Triangle"
        },
        category: {
            zh: "基础法则",
            en: "Foundations"
        },
        readTime: {
            zh: "8 分钟",
            en: "8 min read"
        },
        highlights: {
            zh: "男女核心肌群审美优先级（腿、臀、背阔、上胸、手臂、核心），好莱坞体态铁三角模型。",
            en: "Aesthetic muscle hierarchy (Back width, glute lift, upper chest), and the Hollywood Body Triangle."
        }
    },
    {
        id: "ch03",
        badge: "03",
        number: 3,
        title: {
            zh: "第 3 章：好莱坞营养学原则",
            en: "Chapter 3: Hollywood Nutrition Principles"
        },
        subtitle: {
            zh: "智胜身体饥饿机制，掌握 2:1 餐盘黄金配比",
            en: "Outthink Your Body, Plate Proportion & Primary Selections"
        },
        category: {
            zh: "营养科学",
            en: "Nutrition"
        },
        readTime: {
            zh: "10 分钟",
            en: "10 min read"
        },
        highlights: {
            zh: "体脂率精确测算法、主次蛋白质与碳水分类、2:1 与 1:1 视觉餐盘模型（配图 page39.jpg）、少量多餐原则。",
            en: "Body fat measurement, primary vs secondary carbs/protein, 2:1 & 1:1 plate diagrams, hydration."
        }
    },
    {
        id: "ch04",
        badge: "04",
        number: 4,
        title: {
            zh: "第 4 章：好莱坞心肺原则",
            en: "Chapter 4: Hollywood Heart Principles"
        },
        subtitle: {
            zh: "有氧与无氧协同，靶心率间歇加速燃脂",
            en: "Aerobic vs Anaerobic, Target Heart Rate & Varied Cardio"
        },
        category: {
            zh: "心肺有氧",
            en: "Cardio"
        },
        readTime: {
            zh: "7 分钟",
            en: "7 min read"
        },
        highlights: {
            zh: "65%~85% 靶心率区间监控、坡度变速走（Incline Walking）、五大器械（跑步机、椭圆机、划船机等）减脂要领。",
            en: "65%-85% target heart zones, incline walking protocols, and 5 classic cardio modalities."
        }
    },
    {
        id: "ch05",
        badge: "05",
        number: 5,
        title: {
            zh: "第 5 章：好莱坞雕刻原则",
            en: "Chapter 5: Hollywood Sculpt Principles"
        },
        subtitle: {
            zh: "零惯性训练、代偿消除与战术性运动幅度",
            en: "Momentumless Training, Eliminating Secondary Movers & TUT"
        },
        category: {
            zh: "力量雕刻",
            en: "Sculpting"
        },
        readTime: {
            zh: "9 分钟",
            en: "9 min read"
        },
        highlights: {
            zh: "Steve Zim 方法论精髓：消除惯性起步、肘肩关节微调锁死代偿、战术性不锁死手肘/膝盖、4-2-2-1 节奏控量。",
            en: "Core mechanics: eliminating momentum, angle tweaks to kill compensation, and strict tactical ROM."
        }
    },
    {
        id: "ch06",
        badge: "06",
        number: 6,
        title: {
            zh: "第 6 章：两周启动期与动作实战全库",
            en: "Chapter 6: Initiation — The First Two Weeks & Exercise Master Library"
        },
        subtitle: {
            zh: "神经肌肉唤醒，全书核心动作分解与图解指南",
            en: "Neuromuscular Awakening & Complete Exercise Photo Library"
        },
        category: {
            zh: "实战动作库",
            en: "Exercise Library"
        },
        readTime: {
            zh: "18 分钟",
            en: "18 min read"
        },
        highlights: {
            zh: "涵盖腹肌、胸、背、肩、手臂、臀腿共计数十个核心动作实拍图解（page93~151）、前两周男女启动分化课表。",
            en: "Comprehensive exercise workshop with original photo demos (page93-151), cues, and Week 1-2 workout splits."
        }
    },
    {
        id: "ch07",
        badge: "07",
        number: 7,
        title: {
            zh: "第 7 章：确定你的好莱坞体型",
            en: "Chapter 7: What's Your Hollywood Body Type?"
        },
        subtitle: {
            zh: "外胚型、中胚型、内胚型的生理密码与自测评估",
            en: "Ectomorph, Mesomorph, Endomorph Diagnosis & Strategic Blueprint"
        },
        category: {
            zh: "体型定制",
            en: "Somatotypes"
        },
        readTime: {
            zh: "8 分钟",
            en: "8 min read"
        },
        highlights: {
            zh: "三大体型解剖学与代谢特征、自测问卷打分法、针对性重塑战略（骨架改造与脂肪肌肉再分布）。",
            en: "Somatotype characteristics, self-assessment scoring, and targeted remodeling strategies."
        }
    },
    {
        id: "ch08",
        badge: "08",
        number: 8,
        title: {
            zh: "第 8 章：外胚型 4 周雕刻方案",
            en: "Chapter 8: Four Weeks to an Ectomorph Hollywood Body"
        },
        subtitle: {
            zh: "高密度增肌、控制心肺消耗与专属分化课表",
            en: "Mass Acceleration, Preserving Calories & Ectomorph Workout Splits"
        },
        category: {
            zh: "体型定制",
            en: "Somatotypes"
        },
        readTime: {
            zh: "10 分钟",
            en: "10 min read"
        },
        highlights: {
            zh: "外胚型瘦人增肌营养法则、有氧上限管控、第 3~6 周男女外胚型专属塑形课表（超级组运用）。",
            en: "Hypertrophy nutrition, limiting cardio to preserve muscle, and progressive Week 3-6 workout grids."
        }
    },
    {
        id: "ch09",
        badge: "09",
        number: 9,
        title: {
            zh: "第 9 章：中胚型 4 周雕刻方案",
            en: "Chapter 9: Four Weeks to a Mesomorph Hollywood Body"
        },
        subtitle: {
            zh: "高强度超级组与巨型组，刻画极致肌肉分离度",
            en: "Supersets, Giant Sets & Maximum Muscular Separation"
        },
        category: {
            zh: "体型定制",
            en: "Somatotypes"
        },
        readTime: {
            zh: "10 分钟",
            en: "10 min read"
        },
        highlights: {
            zh: "中胚型特点解析、超级组与巨型组交替强化、倒三角比例优化、第 3~6 周男女中胚型课表。",
            en: "Unlocking genetic response, supersets and giant sets, and sharp V-taper progression grids."
        }
    },
    {
        id: "ch10",
        badge: "10",
        number: 10,
        title: {
            zh: "第 10 章：内胚型 4 周雕刻方案",
            en: "Chapter 10: Four Weeks to an Endomorph Hollywood Body"
        },
        subtitle: {
            zh: "高密度代谢巨型组、极短间歇与燃脂矩阵",
            en: "Metabolic Giant Sets, Minimal Rest & Aggressive Fat Oxidation"
        },
        category: {
            zh: "体型定制",
            en: "Somatotypes"
        },
        readTime: {
            zh: "10 分钟",
            en: "10 min read"
        },
        highlights: {
            zh: "内胚型胰岛素敏感性调控、30 秒极短间歇抗阻训练、燃脂心肺强化、第 3~6 周男女内胚型课表。",
            en: "Insulin sensitivity management, 30s rest metabolic giant sets, cardio layering, and workout schedules."
        }
    },
    {
        id: "ch11",
        badge: "11",
        number: 11,
        title: {
            zh: "第 11 章：终极塑形与长期生活方式",
            en: "Chapter 11: The Final Cut: The Hollywood Body Lifestyle"
        },
        subtitle: {
            zh: "瘦体重计算模型、终极维持课表与终身法则",
            en: "Lean Body Mass Formulas, Final Cut Routines & Lifetime Protocols"
        },
        category: {
            zh: "终身维持",
            en: "Lifestyle"
        },
        readTime: {
            zh: "12 分钟",
            en: "12 min read"
        },
        highlights: {
            zh: "瘦体重精准计算公式（配图 page193-1, 193-2）、三大进阶目标蛋白质系数、常见食物热量速查表、终身男女维持分化课表。",
            en: "Interactive LBM & protein formulas (page193-1,2), food calorie catalog, and Hollywood Final Cut schedules."
        }
    },
    {
        id: "ch12",
        badge: "12",
        number: 12,
        title: {
            zh: "第 12 章：未来展望与成就庆祝",
            en: "Chapter 12: What Next?"
        },
        subtitle: {
            zh: "建立服饰奖励机制，彻底告别过去的体魄",
            en: "The Wardrobe Milestone System & Embracing Your New Self"
        },
        category: {
            zh: "理念与心智",
            en: "Mindset"
        },
        readTime: {
            zh: "5 分钟",
            en: "5 min read"
        },
        highlights: {
            zh: "完成 6 周蜕变后的心理锚定法、每周/每季度服装奖励体系、捐弃旧衣物的心理仪式感、终身维持的涟漪效应。",
            en: "Psychological reinforcement, the wardrobe milestone reward system, and sustaining the new identity."
        }
    }
];
