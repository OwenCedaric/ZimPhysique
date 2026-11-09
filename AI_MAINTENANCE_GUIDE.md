# AI 训练计划动态维护与调优规范指南

本文档用于规范：当用户基于**实际训练效果与体感反馈**，借助 AI 调整训练计划数据（`data/*.yaml`）时，确保 AI：
1. **不丢失原有内容**（保持动作库完整、cues、mistakes 等不被截断）；
2. **不增加未经定义的幻觉字段**（保持 Schema 严格合规，前端正常渲染）；
3. **保持标准的 YAML 缩进与格式规范**。

---

## 一、 核心原则

1. **最小修改原则 (Principle of Least Change)**：
   每次调整只改动与用户体感反馈直接相关的动作（如：组数 `sets_reps`、节奏 `tempo`、针对性 `cues` 或特定动作替换）。严禁无关重写。
2. **Schema 守卫原则 (Schema Enforcement)**：
   每个动作必须严格具备以下必需字段：
   - `id`: 唯一标识符（如 `w1`, `s1`, `st1`）
   - `name`: 动作名称
   - `target`: 目标肌群
   - `setup`: 初始准备步骤（列表）
   - `cues`: 动作技术口诀与体感意念（列表）
   - `mistakes`: 常见错误列表（每个包含 `error`, `manifestation`, `fix`）
   - `sets_reps`: 组数与次数
   - `tempo`: 动作节奏（如 `3-2-4-1`）
   - `muscle_feeling`: 目标肌肉体感
   - `rest`: 组间休息时间
   
   > 严禁新增任何未经定义的自定义属性（如 `notes`, `my_tips`, `tips` 等）。如果需要添加技术提示，请追加到 `cues` 列表中。

3. **版本递增 (Version Increment)**：
   每次修改所在 Day 的训练计划时，顶部的 `version` 字段自增 1。

---

## 二、 两种维护工作流

### 方式 1：使用精准补丁脚本（推荐，绝对防丢、防错）

无需全量重写 YAML 文件，直接使用内置补丁脚本对特定动作进行字段修改：

```bash
# 示例 1：用户卧推时前束酸痛，下调重量并增加手肘内收
node scripts/patch-plan.js --day monday --id s1 --sets_reps "4 组 × 8-10 次" --tempo "4-2-2-1"

# 示例 2：传入完整的 JSON/YAML 更新块
node scripts/patch-plan.js --day monday --id s1 --patch '{"sets_reps":"4 组 × 8-10 次","rest":"90 秒"}'
```
*脚本会自动合并字段、递增版本号，并在写入后自动执行严格校验。*

---

### 方式 2：AI 直接编辑 YAML 文件（Prompt 规范模版）

当向 AI 提出修改需求时，建议附带以下**系统约束 Prompt**：

```markdown
【任务】：请根据以下训练体感反馈，调整 data/{day}.yaml 文件。

【体感反馈】：
- 动作：上斜哑铃卧推（s1）
- 反馈：第 3-4 组手肘微开，左前肩有酸痛感，第 4 组只完成了 7 次。

【严格约束】：
1. 保持现有 YAML 结构与缩进（2 空格），不得修改或添加未经允许的键名。
2. 每个动作必须完整保留 id, name, target, setup, cues, mistakes, sets_reps, tempo, muscle_feeling, rest。不得省略或用省略号代替。
3. 调整内容：
   - 适当调整 s1 的 sets_reps（例如由固定 10 次改为 8-10 次，降低疲劳度）；
   - 在 s1 的 cues 中强化“手肘内收 45°、肩胛骨锁死”的意念引导；
   - 保持其他所有动作（w1-w4, s2-s6, st1-st3）原样不动。
4. 修改后必须通过项目的 `pnpm validate` 校验。
```

---

## 三、 自动校验机制

在任何修改完成后，在终端运行：

```bash
pnpm validate
```

或者直接构建项目：

```bash
pnpm build
```

校验器会自动检测：
- 语法是否合法；
- 是否存在重复的动作 ID；
- 是否缺失任何必填字段；
- 是否存在任何非法的新增键；
- 组数、节奏等字段是否有效。
