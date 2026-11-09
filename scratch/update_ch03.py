import json, re

with open('book/chapters/ch03.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect sections in ch03.js
idx = content.find('sections: [')

# Prepare the new Section 1
new_section1 = """        {
            title: { zh: "1. 体脂测定与好莱坞体脂基准 (Measuring Body Fat & Standards)", en: "1. Measuring Body Fat & The Hollywood Standard" },
            content: {
                zh: "体重秤是健身界最具欺骗性的工具。秤上的数字无法告诉你身体的真实成分——是水肿、肌肉分解，还是真正的脂肪氧化。在启动计划前，使用皮尺记录腰围、臀围、胸围、大臂与大腿围，并测定你的真实体脂率：\\n\\n• **脂肪细胞的生理真相**：人体的脂肪细胞数量在青春期后便不再增加，成年后的胖瘦完全取决于已有脂肪细胞的体积膨胀或缩减。一个脂肪细胞在过度充盈时可膨胀数百倍，而在脂肪彻底分解后可缩小至针尖大小。\\n• **好莱坞男女体脂健康分级**：\\n  - **女性健康标准**：好莱坞理想塑形区间为 **18% ~ 22%**；精英运动员为 **14% ~ 17%**；绝对底线不得低于 **12%**（过低会导致闭经、脱发和骨密度断崖式流失）。\\n  - **男性健康标准**：好莱坞经典倒三角区间为 **10% ~ 14%**；刀刻肌肉分离度为 **6% ~ 9%**；生理极限制约底线为 **5%**。\\n\\n• **Steve Zim 居家皮尺体脂估算公式 (无需专业仪器)**：\\n  - **女性公式**：\\n    1. `体重 (磅) × 0.732 + 8.987 = 系数 A`\\n    2. `手腕最粗处 (英寸) ÷ 3.140 = 系数 B`\\n    3. `肚脐处腰围 (英寸) × 0.157 = 系数 C`\\n    4. `臀部最宽处 (英寸) × 0.249 = 系数 D`\\n    5. `前臂最粗处 (英寸) × 0.434 = 系数 E`\\n    `瘦体重 (LBM, 磅) = (系数 A + 系数 B) - 系数 C - 系数 D + 系数 E`\\n    `脂肪重量 (磅) = 总体重 - 瘦体重`\\n    `体脂率 (%) = (脂肪重量 × 100) ÷ 总体重`\\n\\n  - **男性公式**：\\n    1. `体重 (磅) × 1.082 + 94.42 = 系数 A`\\n    2. `肚脐处腰围 (英寸) × 4.15 = 系数 B`\\n    `瘦体重 (LBM, 磅) = 系数 A - 系数 B`\\n    `脂肪重量 (磅) = 总体重 - 瘦体重`\\n    `体脂率 (%) = (脂肪重量 × 100) ÷ 总体重`",
                en: "The bathroom scale is the most misleading tool in fitness. It tells you nothing about tissue composition—water shifts, muscle loss, or actual fat oxidation. Before training, log circumferences of waist, hips, chest, biceps, and thighs, and calculate your true body fat %:\\n\\n• **The Biology of Fat Cells**: Fat cell count locks after puberty; subsequent weight shifts reflect cellular expansion or shrinkage. An individual fat cell can swell hundreds of times or shrink to the head of a pin.\\n• **Hollywood Body Fat Standards**:\\n  - **Women**: Ideal Hollywood Toning: **18%-22%**; Athletic Peak: **14%-17%**; Danger floor: <**12%** (triggers amenorrhea, hair shedding, bone loss).\\n  - **Men**: Ideal Hollywood V-Taper: **10%-14%**; Chiseled Striations: **6%-9%**; Essential floor: ~**5%**.\\n\\n• **Steve Zim's Home Tape Measure Formulas (Pages 30-32)**:\\n  - **Women's Equation**:\\n    1. `Weight (lbs) × 0.732 + 8.987 = Factor A`\\n    2. `Wrist (fullest in) ÷ 3.140 = Factor B`\\n    3. `Waist at navel (in) × 0.157 = Factor C`\\n    4. `Hips (fullest in) × 0.249 = Factor D`\\n    5. `Forearm (fullest in) × 0.434 = Factor E`\\n    `Lean Body Mass = (A + B) - C - D + E`\\n    `Fat Weight = Total Weight - Lean Body Mass`\\n    `Body Fat % = (Fat Weight × 100) ÷ Total Weight`\\n\\n  - **Men's Equation**:\\n    1. `Weight (lbs) × 1.082 + 94.42 = Factor A`\\n    2. `Waist at navel (in) × 4.15 = Factor B`\\n    `Lean Body Mass = Factor A - Factor B`\\n    `Fat Weight = Total Weight - Lean Body Mass`\\n    `Body Fat % = (Fat Weight × 100) ÷ Total Weight`"
            }
        },
"""

# Rename existing section 1, 2, 3 to 2, 3, 4
updated_content = content.replace(
    'title: { zh: "1. 视觉餐盘黄金法则',
    'title: { zh: "2. 视觉餐盘黄金法则'
).replace(
    'title: { zh: "2. 食物分类权威速查表',
    'title: { zh: "3. 食物分类权威速查表'
).replace(
    'title: { zh: "3. 每日饮水量公式与欺骗餐',
    'title: { zh: "4. 每日饮水量公式与欺骗餐'
).replace(
    'en: "1. The Plate Proportion Logic"',
    'en: "2. The Plate Proportion Logic"'
).replace(
    'en: "2. Primary vs. Secondary Food Matrix"',
    'en: "3. Primary vs. Secondary Food Matrix"'
).replace(
    'en: "3. Daily Hydration Formula & Free Meal Rules"',
    'en: "4. Daily Hydration Formula & Free Meal Rules"'
)

# Insert new_section1 right after 'sections: [\n'
pos = updated_content.find('sections: [\n') + len('sections: [\n')
final_content = updated_content[:pos] + new_section1 + updated_content[pos:]

with open('book/chapters/ch03.js', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Updated book/chapters/ch03.js successfully")
