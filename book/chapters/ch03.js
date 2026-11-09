export const chapter03 = {
    id: "ch03",
    badge: "03",
    title: {
        zh: "第 3 章：好莱坞营养学原则",
        en: "Chapter 3: Hollywood Nutrition Principles"
    },
    subtitle: {
        zh: "智胜身体饥饿机制，掌握 2:1 餐盘黄金配比",
        en: "Outthink Your Body, Plate Proportion & Primary Selections"
    },
    quote: {
        zh: "节食不是节制，而是对身体的欺骗。你必须在身体察觉到饥饿前喂养它，你的新陈代谢才会放心大胆地全速燃烧脂肪。",
        en: "Starvation diets are a scam played against your own body. Feed your body before it enters crisis mode, and your metabolism will joyfully burn fat at full throttle.",
        author: "Steve Zim"
    },
    summary: {
        zh: "单纯计算卡路里的节食往往以代谢崩溃和报复性反弹告终。当热量断崖式下降时，身体会启动进化古老的‘饥荒自保机制’，优先分解肌肉并锁死脂肪。本章奠定了好莱坞营养学的核心逻辑：将食物划分为优质主要/次要蛋白质与碳水化合物，并通过直观的 2:1 与 1:1 餐盘视觉模型（配图 page39.jpg），实现每 3 小时稳定供能、保持肌肉充血并全天候燃烧脂肪。",
        en: "Counting calories alone inevitably triggers metabolic slowdown and rebound fat gain. When calories crash, the body triggers ancient starvation defense, consuming precious muscle while clinging desperately to fat stores. This chapter establishes the core Hollywood nutrition logic: categorizing foods into primary/secondary proteins and carbohydrates, paired with intuitive 2:1 and 1:1 plate proportions (diagram page39.jpg), keeping energy steady every 3 hours."
    },
    keyPrinciples: [
        {
            icon: "ri-brain-line",
            title: { zh: "智胜身体饥荒机制", en: "Outthink Your Starvation Mode" },
            desc: {
                zh: "绝对不跳过任何一餐。每 3 小时进食一次（每日 5~6 顿小型正餐与加餐），向大脑发出‘能量充足’的安全信号，代谢引擎将永不降速。",
                en: "Never skip meals. Eating every 3 hours (5-6 small meals/snacks per day) signals to the brain that nutrients are abundant, keeping thyroid and metabolic fires blazing."
            }
        },
        {
            icon: "ri-pie-chart-2-line",
            title: { zh: "2:1 与 1:1 餐盘黄金法则", en: "The 2:1 & 1:1 Plate Formula" },
            desc: {
                zh: "主要蛋白质搭配主要碳水时，体积比例为 1:2（绿叶蔬菜体积为瘦肉的2倍）；主要蛋白质搭配次要碳水（糙米/燕麦）时，体积比例为 1:1。",
                en: "Pairing Primary Protein with Primary Carbs uses a 1:2 plate ratio (double the greens); pairing Primary Protein with Secondary Carbs uses a strict 1:1 plate ratio."
            }
        },
        {
            icon: "ri-drop-line",
            title: { zh: "高水合与低刺激物", en: "Hydration & Stimulant Control" },
            desc: {
                zh: "每日必须饮用至少 32 盎司（约 1 升）纯水，逐步戒断咖啡因与酒精，避免皮质醇上升与水分滞留造成的假性水肿。",
                en: "Drink a minimum of 32 oz (~1 L) of pure water daily. Taper caffeine and alcohol to suppress cortisol spikes and eliminate deceptive subcutaneous water bloat."
            }
        }
    ],
    sections: [
        {
            title: { zh: "1. 体脂测定与好莱坞体脂基准 (Measuring Body Fat & Standards)", en: "1. Measuring Body Fat & The Hollywood Standard" },
            content: {
                zh: "体重秤是健身界最具欺骗性的工具。秤上的数字无法告诉你身体的真实成分——是水肿、肌肉分解，还是真正的脂肪氧化。在启动计划前，使用皮尺记录腰围、臀围、胸围、大臂与大腿围，并测定你的真实体脂率：\n\n• **脂肪细胞的生理真相**：人体的脂肪细胞数量在青春期后便不再增加，成年后的胖瘦完全取决于已有脂肪细胞的体积膨胀或缩减。一个脂肪细胞在过度充盈时可膨胀数百倍，而在脂肪彻底分解后可缩小至针尖大小。\n• **好莱坞男女体脂健康分级**：\n  - **女性健康标准**：好莱坞理想塑形区间为 **18% ~ 22%**；精英运动员为 **14% ~ 17%**；绝对底线不得低于 **12%**（过低会导致闭经、脱发和骨密度断崖式流失）。\n  - **男性健康标准**：好莱坞经典倒三角区间为 **10% ~ 14%**；刀刻肌肉分离度为 **6% ~ 9%**；生理极限制约底线为 **5%**。\n\n• **Steve Zim 居家皮尺体脂估算公式 (无需专业仪器)**：\n  - **女性公式**：\n    1. `体重 (磅) × 0.732 + 8.987 = 系数 A`\n    2. `手腕最粗处 (英寸) ÷ 3.140 = 系数 B`\n    3. `肚脐处腰围 (英寸) × 0.157 = 系数 C`\n    4. `臀部最宽处 (英寸) × 0.249 = 系数 D`\n    5. `前臂最粗处 (英寸) × 0.434 = 系数 E`\n    `瘦体重 (LBM, 磅) = (系数 A + 系数 B) - 系数 C - 系数 D + 系数 E`\n    `脂肪重量 (磅) = 总体重 - 瘦体重`\n    `体脂率 (%) = (脂肪重量 × 100) ÷ 总体重`\n\n  - **男性公式**：\n    1. `体重 (磅) × 1.082 + 94.42 = 系数 A`\n    2. `肚脐处腰围 (英寸) × 4.15 = 系数 B`\n    `瘦体重 (LBM, 磅) = 系数 A - 系数 B`\n    `脂肪重量 (磅) = 总体重 - 瘦体重`\n    `体脂率 (%) = (脂肪重量 × 100) ÷ 总体重`",
                en: "The bathroom scale is the most misleading tool in fitness. It tells you nothing about tissue composition—water shifts, muscle loss, or actual fat oxidation. Before training, log circumferences of waist, hips, chest, biceps, and thighs, and calculate your true body fat %:\n\n• **The Biology of Fat Cells**: Fat cell count locks after puberty; subsequent weight shifts reflect cellular expansion or shrinkage. An individual fat cell can swell hundreds of times or shrink to the head of a pin.\n• **Hollywood Body Fat Standards**:\n  - **Women**: Ideal Hollywood Toning: **18%-22%**; Athletic Peak: **14%-17%**; Danger floor: <**12%** (triggers amenorrhea, hair shedding, bone loss).\n  - **Men**: Ideal Hollywood V-Taper: **10%-14%**; Chiseled Striations: **6%-9%**; Essential floor: ~**5%**.\n\n• **Steve Zim's Home Tape Measure Formulas (Pages 30-32)**:\n  - **Women's Equation**:\n    1. `Weight (lbs) × 0.732 + 8.987 = Factor A`\n    2. `Wrist (fullest in) ÷ 3.140 = Factor B`\n    3. `Waist at navel (in) × 0.157 = Factor C`\n    4. `Hips (fullest in) × 0.249 = Factor D`\n    5. `Forearm (fullest in) × 0.434 = Factor E`\n    `Lean Body Mass = (A + B) - C - D + E`\n    `Fat Weight = Total Weight - Lean Body Mass`\n    `Body Fat % = (Fat Weight × 100) ÷ Total Weight`\n\n  - **Men's Equation**:\n    1. `Weight (lbs) × 1.082 + 94.42 = Factor A`\n    2. `Waist at navel (in) × 4.15 = Factor B`\n    `Lean Body Mass = Factor A - Factor B`\n    `Fat Weight = Total Weight - Lean Body Mass`\n    `Body Fat % = (Fat Weight × 100) ÷ Total Weight`"
            }
        },
        {
            title: { zh: "2. 视觉餐盘黄金法则 (The Plate Proportion)", en: "2. The Plate Proportion Logic" },
            content: {
                zh: "你不需要每顿饭都拿着食物秤战战兢兢。只要掌握直观的视觉餐盘划分，就能在任何餐厅或家中轻松掌控份量：\n\n• **方案 A (2:1 比例 · 减脂塑形核心)**：选择【主要碳水化合物（绿叶蔬菜、西蓝花、芦笋、黄瓜）】+【主要蛋白质（鸡胸肉、纯蛋清、白身鱼）】。在餐盘上，蔬菜面积应当达到瘦肉面积的 **2 倍**（2:1 比例）。这种组合能极大撑大胃容量、带来强烈的物理饱腹感，而摄入的热量密度极低，让你在毫无饥饿痛苦的情况下全天候氧化脂肪！\n• **方案 B (1:1 比例 · 运动供能核心)**：选择【次要碳水化合物（糙米、燕麦、红薯、藜麦）】+【主要蛋白质】。二者在餐盘上的面积应严格保持 **1:1 等大**，通常安排在训练前后，为剧烈的力量雕刻提供源源不断的肌肉糖原储备与合成原料。",
                en: "You don't need a gram scale at every meal. Using this intuitive visual plate guide gives you effortless command anywhere:\n\n• **Option A (2:1 Ratio · Fat Loss Core)**: Primary Carbohydrates (leafy greens, broccoli, asparagus, cucumbers) + Primary Protein (chicken breast, egg whites, white fish). The vegetable surface area must be **double** the protein portion (2:1). This provides immense physical fullness with minimal caloric density, burning fat effortlessly without hunger pangs!\n• **Option B (1:1 Ratio · Performance Core)**: Secondary Carbohydrates (brown rice, oatmeal, sweet potato, quinoa) + Primary Protein. Portions should occupy an **equal 1:1 area**, typically placed around workouts to supply glycogen for intense muscle sculpting."
            },
            diagram: {
                image: "/book-assets/page39.jpg",
                alt: "Hollywood Nutrition Plate Proportions: 2:1 vs 1:1",
                caption: {
                    zh: "原书第 39 页餐盘图例：左侧为主要碳水（蔬菜）与蛋白质的 2:1 比例；右侧为次要碳水（复杂淀粉）与蛋白质的 1:1 比例。",
                    en: "Original Page 39 Plate Diagram: Left shows 2:1 ratio of Primary Carbs to Protein; Right shows 1:1 ratio of Secondary Carbs to Protein."
                }
            }
        },
        {
            title: { zh: "3. 食物分类权威速查表 (Primary vs. Secondary)", en: "2. Food Classification Reference Table" },
            content: {
                zh: "在好莱坞营养学体系中，食物根据生物利用率、胰岛素反应与脂肪含量被严格定级：",
                en: "Foods are rigorously categorized based on bio-availability, glycemic impact, and lipid profile:"
            },
            table: {
                headers: {
                    zh: ["分类", "推荐主要优选 (Primary - 优先享用)", "受限次要备选 (Secondary - 严格控量)", "减脂期避坑禁区"],
                    en: ["Category", "Primary Selections (Unrestricted)", "Secondary Selections (Controlled)", "Red Flags (Avoid)"]
                },
                rows: [
                    {
                        item: { zh: "蛋白质 (Protein)", en: "Protein" },
                        primary: { zh: "去皮鸡胸肉、火鸡肉、纯蛋清、白身海鱼（鳕鱼/龙利鱼）、分离乳清蛋白、水豆腐", en: "Skinless chicken/turkey breast, egg whites, white fish (cod, flounder), whey isolate, firm tofu" },
                        secondary: { zh: "精瘦牛肉（牛里脊）、三文鱼、整颗鸡蛋、低脂脱脂干酪 (Cottage Cheese)", en: "Lean beef (tenderloin), salmon, whole eggs, low-fat cottage cheese" },
                        avoid: { zh: "肥牛、五花肉、培根、香肠、油炸肉类、加工肉丸", en: "Fatty cuts, pork belly, bacon, sausages, deep-fried meats" }
                    },
                    {
                        item: { zh: "碳水化合物 (Carbohydrates)", en: "Carbohydrates" },
                        primary: { zh: "西蓝花、菠菜、芦笋、生菜、芹菜、青椒、蘑菇、羽衣甘蓝", en: "Broccoli, spinach, asparagus, lettuce, celery, green peppers, mushrooms, kale" },
                        secondary: { zh: "燕麦片、糙米、红薯/紫薯、藜麦、豆类、全麦面包、低糖莓果", en: "Oatmeal, brown rice, sweet potatoes, quinoa, beans, whole wheat bread, berries" },
                        avoid: { zh: "精白米饭、白面包、甜点烘焙、含糖饮料、薯条、果酱、精炼糖", en: "Refined white rice, white bread, pastries, sugary soda, French fries, syrups" }
                    },
                    {
                        item: { zh: "健康脂肪 (Fats)", en: "Fats" },
                        primary: { zh: "特级初榨橄榄油（凉拌1茶匙）、牛油果（1/4个）、亚麻籽", en: "Extra virgin olive oil (1 tsp), fresh avocado (1/4), ground flaxseed" },
                        secondary: { zh: "生坚果（杏仁/核桃约10-12颗）、天然无添加花生酱（1汤匙）", en: "Raw almonds/walnuts (10-12 nuts), natural unsweetened peanut butter (1 tbsp)" },
                        avoid: { zh: "人造黄油、反式脂肪酸、油炸起酥油、沙拉蛋黄酱", en: "Margarine, trans-fats, commercial shortening, commercial mayo" }
                    }
                ]
            }
        },
        {
            title: { zh: "4. 每日饮水量公式与欺骗餐 (Free Meal) 军规", en: "4. Daily Hydration Formula & Free Meal Rules" },
            content: {
                zh: "• **精确每日水合公式**：\n计算公式：`体重 (磅) ÷ 2 = 每日纯水饮用量 (液量盎司)`\n公制换算：`体重 (kg) × 33 毫升`\n范例：若体重为 160 磅 (约 72.5 kg)，每日需饮用 `160 ÷ 2 = 80 盎司`（约等于 **2.4 升**）纯水。轻度脱水会导致代谢率下降 3%~5%，并造成水分滞留假性水肿。\n\n• **酒精与咖啡因的代谢毒性**：\n酒精每克提供 7 大卡空热量，且肝脏在分解乙醇时会完全暂停体内游离脂肪酸的氧化氧化长达 48~72 小时！咖啡因则容易刺激肾上腺分泌皮质醇，破坏睡眠与肌肉修复。\n\n• **自由餐 (Free Meal / Cheat Meal) 科学管控**：\n1. 前两周启动期绝对禁止任何放纵餐，给味蕾与肠道菌群建立清淡基底。\n2. 第 3 周起，每周仅允许安排 **1 顿单独的正餐** 享受你渴望的美食（如意面或汉堡）。\n3. 严禁将“欺骗餐”演变为“欺骗日 (Cheat Day)”！单次热量激增有助于打破甲状腺与瘦素的代谢抗性，但全天暴饮暴食会直接抵消一整周的减脂赤字成果。",
                en: "• **Precision Daily Hydration Formula**:\nFormula: `Body Weight (lbs) ÷ 2 = Daily Water (fl oz)`\nMetric conversion: `Body Weight (kg) × 33 ml`\nExample: A 160 lb person (72.5 kg) requires `160 ÷ 2 = 80 fl oz` (approximately **2.4 Liters**) of pure water daily. Mild dehydration drops resting metabolic rate by 3%-5% and prompts deceptive subcutaneous water bloat.\n\n• **The Metabolic Toll of Alcohol & Excess Caffeine**:\nAlcohol yields 7 empty calories per gram; more critically, while processing acetate, the liver shuts down fatty acid oxidation for up to 48-72 hours! Excess caffeine spikes cortisol, degrading sleep quality and muscle recovery.\n\n• **The Free Meal Protocol Rules**:\n1. Zero cheat meals during the first 2 Initiation Weeks to reset palate sensitivity and insulin response.\n2. Beginning in Week 3, you are permitted **one single free meal** per week to savor favorite dishes.\n3. Never turn a 'Free Meal' into a 'Cheat Day'! A single controlled caloric bump reboots leptin and thyroid hormones, whereas a day-long binge completely erases the entire week's fat deficit."
            }
        }
    ]
};
