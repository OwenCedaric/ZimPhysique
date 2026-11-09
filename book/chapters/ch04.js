export const chapter04 = {
    id: "ch04",
    badge: "04",
    title: {
        zh: "第 4 章：好莱坞心肺原则",
        en: "Chapter 4: Hollywood Heart Principles"
    },
    subtitle: {
        zh: "有氧与无氧协同，靶心率间歇加速燃脂",
        en: "Aerobic vs Anaerobic, Target Heart Rate & Varied Cardio"
    },
    quote: {
        zh: "心肺运动不是对自己的体能惩罚，而是唤醒细胞线粒体、释放代谢酶的生化钥匙。",
        en: "Cardiovascular exercise is not self-punishment; it is the biochemical key unlocking mitochondrial respiration and metabolic enzymes.",
        author: "Steve Zim"
    },
    summary: {
        zh: "很多跑者每天慢跑数英里，膝关节受损且体脂居高不下；而另一部分人完全放弃心肺只做器械，心肺耐力极差。本章解析了有氧（以游离脂肪酸为燃料）与无氧（以糖原为燃料）的能量代谢分水岭，确立了将心率锁定在 65%~85% 靶心率区间的科学监控方法，并首推安全高效的坡度变速走（Incline Walking）及五大经典器械的交替应用。",
        en: "Many jog endless miles, wrecking knee cartilage while body fat remains stubborn; others skip cardio completely and gas out quickly. This chapter demystifies the metabolic boundary between aerobic (fat-burning) and anaerobic (glycogen-burning) exertion, establishes the 65%-85% target heart rate formula, and champions high-incline walking along with 5 classic machines."
    },
    keyPrinciples: [
        {
            icon: "ri-heart-pulse-line",
            title: { zh: "65%~85% 靶心率区间监控", en: "65%-85% Target Heart Rate Window" },
            desc: {
                zh: "计算公式：(220 - 年龄) × 65% ~ 85%。低于 65% 无法有效诱导脂肪氧化酶活性；高于 85% 则迅速滑向无氧乳酸堆积，造成肌肉分解。",
                en: "Formula: (220 - Age) × 65% to 85%. Below 65% fails to stimulate lipolytic enzymes; above 85% slips into anaerobic glycolysis, consuming muscle tissue."
            }
        },
        {
            icon: "ri-walk-line",
            title: { zh: "从‘坡度变速走’启动", en: "Incline Interval Walking as King" },
            desc: {
                zh: "对于初学者和关节减负人群，跑步的地面冲击力是体重的 3~5 倍。在跑步机上拉大坡度快走，既能瞬间推高心率进入燃脂区间，又能对膝踝实现零冲击保护。",
                en: "Running imposes 3-5x body weight impact on knees. Incline brisk walking elevates heart rate straight into fat-burning territory while sparing cartilage entirely."
            }
        },
        {
            icon: "ri-shuffle-line",
            title: { zh: "器械与节奏的‘变速多态性’", en: "Cross-Modality Variation" },
            desc: {
                zh: "人体神经系统在 2~3 周内就会对单调的有氧模式产生抗性（代谢适应）。必须定期轮换跑步机、椭圆机、台阶机与划船机，击碎身体适应平台期。",
                en: "The nervous system adapts to monotonous cardio within weeks. Rotating between treadmill, elliptical, stair stepper, and rower continuously shocks metabolic burn."
            }
        }
    ],
    sections: [
        {
            title: { zh: "1. 有氧 vs 无氧的能量代谢分水岭", en: "1. Aerobic vs. Anaerobic Fuel Mechanics" },
            content: {
                zh: "在好莱坞体态训练中，心肺训练不是消耗卡路里的盲目奔跑，而是精确调动脂肪酶分解游离脂肪酸的生化过程：\n\n• **有氧代谢 (Aerobic)**：在氧气充足状态下，线粒体直接分解游离脂肪酸供能。特征是呼吸深长而可控，能维持 20~45 分钟连续运动。\n• **无氧代谢 (Anaerobic)**：在极高强度下氧气供应不及，身体被迫动用肌糖原进行无氧酵解，产生大量乳酸。力量雕刻属于无氧，但心肺运动必须有条不紊地留在有氧靶心率范围内，才能实现纯粹的脂肪氧化。\n• **为什么拒绝路面慢跑**：平路慢跑对膝关节的冲击力是体重的 3~5 倍，且长时间中速慢跑会导致皮质醇激增，身体被迫分解宝贵的紧致肌纤维，最终形成松垮干瘪的‘瘦胖子 (Skinny-Fat)’体型。",
                en: "Cardio is not mindless calorie burning; it is a biochemical trigger mobilizing lipolytic enzymes:\n\n• **Aerobic Metabolism**: Under adequate oxygen delivery, mitochondria directly oxidize free fatty acids. Breathing is deep and controlled, sustainable across 20-45 minutes.\n• **Anaerobic Metabolism**: When intensity exceeds oxygen transport, the body hydrolyzes stored muscle glycogen into lactic acid. Strength training is anaerobic, but your cardio must stay disciplined within the aerobic zone for true fat loss.\n• **Why Steve Zim Forbids Road Jogging**: Pounding flat pavement imposes 3-5x body weight shear on knee meniscus. Protracted moderate jogging spikes cortisol, consuming lean muscle tissue and creating the flabby 'skinny-fat' look."
            }
        },
        {
            title: { zh: "2. 靶心率 (THR) 精确计算公式与测算实例", en: "2. Step-by-Step Target Heart Rate Formula" },
            content: {
                zh: "为了确保每一次有氧训练都精准落在燃脂效率最高的区间，必须按照以下公式设定个人心率阈值：\n\n1. **测定最大心率 (MHR)**：`220 - 你的年龄`\n2. **有氧燃脂黄金区间 (60% ~ 80% / 65% ~ 85%)**：\n   - 燃脂下限：`MHR × 0.65`（诱导线粒体脂肪酶激活的最低有效强度）\n   - 燃脂上限：`MHR × 0.85`（超过此强度身体开始迅速分解肌糖原）\n3. **无氧极限警戒线 (90% 强度)**：`MHR × 0.90`（在此强度下，人体通常只能维持 10 秒左右便会力竭停顿）。\n\n• **测算范例（以 40 岁原书案例）**：\nMHR = `220 - 40 = 180 次/分`，有氧理想区间 = `108 ~ 144 次/分` (60%~80%)，进阶区间 = `117 ~ 153 次/分` (65%~85%)，无氧极限 = `162 次/分` (90%)。\n\n• **Steve Zim 权威徒手脉搏测量规范 (原书第 50 页)**：\n  - **测点一：手腕桡动脉**：前臂与手掌连接处内侧，用食指与中指指腹轻压（**严禁用大拇指！大拇指自带动脉脉搏，会导致读数严重失真**）。\n  - **测点二：颈部颈动脉**：喉结旁开、前颈肌内侧凹陷处。\n  - **计数法则**：凝视秒表，精准计数 **15 秒** 的心跳次数，然后 **乘以 4** 即为每分钟心率（BPM）；也可选用胸带式心率表，实现运动中抬腕即读。\n\n• **好莱坞坡度变速走黄金军规 (Walking Guidelines)**：\n  - **严禁抓握跑步机扶手**：双手扶住面板或侧扶手会卸去 25%~30% 的身体自重，摧毁核心与臀肌做功！双臂必须像户外自然摆臂般自由摆动。\n  - **参数设置**：坡度 **8% ~ 15%**，速度 **3.5 ~ 4.2 英里/小时 (约 5.5 ~ 6.8 公里/小时)**，单次时长 **20 ~ 35 分钟**。",
                en: "To ensure every cardiovascular session stays laser-focused on maximal lipolysis, calculate your personal threshold:\n\n1. **Determine Maximum Heart Rate (MHR)**: `220 - Age`\n2. **Aerobic Fat-Burning Window (60%-80% / 65%-85%)**:\n   - Lower Bound: `MHR × 0.65` (Minimum threshold stimulating mitochondrial lipase)\n   - Upper Bound: `MHR × 0.85` (Lactate ceiling; exceeding this consumes glycogen)\n3. **Anaerobic Threshold (90% MHR)**: `MHR × 0.90` (Sustainable for a maximum of 10 seconds before total exhaustion).\n\n• **Original Book Example (40-year-old)**:\nMHR = `220 - 40 = 180 bpm`, Ideal Zone = `108 - 144 bpm` (60%-80%), Advanced Zone = `117 - 153 bpm` (65%-85%), Anaerobic Cap = `162 bpm` (90%).\n\n• **Steve Zim's Manual Pulse Protocol (Page 50)**:\n  - **Location 1: Radial Artery (Wrist)**: Inside edge of wrist tendon using pointer and middle fingers (**NEVER use the thumb, as the thumb has its own arterial pulse that invalidates readings**).\n  - **Location 2: Carotid Artery (Neck)**: Alongside trachea under the jawline.\n  - **Count Cadence**: Count heartbeats for **15 seconds** and **multiply by 4** for BPM (or wear a chest strap monitor).\n\n• **Hollywood Incline Walking Rules (Page 84)**:\n  - **NEVER Grip the Console Rails**: Holding handrails unloads 25%-30% of bodyweight, robbing glutes and core of stabilization! Swing arms freely like power walking.\n  - **Parameters**: Incline **8% to 15%**, speed **3.5 to 4.2 mph (5.5 to 6.8 km/h)**, duration **20 to 35 minutes**."
            }
        },
        {
            title: { zh: "3. 五大主流心肺器械的实操要领与生物力学规范", en: "3. Five Essential Cardio Machines & Biomechanical Rules" },
            content: {
                zh: "在健身房或居家训练中，轮换使用以下器械能避免关节劳损并全方位激活心肺：",
                en: "Rotating through these five classic cardio modalities keeps boredom away while protecting joints:"
            },
            table: {
                headers: {
                    zh: ["器械名称", "推荐使用策略", "目标靶向与生物力学收益"],
                    en: ["Equipment", "Recommended Protocol", "Target Benefit & Mechanics"]
                },
                rows: [
                    {
                        item: { zh: "坡度跑步机 (Incline Treadmill)", en: "Incline Treadmill" },
                        protocol: { zh: "坡度 8%~15%，速度 5~6.5 km/h 坡度快走，严禁抓扶手！", en: "Incline 8%-15%, speed 3.2-4.0 mph, never grip the console rails!" },
                        benefit: { zh: "强烈激活臀大肌上部与腘绳肌，零冲击保护半月板，维持高热量消耗", en: "High glute and hamstring engagement, zero knee pounding, rapid caloric burn" }
                    },
                    {
                        item: { zh: "椭圆机 (Elliptical)", en: "Elliptical Trainer" },
                        protocol: { zh: "双手握紧活动把手同步推拉，反向踩踏，阻力调至中高档", en: "Grip dynamic handlebars, pedal in reverse, medium-high resistance" },
                        benefit: { zh: "闭链椭圆轨迹完全消除离地撞击，全身大肌群协同做功，改善上下肢协调", en: "Zero joint impact closed-kinetic loop, full-body involvement, gentle on lower back" }
                    },
                    {
                        item: { zh: "台阶机 / 登山机 (Stair Stepper)", en: "Step Machine" },
                        protocol: { zh: "上半身直立微前倾，全脚掌踩踏，后跟发力，严禁把身体重心趴在面板上", en: "Upright posture with slight hip hinge, push through heels, never lean body onto console" },
                        benefit: { zh: "垂直对抗重力，极大强化臀腿交界处线条与下肢耐力", en: "Vertical gravity resistance, exceptional glute-fold tone and lower body endurance" }
                    },
                    {
                        item: { zh: "室内划船机 (Rowing Machine)", en: "Rowing Machine" },
                        protocol: { zh: "腿部蹬伸 60% → 髋部后展 20% → 手臂后拉 20%，回程反向按顺序", en: "Legs drive 60% → hip swing 20% → arm pull 20%, reverse sequence on recovery" },
                        benefit: { zh: "唤醒沉睡的背阔肌、核心与后侧动力链，强化背部平展度", en: "Ignites posterior kinetic chain, latissimus dorsi, and core stability" }
                    },
                    {
                        item: { zh: "立式 / 靠背健身车 (Stationary Bike)", en: "Stationary Bike" },
                        protocol: { zh: "座椅高度调节至踏板在最低点时膝关节微屈 25°~30°，避免过伸", en: "Seat height dialed to 25°-30° knee flexion at bottom pedal stroke" },
                        benefit: { zh: "高踏频（80~90 RPM）中等阻力，极佳的心血管毛细血管网络强化", en: "High cadence (80-90 RPM), enhances cardiovascular density and capillary beds" }
                    }
                ]
            }
        }
    ]
};
