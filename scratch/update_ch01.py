with open('book/chapters/ch01.js', 'r', encoding='utf-8') as f:
    text = f.read()

target_start = text.find('rows: [')
target_end = text.find('                ]\n            }\n        },')

new_rows = """rows: [
                    {
                        item: { zh: "瑞士球 / 健身球 (Exercise Ball)", en: "Exercise Ball" },
                        spec: { zh: "防爆材质，充气后坐于球顶时膝髋呈 90 度直角", en: "Anti-burst; sitting on top creates 90° knee and hip angles" },
                        purpose: { zh: "全书核心训练平台。提供脊柱自然曲度支撑，消灭髋屈肌代偿，增大受张力位移", en: "Core platform for Swiss ball crunches, flyes, push-ups and spine-contouring" }
                    },
                    {
                        item: { zh: "哑铃组合 (Dumbbells)", en: "Dumbbell Sets" },
                        spec: { zh: "女性备 3磅 与 5磅 各一对；男性备 10磅 与 20磅 各一对（或可调节哑铃）", en: "Women: 3 & 5 lb pairs; Men: 10 & 20 lb pairs (or adjustable)" },
                        purpose: { zh: "零惯性训练的核心负重工具，轻重量即可实现深层肌纤维灼烧与微肌群雕刻", en: "Primary vehicle for zero-momentum training, delivering deep fiber burn without joint crushing" }
                    },
                    {
                        item: { zh: "调节式负重沙袋绑腿 (Ankle Weights)", en: "Adjustable Ankle Weights" },
                        spec: { zh: "可调节重量式：女性配 1~5 磅；男性配 5~10 磅", en: "Adjustable: Women 1 to 5 lbs; Men 5 to 10 lbs" },
                        purpose: { zh: "为侧踢腿、直腿后踢与下腹举腿提供渐进负荷，极度收紧外侧臀部与小腹", en: "Provides progressive resistance for side kicks, butt lifts and lower ab raises" }
                    },
                    {
                        item: { zh: "加厚运动垫 (Thick Exercise Mat)", en: "Thick Exercise Mat" },
                        spec: { zh: "相当厚度的高密度发泡垫（明确强调：非薄款瑜伽垫）", en: "Fairly thick dense mat (specifically NOT a thin yoga mat)" },
                        purpose: { zh: "为肘支撑俯卧撑、跪姿后踢提供关节缓冲，防止尾椎与手肘压迫硬地面", en: "Cushions knees, forearms, and tailbone against hard floor impact" }
                    },
                    {
                        item: { zh: "心率表 / 运动手表 (Heart-Rate Monitor)", en: "Heart-Rate Monitor" },
                        spec: { zh: "胸带式心率表（优选）或带秒表实时脉搏监测腕表", en: "Chest strap with watch receiver (preferred) or pulse tracker" },
                        purpose: { zh: "确保心肺运动时刻锁定在 65%~85% 靶心率区间，严格掌控组间间歇", en: "Keeps cardio locked within 65%-85% target zone; enforces strict rest intervals" }
                    },
                    {
                        item: { zh: "专业综合训练鞋 (Cross-Training Shoes)", en: "Cross-Training Athletic Shoes" },
                        spec: { zh: "良好横向支撑、硬平鞋底的运动训练鞋（非跑步鞋）", en: "Good pair of cross-trainers with lateral support and flat sole" },
                        purpose: { zh: "在箭步蹲与多角度跳跃移动中提供脚踝稳定支撑，防止足外翻", en: "Delivers ankle stability during lunges and multi-directional footing" }
                    },
                    {
                        item: { zh: "舒适透气运动服 (Comfortable Clothing)", en: "Comfortable Workout Clothing" },
                        spec: { zh: "吸湿排汗、无束缚感的高弹力运动服饰", en: "Moisture-wicking fabric that moves freely with the body" },
                        purpose: { zh: "确保瑞士球俯卧与全幅度深蹲时身体活动自如，保持体温", en: "Allows unhindered full-range motion on the ball and during squats" }
                    },
                    {
                        item: { zh: "周计划日程本 / 便签 (Weekly Schedule Planner)", en: "Spiral Weekly Schedule / Planner" },
                        spec: { zh: "螺旋装订周历本、日程手帐或电子日历备忘录", en: "Spiral-bound weekly schedule, day planner, or electronic aid" },
                        purpose: { zh: "将每日 30 分钟训练雷打不动排入日程，规划采购与进餐时间", en: "Carves out inviolable 30-min workout blocks and weekly grocery schedules" }
                    },
                    {
                        item: { zh: "高品质复合维生素 (Quality Multivitamin)", en: "High-Quality Multivitamin" },
                        spec: { zh: "含充足微量元素与 B 族维生素的优质复合片剂", en: "Good-quality complete daily multivitamin supplement" },
                        purpose: { zh: "在高密度力量雕刻与减脂代谢期间填补微量营养素缺口，维持免疫抗性", en: "Bridges micronutrient gaps during high-density fat loss and muscle repair" }
                    },
                    {
                        item: { zh: "32 盎司专属纯水壶 (32-Ounce Water Bottle)", en: "32-Ounce Water Bottle" },
                        spec: { zh: "约 1 升刻度便携水壶", en: "32 fl oz (~1 Liter) calibrated reusable water bottle" },
                        purpose: { zh: "时刻追踪每日饮水进度，确保全天候充沛水合冲刷乳酸", en: "Tracks daily hydration quotas to continuously flush lactic acid" }
                    }
                ]"""

if target_start != -1 and target_end != -1:
    updated = text[:target_start] + new_rows + text[target_end+len('                ]\n'):]
    with open('book/chapters/ch01.js', 'w', encoding='utf-8') as f:
        f.write(updated)
    print("Updated book/chapters/ch01.js successfully")
else:
    print("Could not find rows block in ch01.js")
