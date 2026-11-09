export const chapter07 = {
    id: "ch07",
    badge: "07",
    title: {
        zh: "第 7 章：确定你的好莱坞体型",
        en: "Chapter 7: What's Your Hollywood Body Type?"
    },
    subtitle: {
        zh: "外胚型、中胚型、内胚型的生理密码与自测评估",
        en: "Ectomorph, Mesomorph, Endomorph Diagnosis & Strategic Blueprint"
    },
    quote: {
        zh: "没有所谓的劣质基因，只有用错了方案的身体。认清你的骨骼架构与代谢倾向，你就掌握了重塑体魄的作弊代码。",
        en: "There are no bad genetics, only misapplied protocols. Identify your skeletal frame and metabolic bias, and you hold the cheat code to physical remodeling.",
        author: "Steve Zim"
    },
    summary: {
        zh: "经历了两周的启动期训练后，你的神经通路已经被彻底唤醒。此时，全书进入了最关键的‘量体裁衣’阶段：如果让天生骨架纤细、代谢极快的外胚型去做内胚型的高频有氧，只会造成肌肉迅速流失；反之，若让易储水储脂的内胚型按照外胚型的方式大量补充碳水，减脂将完全停滞。本章剖析了三大体型的生物力学与内分泌特征，并提供了权威自测诊断问卷。",
        en: "Having completed the two-week Initiation, your neural pathways are fully online. The program now enters its pivotal customization phase: prescribing an Ectomorph's mass plan to an Endomorph causes fat stalls, while prescribing high-volume cardio to an Ectomorph strips away precious muscle. This chapter dissects the somatotype mechanics and delivers the self-assessment scoring test."
    },
    keyPrinciples: [
        {
            icon: "ri-contrast-line",
            title: { zh: "三大经典体型特征", en: "Three Distinct Somatotypes" },
            desc: {
                zh: "外胚型（细长纤瘦、不易长肉）、中胚型（天生宽肩窄腰、易长肌肉）、内胚型（骨架粗重、圆润易储脂但力量雄厚）。",
                en: "Ectomorph (lean, fast metabolism, hard-gainer), Mesomorph (athletic V-taper, responsive to training), Endomorph (heavy frame, stores fat easily, powerful base)."
            }
        },
        {
            icon: "ri-survey-line",
            title: { zh: "自测评估与客观诊断", en: "Objective Self-Assessment" },
            desc: {
                zh: "通过手腕骨骼围度、脂肪分布倾向、体重增减敏锐度三项指标，科学锚定自身的主导基因倾向。",
                en: "Diagnose your dominant metabolic profile through wrist circumference, fat storage patterns, and weight change response."
            }
        },
        {
            icon: "ri-route-line",
            title: { zh: "分道扬镳的后 4 周战略", en: "Divergent 4-Week Paths" },
            desc: {
                zh: "第 8 章（外胚型）、第 9 章（中胚型）、第 10 章（内胚型）分别配备了完全不同的饮食、心肺与力量分化课表。",
                en: "Chapters 8, 9, and 10 unlock entirely different nutrition, cardio, and sculpt roadmaps calibrated to your exact type."
            }
        }
    ],
    sections: [
        {
            title: { zh: "1. 三大体型生物力学与代谢剖析", en: "1. Somatotype Biomechanics & Metabolism" },
            content: {
                zh: "• **外胚型 (The Ectomorph)**：手腕、脚踝关节细小，四肢修长，甲状腺素水平偏高，静息代谢极其旺盛。进食较多也不易发胖，但极难合成高密度骨骼肌。战略重点：严格限制多余心肺消耗，大重量抗阻训练，充足碳水与蛋白质盈余。\n• **中胚型 (The Mesomorph)**：天然具备宽阔的锁骨架构与狭窄骨盆，对力量训练反应敏锐。增肌极快，减脂亦快。战略重点：运用超级组 (Supersets) 与巨型组 (Giant Sets) 刻画极致分离度，打造古希腊雕塑般的倒三角。\n• **内胚型 (The Endomorph)**：骨架较粗大，髋骨较宽，胰岛素敏感度通常偏低，极易储存皮下和内脏脂肪，但拥有极佳的下肢力量储备。战略重点：极短组间间歇（30秒），高密度代谢抗阻训练，严格控制碳水时机，高频有氧变速走。",
                en: "• **The Ectomorph**: Slender joints, elongated limbs, fast thyroid-driven basal metabolic rate. Hard to gain weight, but struggles to build muscle density. Strategy: Strictly cap cardio, focus on hypertrophy sculpt, provide consistent caloric and protein surplus.\n• **The Mesomorph**: Naturally wide clavicles and narrow waist. Rapid response to resistance training; gains muscle and cuts fat easily. Strategy: Leverage supersets and giant sets to sculpt razor-sharp striations and command the V-taper.\n• **The Endomorph**: Wider bone structure and pelvis, lower insulin sensitivity, prone to fat accumulation, but possesses exceptional raw strength. Strategy: 30-second minimal rest intervals, high-density metabolic circuits, strict low-GI carb timing, and frequent cardio."
            }
        },
        {
            title: { zh: "2. 简易自测与诊断指南", en: "2. Quick Somatotype Diagnostic Guide" },
            content: {
                zh: "你可以通过以下临床物理指标快速确认你的主导体型：",
                en: "Use these clinical physical indicators to identify your dominant body type:"
            },
            table: {
                headers: {
                    zh: ["评估维度", "外胚型 (Ectomorph)", "中胚型 (Mesomorph)", "内胚型 (Endomorph)"],
                    en: ["Diagnostic Factor", "Ectomorph", "Mesomorph", "Endomorph"]
                },
                rows: [
                    {
                        factor: { zh: "手腕握测法则 (用单手拇指与中指环扣另一手手腕)", en: "Wrist Wrap Test" },
                        ecto: { zh: "两指重叠超过一个指甲盖 (骨架纤细)", en: "Fingers overlap significantly (delicate bone structure)" },
                        meso: { zh: "两指指尖刚好轻微触碰 (中等骨架)", en: "Fingers touch tip-to-tip precisely (medium bone structure)" },
                        endo: { zh: "两指之间存在明显空隙无法碰触 (粗大骨架)", en: "Fingers cannot touch; visible gap (heavy bone structure)" }
                    },
                    {
                        factor: { zh: "身体轮廓与比例", en: "Physical Proportions" },
                        ecto: { zh: "直线型无明显腰肩差，四肢修长纤瘦", en: "Linear, narrow shoulders and hips, thin limbs" },
                        meso: { zh: "天然倒三角 (男) 或自然沙漏形 (女)", en: "Natural V-Taper (men) or natural hourglass (women)" },
                        endo: { zh: "梨形或苹果形，躯干厚实，髋部较宽", en: "Rounder, solid trunk, broader hips and waist" }
                    },
                    {
                        factor: { zh: "饮食反应与体脂倾向", en: "Dietary Response" },
                        ecto: { zh: "吃很多也不易长胖，体脂天生较低", en: "Eats large meals without weight gain, stays lean easily" },
                        meso: { zh: "稍微控制就见腹肌，多吃也能快速转化为肌肉", en: "Cuts fat rapidly when clean; converts food to muscle" },
                        endo: { zh: "多吃碳水极易浮肿发胖，减脂需要极度专注", en: "Carb sensitivity; stores calories rapidly as body fat" }
                    },
                    {
                        factor: { zh: "对应专属进阶路线", en: "Dedicated Protocol" },
                        ecto: { zh: "【外胚型 4 周高密增肌方案】", en: "Ectomorph 4-Week Mass Protocol" },
                        meso: { zh: "【中胚型 4 周分离度雕刻方案】", en: "Mesomorph 4-Week Definition Protocol" },
                        endo: { zh: "【内胚型 4 周高密燃脂方案】", en: "Endomorph 4-Week Metabolic Protocol" }
                    }
                ]
            }
        },
        {
            title: { zh: "3. 混合体型判别与突破平台期技巧", en: "3. Hybrid Somatotypes & Plateau Busters" },
            content: {
                zh: "• **混合体型的判定法则**：\n很少有人是 100% 纯种体型，多数人是中胚-内胚混合（骨架宽但易发胖）或外胚-中胚混合（骨架细但稍练就出线条）。\n判别金标准：**以手腕骨径判定骨骼上限，以脂肪储存敏锐度判定饮食策略**。\n\n• **三大体型平台期破解秘诀 (Plateau Busters)**：\n1. **外胚型体重停滞**：每顿加餐额外增补 1 汤匙天然花生酱或 1/2 杯燕麦；将心肺有氧彻底压减至每周仅 1 次，严禁多余热量漏损！\n2. **中胚型分离度停滞**：排查调味酱料中的隐藏精制糖分；将跑步机坡度从 8% 激增至 12%~15%；组间间歇严格压缩至 45 秒。\n3. **内胚型体脂纹丝不动**：晚餐彻底剔除所有次要碳水（仅保留绿叶蔬菜与主要蛋白质）；心肺有氧提升至每周 5~6 天（必须空腹或餐前进行）；严格确保每天饮足 2.5 升纯水冲刷细胞滞留钠离子！",
                en: "• **Classifying Hybrid Somatotypes**:\nPure somatotypes are rare; most individuals are Mesomorph-Endomorph (heavy athletic frame with fat affinity) or Ectomorph-Mesomorph (lean joints but quick response to loading).\nGolden Rule: **Judge structural ceiling by bone caliper (wrists); govern diet by insulin response**.\n\n• **Steve Zim's Plateau Busters**:\n1. **Ectomorph Mass Stalls**: Add 1 tbsp natural peanut butter or 1/2 cup oatmeal to each snack; cap cardio strictly to once per week to plug caloric leaks!\n2. **Mesomorph Definition Stalls**: Audit condiments for sneaky high-fructose corn syrup; crank treadmill incline from 8% to 12%-15%; compress rest intervals to 45s.\n3. **Endomorph Fat Loss Stalls**: Eliminate evening secondary starches completely (pure greens + lean protein only); boost cardio to 5-6 days/week; enforce the full 2.5 L water intake to flush subcutaneous sodium!"
            }
        }
    ]
};
