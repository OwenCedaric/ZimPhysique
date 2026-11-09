# ZimPhysique · 极简形体雕刻

This application manages and displays workout plans. It uses **Vite**, **Tailwind CSS v4**, and **Standalone Web App** technologies with a high-readability YAML data architecture, strict Zod schema validation, modern minimalist UI, and comprehensive Dark Mode support.

## 🚀 Running the App

### Requirements
*   Node.js & pnpm

### Commands

1.  **Installation**:
    ```bash
    pnpm install
    ```

2.  **Development**:
    ```bash
    pnpm dev
    ```
    Open the URL shown (usually `http://localhost:5173`).

3.  **Production Build**:
    ```bash
    pnpm build
    pnpm preview
    ```

## 🛠 Tech Stack

*   **Vite**: Build tool and bundler.
*   **Tailwind CSS v4**: Styling (configured via `style.css`).
*   **Standalone Web App**: Home screen standalone app support (iOS Web Clip & Web Manifest) without Service Worker caching overhead.
*   **Vanilla JS**: Core logic (`app.js`) without heavy UI frameworks.

## 📂 Data Structure & AI Maintenance

Workout data is stored in the `data/` directory using **YAML** (`.yaml`), chosen specifically for human readability and strict AI calibration maintenance without token truncation.

The app **automatically detects** these files. There is no central manifest file.

### How it Works
The app scans `data/*.yaml`. It maps each filename directly to a training plan for that day.

**Filename Format**: `[day_key].yaml`

Examples:
*   `monday.yaml` -> Day: Monday
*   `daily.yaml` -> **Special**: "Daily Posture Correction" routine (always pinned to top)

### 🛡️ Schema Validation & Anti-Hallucination
To ensure AI does not introduce hallucinated fields or omit mandatory workout cues:

```bash
# Validate all plan files against the strict Zod schema
pnpm validate
```
This check runs automatically before every `pnpm build`.

### 🎯 AI Targeted Updates (Precision Patch Tool)
When adjusting training parameters based on actual workout feedback, you can use the patch tool to update specific exercises without touching the rest of the file:

```bash
node scripts/patch-plan.js --day monday --id s1 --sets_reps "4 组 × 8-10 次" --tempo "4-2-2-1"
```

For full AI prompt templates and maintenance guidelines, see [AI_MAINTENANCE_GUIDE.md](file:///Users/xuesongwen/Documents/code/Zim/AI_MAINTENANCE_GUIDE.md).

### YAML Format
Each file strictly follows this structure:

```yaml
id: module_a1_upper_chest_mid_delt_v1
version: 1
title: 模块 A1：上胸饱满 + 肩部加宽
type: strength_training
sections:
  warmup:
    - id: w1
      name: 泡沫轴松解髂腰肌
      target: 髂腰肌
      setup:
        - 仰卧于地面
      cues:
        - "**阶段 1：寻找痛点**"
      mistakes:
        - error: 位置过低
          manifestation: 按压到腹部
          fix: 向上移动至髂前上棘
      sets_reps: 单侧 2 分钟
      tempo: 缓慢滚动
      muscle_feeling: 髋前深层酸痛
      rest: 无
  strength: [ ... ]
  stretch: [ ... ]
```

## 🌐 域名配置与 SEO / Sitemap 管理

项目内置统一的站点配置文件 [`site.config.js`](file:///Users/xuesongwen/Documents/code/Zim/site.config.js)，告别硬编码 `vercel.app` 等默认域名，方便绑定自定义独立域名并自动同步全站 SEO 元数据。

### 1. 配置自定义域名
可以通过以下两种方式之一配置你的绑定域名：

* **方式 A：直接修改配置文件（推荐）**
  打开根目录下的 [`site.config.js`](file:///Users/xuesongwen/Documents/code/Zim/site.config.js)，将 `siteUrl` 修改为你的独立域名：
  ```javascript
  export const siteConfig = {
      siteUrl: 'https://your-custom-domain.com', // 替换为你的绑定域名（末尾不带斜杠）
      // ...
  };
  ```

* **方式 B：环境变量注入（CI/CD 或部署平台）**
  在本地 `.env` 文件或 Vercel / Cloudflare / Netlify 等平台的构建环境变量中配置：
  ```bash
  SITE_URL=https://your-custom-domain.com
  ```
  *(注：环境变量优先级高于 `site.config.js` 中的默认值)*

### 2. 同步与构建
在修改域名后，构建时系统会自动执行同步：

```bash
# 单独同步生成 SEO 与 Sitemap 文件
pnpm generate:seo

# 生产构建（自动执行：SEO 文件生成 -> Schema 校验 -> Vite 打包）
pnpm build
```

脚本会自动重新生成并更新以下文件中的域名引用：
- `public/sitemap.xml`：全量站点地图（包含多语言 alternate 链接及 Talks at Google 视频元数据）
- `public/robots.txt`：搜索引擎及主流 AI 爬虫协议规则并指向最新 Sitemap
- `public/llms.txt` & `public/llms-full.txt`：LLM 知识库与规范说明 URL
- `index.html`：自动更新 Canonical、hreflang 多语言链接、Open Graph、Twitter Card 以及 JSON-LD 实体知识图谱

## 🎨 Customization

*   **Colors & Fonts**: Defined in `style.css` using Tailwind v4's `@theme` directive.
*   **Logic**: Main application logic is in `app.js`.
