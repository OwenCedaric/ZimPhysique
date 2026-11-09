export const chapter11 = {
    id: "ch11",
    badge: "11",
    title: {
        zh: "第 11 章：终极塑形与长期生活方式",
        en: "Chapter 11: The Final Cut: The Hollywood Body Lifestyle"
    },
    subtitle: {
        zh: "瘦体重计算模型、终极维持课表与终身法则",
        en: "Lean Body Mass Formulas, Final Cut Routines & Lifetime Protocols"
    },
    quote: {
        zh: "恭喜你！你已经完成了 6 周蜕变。现在，这不是一个训练计划的终点，而是你全新身体身份认同的开端。",
        en: "Congratulations! You have completed the 6-week blitz. This is not the end of a workout routine, but the sunrise of your new physical identity.",
        author: "Steve Zim"
    },
    summary: {
        zh: "6 周的严格雕刻已经让你的体脂大幅骤降、肌肉轮廓分明。但真正的挑战在于：如何在未来数年乃至数十年里，毫不费力地永远维持这具好莱坞体态？本章是全书的生活方式基石：确立了基于‘瘦肌肉质量 (Lean Muscle Mass, LBM)’的精确蛋白质预算计算公式（原书 page193-1, 193-2 图解）、常见食物热量速查表，以及男女通用的终极维持期分化课表。",
        en: "The rigorous 6-week sculpt has stripped your fat and chiseled your lines. The real triumph is effortless lifelong maintenance. This chapter is your permanent lifestyle guide: establishing the precision Lean Body Mass (LBM) protein equations (original page193-1, 193-2 diagrams), comprehensive food caloric tables, and the lifetime Hollywood Final Cut maintenance routine for men and women."
    },
    keyPrinciples: [
        {
            icon: "ri-calculator-line",
            title: { zh: "瘦体重 (LBM) 精准蛋白质公式", en: "Lean Body Mass Protein Formula" },
            desc: {
                zh: "每日蛋白质摄入量严格基于‘瘦肌肉质量’而非总体重计算。减脂期：1.0g/磅 LBM；塑形期：1.25g/磅 LBM；增肌期：1.5g/磅 LBM。",
                en: "Calculate daily protein strictly based on Lean Body Mass, not scale weight. Fat loss: 1.0g/lb LBM; Toning: 1.25g/lb LBM; Mass: 1.5g/lb LBM."
            }
        },
        {
            icon: "ri-repeat-line",
            title: { zh: "可持续的终身维持课表", en: "Sustainable Final Cut Routine" },
            desc: {
                zh: "不再需要每天高压冲刺。每周 3 天高浓度力量雕刻（每次 30 分钟）+ 2~3 天变速快走，即可将体脂死死锁在理想区间。",
                en: "No more punishing exhaustion. 3 focused sculpt sessions per week (30 mins) + 2-3 brisk cardio walks easily locks your physique in stone."
            }
        },
        {
            icon: "ri-cup-line",
            title: { zh: "80/20 弹性生活美学", en: "80/20 Flexible Lifestyle Harmony" },
            desc: {
                zh: "80% 的时间严格执行好莱坞餐盘与受张时间训练；20% 的时间在社交场合从容享受美食与生活，身心毫无内疚与负罪感。",
                en: "Execute the Hollywood plate and tempo 80% of the time. Enjoy social dining freely for the remaining 20% with zero guilt or metabolic setback."
            }
        }
    ],
    sections: [
        {
            title: { zh: "1. 瘦体重 (LBM) 核心计算公式", en: "1. Lean Body Mass Calculation Blueprint" },
            content: {
                zh: "在好莱坞体态体系中，脂肪不消耗蛋白质，只有瘦肌肉质量（包括骨骼、器官、肌纤维与体液）需要蛋白质作为修复与代谢燃料：\n\n**步骤一：计算脂肪重量 (Pounds of Fat)**\n体重 (磅) × 体脂率百分比 = 脂肪重量 (磅)\n\n**步骤二：计算纯瘦肌肉质量 (Lean Muscle Mass, LBM)**\n总体重 (磅) - 脂肪重量 (磅) = 纯瘦肌肉质量 (LBM, 磅)",
                en: "Adipose tissue requires zero protein; only active lean muscle mass (bones, organs, contractile myofibrils) requires amino acid fuel:\n\n**Step 1: Determine Fat Mass**\nTotal Weight (lbs) × Body Fat % = Pounds of Fat\n\n**Step 2: Determine Lean Muscle Mass (LBM)**\nTotal Weight (lbs) - Pounds of Fat = Lean Muscle Mass (LBM in lbs)"
            },
            formulaImages: [
                {
                    image: "/book-assets/page193-1.jpg",
                    alt: "Formula 1: Weight × Body Fat % = Pounds of Fat",
                    caption: {
                        zh: "原书第 193 页公式 1：体重 × 体脂率 = 脂肪重量（磅）",
                        en: "Page 193 Formula 1: Weight × Body Fat % = Pounds of Fat"
                    }
                },
                {
                    image: "/book-assets/page193-2.jpg",
                    alt: "Formula 2: Total Weight - Pounds of Fat = Lean Muscle Mass",
                    caption: {
                        zh: "原书第 193 页公式 2：总体重 - 脂肪重量 = 纯瘦肌肉质量 LBM（磅）",
                        en: "Page 193 Formula 2: Total Weight - Pounds of Fat = Lean Muscle Mass (LBM)"
                    }
                }
            ]
        },
        {
            title: { zh: "2. 进阶目标每日蛋白质需求系数", en: "2. Daily Protein Requirement Multipliers" },
            content: {
                zh: "根据你的后续终身目标，用你的 LBM (磅) 乘以对应系数，即可得出每日所需蛋白质总量（克）：",
                en: "Multiply your calculated LBM (lbs) by your specific goal factor to get your exact daily protein budget (grams):"
            },
            table: {
                headers: {
                    zh: ["进阶诉求", "每磅瘦体重蛋白质配比", "公制换算参考", "生理考量与战略重点"],
                    en: ["Physique Goal", "Protein per lb of LBM", "Metric Multiplier", "Physiological Target"]
                },
                rows: [
                    {
                        goal: { zh: "减脂突破期 (To Lose Fat)", en: "Fat Loss Focus" },
                        ratio: { zh: "1.0 克 / 磅 LBM", en: "1.0 g / lb of LBM" },
                        metric: { zh: "约 2.2 克 / 公斤 LBM", en: "~2.2 g / kg LBM" },
                        note: { zh: "在低热量赤字期捍卫氮平衡，防止肌肉作为糖原替代物被自身分解", en: "Protects nitrogen balance during caloric deficits, preventing muscle loss" }
                    },
                    {
                        goal: { zh: "紧致雕刻期 (To Tone / Sculpt)", en: "Toning & Sculpting" },
                        ratio: { zh: "1.25 克 / 磅 LBM", en: "1.25 g / lb of LBM" },
                        metric: { zh: "约 2.75 克 / 公斤 LBM", en: "~2.75 g / kg LBM" },
                        note: { zh: "好莱坞标准维持系数。支持高强度超级组训练后的肌纤维微修复与致密塑形", en: "Hollywood gold standard. Fuels dense muscular repair from superset workouts" }
                    },
                    {
                        goal: { zh: "肌肉围度增长 (To Gain Mass)", en: "Hypertrophy Mass" },
                        ratio: { zh: "1.5 克 / 磅 LBM", en: "1.5 g / lb of LBM" },
                        metric: { zh: "约 3.3 克 / 公斤 LBM", en: "~3.3 g / kg LBM" },
                        note: { zh: "适用于外胚型增肌期，提供充盈的氨基酸池以加速肌原纤维肥大", en: "For ectomorph building phases, ensuring abundant pool for myofibrillar growth" }
                    }
                ]
            }
        },
        {
            title: { zh: "3. 终极维持期男女通用课表 (The Hollywood Final Cut)", en: "3. The Hollywood Final Cut Lifetime Matrix" },
            content: {
                zh: "终身维持体态的极简日程安排：",
                en: "The permanent minimalist weekly maintenance blueprint:"
            },
            table: {
                headers: {
                    zh: ["星期", "板块", "训练内容", "时长与强度"],
                    en: ["Day", "Focus", "Protocol", "Duration & Intensity"]
                },
                rows: [
                    {
                        day: { zh: "周一 (Monday)", en: "Monday" },
                        focus: { zh: "力量雕刻 A (胸背上身)", en: "Sculpt A (Chest & Back)" },
                        content: { zh: "哑铃上斜推胸 + 俯身单臂划船 + 瑞士球俯卧撑 + 高位背阔下拉", en: "DB Incline Press + DB Row + Ball Push-ups + Lat Pulldown" },
                        intensity: { zh: "30 分钟 | 4-2-2-1 节奏 | 间歇 60s", en: "30 min | 4-2-2-1 Tempo | Rest 60s" }
                    },
                    {
                        day: { zh: "周二 (Tuesday)", en: "Tuesday" },
                        focus: { zh: "好莱坞心肺走", en: "Hollywood Heart Walk" },
                        content: { zh: "坡度跑步机（坡度 10%，速度 5.5 km/h）或户外快速徒步", en: "Incline Treadmill (10% incline, 3.5 mph) or brisk outdoor hike" },
                        intensity: { zh: "30~35 分钟 | 保持 70% 靶心率", en: "30-35 min | 70% Target Heart Rate" }
                    },
                    {
                        day: { zh: "周三 (Wednesday)", en: "Wednesday" },
                        focus: { zh: "力量雕刻 B (肩臂立体雕塑)", en: "Sculpt B (Shoulders & Arms)" },
                        content: { zh: "坐姿推肩 + 哑铃侧平举 + 二头弯举 + 三头俯身臂屈伸 + W 复合平举", en: "DB Press + Lateral Raise + Bicep Curl + Tricep Kickback + W-Shoulders" },
                        intensity: { zh: "30 分钟 | 4-2-2-1 节奏 | 间歇 45s", en: "30 min | 4-2-2-1 Tempo | Rest 45s" }
                    },
                    {
                        day: { zh: "周四 (Thursday)", en: "Thursday" },
                        focus: { zh: "好莱坞心肺交叉轮换", en: "Cross-Modality Cardio" },
                        content: { zh: "椭圆机或划船机，保持中高阻力变速滑行", en: "Elliptical or Rower, steady varied cadence" },
                        intensity: { zh: "30 分钟 | 畅快流汗", en: "30 min | Buoyant aerobic flush" }
                    },
                    {
                        day: { zh: "周五 (Friday)", en: "Friday" },
                        focus: { zh: "力量雕刻 C (下肢挺拔与核心中轴)", en: "Sculpt C (Legs, Glutes & Abs)" },
                        content: { zh: "瑞士球靠墙深蹲 + 箭步蹲 + 直腿后踢 + 瑞士球卷腹 + 螺旋开瓶器", en: "Ball Squat + Lunge + Glute Kickback + Ball Crunch + Corkscrew" },
                        intensity: { zh: "30 分钟 | 4-2-2-1 节奏 | 间歇 60s", en: "30 min | 4-2-2-1 Tempo | Rest 60s" }
                    },
                    {
                        day: { zh: "周六/周日 (Weekend)", en: "Weekend" },
                        focus: { zh: "户外动态生活与全面放松", en: "Active Recreation & Recovery" },
                        content: { zh: "冲浪、远足、骑行、游泳或陪伴家人，彻底享受身体自由", en: "Surfing, hiking, swimming, enjoying physical freedom" },
                        intensity: { zh: "自在生活，毫无负罪感", en: "Living life to its fullest with zero guilt" }
                    }
                ]
            }
        }
    ]
};
