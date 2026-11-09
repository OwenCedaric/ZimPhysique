/**
 * Steve Zim《6周打造好莱坞体态》理论全书 Web 视图渲染器
 * 遵照 ZimPhysique 极简主义、博朗功能主义、完全单语切换与全功能 Markdown 解析规范
 * 重塑为【实操体系】与【心智系统】四维核心基石架构 (Scheme B)
 */

import { BOOK_META, THEORY_DOMAINS, getDomainData } from './theoryCatalog.js';

export const bookView = {
    /**
     * 辅助函数：根据当前语言模式返回纯净单语文本
     */
    getText: (obj, lang = 'zh') => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (lang === 'en') return obj.en || obj.zh || '';
        return obj.zh || obj.en || '';
    },

    /**
     * 生成动作多维度综合搜索索引（支持中英文名称、目标肌群、器械、动作要领与拉伸）
     */
    getExerciseSearchIndex: (ex) => {
        if (!ex) return '';
        const parts = [
            ex.name?.zh || '',
            ex.name?.en || '',
            ex.target?.zh || '',
            ex.target?.en || '',
            ex.setup?.zh || '',
            ex.setup?.en || '',
            ex.cues?.zh || '',
            ex.cues?.en || '',
            ex.mistakes?.error?.zh || '',
            ex.mistakes?.fix?.zh || '',
            ex.stretch?.zh || '',
            ex.stretch?.en || '',
            ex.tempo || '',
            ex.sets_reps || ''
        ];
        return parts.join(' ').toLowerCase();
    },

    /**
     * 内联 Markdown 解析器：处理粗体、斜体、代码、链接与标签
     */
    parseInline: (str) => {
        if (!str) return '';
        return str
            // 粗体：**text** 或 __text__
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
            .replace(/__(.*?)__/g, '<strong class="font-bold text-ink">$1</strong>')
            // 斜体：*text* 或 _text_
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            // 行内代码：`text`
            .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-subtle-fill text-accent font-mono text-xs font-semibold">$1</code>')
            // Markdown 外部链接：[text](url)
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline hover:text-ink font-medium inline-flex items-center gap-0.5 transition-colors">$1<i class="ri-external-link-line text-xs ml-0.5"></i></a>')
            // 自定义标签：[tag]（非链接）
            .replace(/\[([^[\]]+)\](?!\()/g, '<span class="px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono text-xs font-semibold">$1</span>');
    },

    /**
     * 块级 Markdown 解析器：完整支持段落、无序列表、有序列表、引用块、多级标题
     */
    parseMarkdown: (mdText) => {
        if (!mdText) return '';
        const text = mdText.replace(/\r\n/g, '\n');
        const rawBlocks = text.split(/\n{2,}/);

        const htmlBlocks = rawBlocks.map(block => {
            const trimmed = block.trim();
            if (!trimmed) return '';

            const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);

            // 检查是否全为无序列表（•, -, *）
            const isBulletList = lines.length > 0 && lines.every(l => /^[-*•]\s+/.test(l));
            if (isBulletList) {
                const listItems = lines.map(line => {
                    const itemContent = line.replace(/^[-*•]\s+/, '');
                    return `
                        <li class="flex items-start gap-2.5 my-1.5 text-sm sm:text-base leading-relaxed text-ink font-sans">
                            <span class="text-accent font-bold mt-1.5 shrink-0 text-xs sm:text-sm">◆</span>
                            <div class="flex-grow">${bookView.parseInline(itemContent)}</div>
                        </li>
                    `;
                }).join('');
                return `<ul class="space-y-1.5 my-2.5 pl-1">${listItems}</ul>`;
            }

            // 检查是否全为有序列表（1., 2.）
            const isNumberedList = lines.length > 0 && lines.every(l => /^\d+\.\s+/.test(l));
            if (isNumberedList) {
                const listItems = lines.map(line => {
                    const match = line.match(/^(\d+)\.\s+(.*)/);
                    const num = match ? match[1] : '1';
                    const itemContent = match ? match[2] : line;
                    return `
                        <li class="flex items-start gap-2.5 my-1.5 text-sm sm:text-base leading-relaxed text-ink font-sans">
                            <span class="w-5 h-5 rounded-md bg-accent/10 text-accent font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">${num}</span>
                            <div class="flex-grow">${bookView.parseInline(itemContent)}</div>
                        </li>
                    `;
                }).join('');
                return `<ol class="space-y-1.5 my-2.5">${listItems}</ol>`;
            }

            // 检查是否为引用块（>）
            if (trimmed.startsWith('>')) {
                const quoteContent = lines.map(l => l.replace(/^>\s*/, '')).join(' ');
                return `
                    <div class="p-4 rounded-xl bg-subtle-fill/50 border-l-[3px] border-accent my-3 text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                        ${bookView.parseInline(quoteContent)}
                    </div>
                `;
            }

            // 检查是否为小标题（### 或 ####）
            if (trimmed.startsWith('#### ')) {
                return `<h4 class="text-sm sm:text-base font-bold font-serif text-ink tracking-tight mt-4 mb-2">${bookView.parseInline(trimmed.replace(/^####\s+/, ''))}</h4>`;
            }
            if (trimmed.startsWith('### ')) {
                return `<h3 class="text-base sm:text-lg font-bold font-serif text-ink tracking-tight mt-5 mb-2">${bookView.parseInline(trimmed.replace(/^###\s+/, ''))}</h3>`;
            }

            // 混合段落处理
            const processedLines = [];
            let inSubList = false;
            let subListItems = [];

            for (const line of lines) {
                if (/^[-*•]\s+/.test(line)) {
                    inSubList = true;
                    subListItems.push(line.replace(/^[-*•]\s+/, ''));
                } else if (/^\d+\.\s+/.test(line)) {
                    inSubList = true;
                    subListItems.push(line);
                } else {
                    if (inSubList) {
                        processedLines.push(`
                            <ul class="space-y-1.5 my-2 pl-1">
                                ${subListItems.map(item => `
                                    <li class="flex items-start gap-2.5 my-1 text-sm sm:text-base leading-relaxed text-ink font-sans">
                                        <span class="text-accent font-bold mt-1.5 shrink-0 text-xs">◆</span>
                                        <div class="flex-grow">${bookView.parseInline(item)}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        `);
                        subListItems = [];
                        inSubList = false;
                    }
                    processedLines.push(`<p class="leading-relaxed font-sans my-1.5">${bookView.parseInline(line)}</p>`);
                }
            }

            if (inSubList) {
                processedLines.push(`
                    <ul class="space-y-1.5 my-2 pl-1">
                        ${subListItems.map(item => `
                            <li class="flex items-start gap-2.5 my-1 text-sm sm:text-base leading-relaxed text-ink font-sans">
                                <span class="text-accent font-bold mt-1.5 shrink-0 text-xs">◆</span>
                                <div class="flex-grow">${bookView.parseInline(item)}</div>
                            </li>
                        `).join('')}
                    </ul>
                `);
            }

            return processedLines.join('');
        });

        return htmlBlocks.filter(Boolean).join('');
    },

    /**
     * 渲染理论体系主页 (Theory Hub - 四维核心基石架构)
     */
    renderTheoryHomeHTML: (app) => {
        const lang = app.state.language || app.state.bookLanguage || 'zh';
        const isEn = lang === 'en';

        // 当前激活的支柱，默认为第一个 'isolation'
        const activePillarId = app.state.activePillarId || BOOK_META.pillars[0].id;
        const currentPillar = BOOK_META.pillars.find(p => p.id === activePillarId) || BOOK_META.pillars[0];

        // 拆分四大领域为两大逻辑系统：实操体系 vs 心智系统
        const executeDomains = THEORY_DOMAINS.filter(d => d.part === 'execute');
        const sustainDomains = THEORY_DOMAINS.filter(d => d.part === 'sustain');

        return `
            <div class="space-y-8 pb-16 animate-fade-in select-text">
                
                <!-- Top Breadcrumb & Clean Dual-Language Toggle (NO OVERLAY, STATIC FLOW) -->
                <div class="flex items-center justify-between border-b border-subtle-border pb-3">
                    <button onclick="app.goHome()" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-mono text-ink-secondary hover:text-ink transition-colors">
                        <i class="ri-arrow-left-s-line text-sm text-accent"></i>
                        <span>${isEn ? 'Back to Workouts' : '返回每日训练'}</span>
                    </button>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                            ${isEn ? 'STEVE ZIM METHODOLOGY' : 'STEVE ZIM 权威理论体系'}
                        </span>
                        <!-- Clean Dual-Language Toggle (ZH or EN only) -->
                        <div class="flex items-center p-0.5 rounded-lg bg-subtle-fill border border-subtle-border text-xs font-mono">
                            <button onclick="app.setLanguage('zh')" class="cursor-pointer px-2 py-0.5 rounded-md transition-all ${!isEn ? 'bg-surface text-accent font-bold shadow-xs' : 'text-ink-secondary hover:text-ink'}">
                                中文
                            </button>
                            <button onclick="app.setLanguage('en')" class="cursor-pointer px-2 py-0.5 rounded-md transition-all ${isEn ? 'bg-surface text-accent font-bold shadow-xs' : 'text-ink-secondary hover:text-ink'}">
                                EN
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Theory Hero Header -->
                <div class="bg-surface border border-subtle-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
                    <!-- Ambient Glow -->
                    <div class="absolute -right-12 -top-12 w-64 h-64 bg-accent/[0.08] dark:bg-accent/[0.14] rounded-full blur-3xl pointer-events-none"></div>

                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                        <!-- Book Cover Mockup -->
                        <div class="md:col-span-4 flex justify-center">
                            <div class="w-48 sm:w-56 rounded-2xl overflow-hidden border border-subtle-border/80 shadow-xl group relative">
                                <img src="${BOOK_META.coverImage}" alt="Book Cover" class="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <span class="text-[11px] text-white font-mono font-medium">John Wiley & Sons, Inc.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Theory Meta & Summary -->
                        <div class="md:col-span-8 space-y-4">
                            <div class="space-y-1.5">
                                <div class="flex items-center gap-2 text-xs font-mono text-accent font-semibold tracking-wider uppercase">
                                    <span>${BOOK_META.authors}</span>
                                    <span>•</span>
                                    <span>${isEn ? '4 Core Domains Architecture' : '四维核心基石架构'}</span>
                                </div>
                                <h1 class="text-2xl sm:text-4xl font-bold font-serif text-ink tracking-tight leading-tight">
                                    ${isEn ? BOOK_META.title.en : BOOK_META.title.zh}
                                </h1>
                                <p class="text-sm sm:text-base text-ink-secondary font-mono">
                                    ${isEn ? BOOK_META.subtitle.en : BOOK_META.subtitle.zh}
                                </p>
                            </div>

                            <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                                ${isEn
                ? "Resolving two fundamental challenges of physical transformation: 'How to Execute' (Biomechanics, Metabolic Fuel, Action Workshop & Somatotypes) and 'How to Sustain' (Lean Mass Benchmarks, Maintenance Schedules & Identity Reinforcement). A high-cohesion functional architecture built for permanent mastery."
                : "打破传统章节顺序，系统梳理为两大板块：实操体系（生物力学、能量代谢、动作库与体型定制）与心智系统（瘦体重计算、长期维持课表与习惯建立），构筑清晰实用的理论系统。"
            }
                            </p>

                            <!-- Quick Action Buttons -->
                            <div class="flex flex-wrap items-center gap-3 pt-2">
                                <button onclick="app.openDomain('domain-biomechanics')" class="cursor-pointer px-4 sm:px-5 py-2.5 rounded-xl bg-accent text-white dark:text-[#0b0f14] font-medium text-xs sm:text-sm shadow-md hover:bg-accent/90 transition-all flex items-center gap-2 active:scale-95">
                                    <i class="ri-compass-3-line text-sm"></i>
                                    <span>${isEn ? 'Start Domain 1: Biomechanics' : '认知与力学'}</span>
                                </button>
                                <button onclick="app.openDomain('domain-exercises')" class="cursor-pointer px-4 sm:px-5 py-2.5 rounded-xl bg-subtle-fill hover:bg-subtle-border/80 border border-subtle-border font-medium text-ink text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95">
                                    <i class="ri-boxing-line text-sm text-accent"></i>
                                    <span>${isEn ? 'Action Workshop (50 Specs)' : '动作技术库 (50大动作)'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Featured Keynote: Talks at Google (Santa Monica Office) -->
                ${BOOK_META.googleTalk ? `
                <div class="bg-surface border border-subtle-border rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xs space-y-4">
                    <!-- Subtle Ambient Tint -->
                    <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-500/[0.04] dark:bg-rose-500/[0.07] rounded-full blur-2xl pointer-events-none"></div>

                    <!-- Row 1: Top Meta Bar & Clean Initial Button Style -->
                    <div class="flex items-center justify-between gap-3 border-b border-subtle-border pb-3 relative z-10">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <i class="ri-video-line text-xs"></i>
                                <span>AUTHORS@GOOGLE</span>
                            </span>
                            <span class="text-xs text-ink-secondary font-mono">${BOOK_META.googleTalk.location}</span>
                            <span class="text-xs text-ink-secondary/60 hidden sm:inline">•</span>
                            <span class="text-xs text-ink-secondary/70 font-mono hidden sm:inline">${BOOK_META.googleTalk.date} (${BOOK_META.googleTalk.duration})</span>
                        </div>

                        <!-- Clean Initial-Style Action Button (Subtle border & fill + Red YouTube Icon) -->
                        <button onclick="app.openGoogleTalkModal()" class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-subtle-fill hover:bg-subtle-border/80 border border-subtle-border font-medium text-ink text-xs transition-all active:scale-95 shrink-0 group shadow-2xs" title="${isEn ? 'Watch on YouTube' : '播放 Talks at Google 专场演讲'}">
                            <i class="ri-youtube-fill text-sm text-rose-500 group-hover:scale-110 transition-transform"></i>
                            <span>${isEn ? 'Talks at Google' : 'Talks at Google 演讲'}</span>
                        </button>
                    </div>

                    <!-- Row 2: Full-Width Title (Guaranteed NO wrapping!) -->
                    <div class="pt-0.5 relative z-10">
                        <h3 onclick="app.openGoogleTalkModal()" class="cursor-pointer font-serif font-bold text-ink text-base sm:text-lg md:text-xl tracking-tight leading-snug hover:text-accent transition-colors flex items-center gap-2 group" title="${bookView.getText(BOOK_META.googleTalk.title, lang)}">
                            <span class="whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis">${bookView.getText(BOOK_META.googleTalk.title, lang)}</span>
                            <span class="text-xs font-mono font-normal text-ink-secondary/70 hidden lg:inline">— Steve Zim</span>
                        </h3>
                    </div>

                    <!-- Row 3: Keynote Summary -->
                    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans relative z-10">
                        ${bookView.parseInline(bookView.getText(BOOK_META.googleTalk.summary, lang))}
                    </p>

                    <!-- Row 4: Key Topics & Timestamps Grid (Clickable to open video modal at specific chapter) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1 relative z-10">
                        ${BOOK_META.googleTalk.keyTopics ? BOOK_META.googleTalk.keyTopics.map(topic => `
                            <button onclick="app.openGoogleTalkModal(${topic.seconds})" class="cursor-pointer text-left p-2.5 rounded-xl bg-subtle-fill/60 hover:bg-subtle-fill hover:border-accent/40 border border-subtle-border/80 space-y-1 transition-all group shadow-2xs">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-1 text-[10px] font-mono font-bold text-accent">
                                        <i class="ri-time-line text-[10px]"></i>
                                        <span>${topic.time}</span>
                                    </div>
                                    <i class="ri-youtube-fill text-xs text-rose-500/80 group-hover:text-rose-500 transition-colors"></i>
                                </div>
                                <div class="font-serif font-bold text-xs text-ink truncate group-hover:text-accent transition-colors" title="${bookView.getText(topic.title, lang)}">
                                    ${bookView.getText(topic.title, lang)}
                                </div>
                                <p class="text-[10px] text-ink-secondary line-clamp-2 leading-tight">
                                    ${bookView.getText(topic.desc, lang)}
                                </p>
                            </button>
                        `).join('') : ''}
                    </div>
                </div>
                ` : ''}

                <!-- Five Core Pillars: Interactive Scientific Workstation (五大核心支柱解析) -->
                <div class="space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle-border pb-3">
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-widest text-accent font-mono flex items-center gap-1.5">
                                <i class="ri-microscope-line"></i>
                                <span>${isEn ? 'FIVE SCIENTIFIC PILLARS OF HOLLYWOOD BODY' : '好莱坞体态重塑五大科学支柱'}</span>
                            </h3>
                            <p class="text-xs text-ink-secondary mt-0.5">
                                ${isEn ? 'Click any pillar tab to explore underlying biomechanics, quantitative rules, and direct domain.' : '点击任意支柱切片，深入解剖底层生物力学、定量执行标准与对应核心领域。'}
                            </p>
                        </div>
                        <span class="text-[11px] font-mono text-ink-secondary">
                            ${isEn ? 'Core Principles' : '核心支柱解析'}
                        </span>
                    </div>

                    <!-- Interactive Selector Tabs (5 Pillars) -->
                    <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        ${BOOK_META.pillars.map((p, idx) => {
                const isActive = p.id === activePillarId;
                return `
                                <button onclick="app.setActivePillar('${p.id}')" class="cursor-pointer p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${isActive ? 'bg-surface border-accent shadow-md ring-1 ring-accent/30' : 'bg-surface/60 border-subtle-border hover:border-accent/40 hover:bg-surface'}">
                                    <div class="flex items-center justify-between">
                                        <div class="w-6 h-6 rounded-md flex items-center justify-center ${isActive ? 'bg-accent text-white dark:text-[#0b0f14]' : 'bg-subtle-fill text-ink-secondary'} text-xs">
                                            <i class="${p.icon}"></i>
                                        </div>
                                        <span class="text-[9px] font-mono font-bold uppercase tracking-wider text-ink-secondary">0${idx + 1}</span>
                                    </div>
                                    <div class="min-w-0">
                                        <h4 class="font-serif font-bold text-xs sm:text-sm truncate ${isActive ? 'text-accent' : 'text-ink'}">
                                            ${bookView.getText(p.title, lang)}
                                        </h4>
                                    </div>
                                </button>
                            `;
            }).join('')}
                    </div>

                    <!-- Active Pillar Deep-Dive Dossier (激活支柱深度解剖卡) -->
                    <div class="bg-surface border-2 border-accent/40 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm relative overflow-hidden transition-all">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-subtle-border pb-4">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                                        ${currentPillar.badge}
                                    </span>
                                    <span class="text-xs text-ink-secondary font-mono">${isEn ? 'Core Principle' : '第一性原理'}</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-bold font-serif text-ink tracking-tight">
                                    ${bookView.getText(currentPillar.title, lang)}
                                </h2>
                            </div>
                            <button onclick="app.openDomain('${currentPillar.domainId}')" class="cursor-pointer shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white dark:text-[#0b0f14] font-medium text-xs font-mono shadow-xs hover:bg-accent/90 transition-all active:scale-95">
                                <span>${isEn ? 'View Domain' : '查看所属领域'}</span>
                                <i class="ri-arrow-right-line"></i>
                            </button>
                        </div>

                        <!-- 4-Quadrant Information Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                            <!-- 1. Axiom -->
                            <div class="p-4 rounded-2xl bg-subtle-fill/50 border border-subtle-border space-y-2">
                                <div class="flex items-center gap-1.5 font-mono font-bold text-accent text-xs uppercase tracking-wider">
                                    <i class="ri-focus-line"></i>
                                    <span>${isEn ? 'Core Axiom & Definition' : '核心公理与法则'}</span>
                                </div>
                                <p class="text-ink font-serif font-bold text-sm sm:text-base leading-snug">
                                    ${bookView.getText(currentPillar.axiom, lang)}
                                </p>
                            </div>

                            <!-- 2. Biomechanical Mechanism -->
                            <div class="p-4 rounded-2xl bg-subtle-fill/50 border border-subtle-border space-y-2">
                                <div class="flex items-center gap-1.5 font-mono font-bold text-accent text-xs uppercase tracking-wider">
                                    <i class="ri-flask-line"></i>
                                    <span>${isEn ? 'Biomechanical & Physiological Mechanism' : '底层生物力学与生理机制'}</span>
                                </div>
                                <p class="text-ink-secondary leading-relaxed font-sans">
                                    ${bookView.getText(currentPillar.mechanism, lang)}
                                </p>
                            </div>

                            <!-- 3. Quantitative Rules -->
                            <div class="p-4 rounded-2xl bg-subtle-fill/50 border border-subtle-border space-y-2">
                                <div class="flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider">
                                    <i class="ri-ruler-line"></i>
                                    <span>${isEn ? 'Actionable Formula & Quantitative Standard' : '严苛定量指标与实操公式'}</span>
                                </div>
                                <div class="p-2.5 rounded-xl bg-surface border border-subtle-border font-mono text-xs text-ink font-semibold">
                                    ${bookView.getText(currentPillar.formula, lang)}
                                </div>
                            </div>

                            <!-- 4. Fatal Conventional Mistake -->
                            <div class="p-4 rounded-2xl bg-subtle-fill/50 border border-subtle-border space-y-2">
                                <div class="flex items-center gap-1.5 font-mono font-bold text-rose-500 dark:text-rose-400 text-xs uppercase tracking-wider">
                                    <i class="ri-alert-line"></i>
                                    <span>${isEn ? 'Fatal Conventional Mistake' : '传统致命误区'}</span>
                                </div>
                                <p class="text-ink-secondary leading-relaxed font-sans">
                                    ${bookView.getText(currentPillar.fatalError, lang)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Part 1: 实操体系 -->
                <div class="space-y-4 pt-4">
                    <div class="flex items-center justify-between border-b border-subtle-border pb-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-accent"></span>
                                <h3 class="text-xs font-bold uppercase tracking-widest text-accent font-mono">
                                    ${isEn ? 'PART I · EXECUTION SYSTEM' : '第一部分 · 实操体系'}
                                </h3>
                            </div>
                            <p class="text-xs text-ink-secondary mt-1">
                                ${isEn ? 'Master the biomechanics, fueling logic, somatotype routes and master exercise specs.' : '掌握力学发力、生化餐盘、体型定制方案与动作技术规约，消除一切执行盲区。'}
                            </p>
                        </div>
                        <span class="text-xs text-ink-secondary font-mono">
                            ${isEn ? `${executeDomains.length} Domains` : `${executeDomains.length} 大实操领域`}
                        </span>
                    </div>

                    <div class="space-y-3">
                        ${executeDomains.map((domain, idx) => `
                            <button onclick="app.openDomain('${domain.id}')" class="cursor-pointer w-full text-left bg-surface border border-subtle-border hover:border-accent/60 hover:bg-subtle-fill/30 p-5 sm:p-6 rounded-3xl transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs active:scale-[0.99] relative overflow-hidden">
                                
                                <div class="flex items-start md:items-center gap-4 min-w-0 flex-grow">
                                    <!-- Domain Number Icon -->
                                    <div class="shrink-0 w-12 h-12 rounded-2xl bg-subtle-fill border border-subtle-border flex flex-col items-center justify-center font-mono font-bold text-ink group-hover:bg-accent group-hover:text-white dark:group-hover:text-[#0b0f14] transition-all">
                                        <i class="${domain.icon} text-lg"></i>
                                        <span class="text-[9px] leading-tight">0${idx + 1}</span>
                                    </div>

                                    <!-- Domain Content -->
                                    <div class="min-w-0 space-y-1.5">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                                                ${domain.badge}
                                            </span>
                                            <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-subtle-fill text-ink-secondary">
                                                ${bookView.getText(domain.provenance, lang)}
                                            </span>
                                            <span class="text-[11px] font-mono text-ink-secondary/70">
                                                <i class="ri-time-line text-[10px]"></i> ${bookView.getText(domain.readTime, lang)}
                                            </span>
                                        </div>

                                        <h3 class="font-serif font-bold text-ink text-lg sm:text-xl group-hover:text-accent transition-colors leading-snug">
                                            ${bookView.getText(domain.title, lang)}
                                        </h3>

                                        <p class="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
                                            ${bookView.getText(domain.subtitle, lang)}
                                        </p>

                                        <p class="text-xs text-ink-secondary/80 font-sans line-clamp-1 pt-0.5">
                                            <span class="text-accent font-semibold">${isEn ? 'Core focus:' : '核心要素：'}</span> ${bookView.getText(domain.highlights, lang)}
                                        </p>
                                    </div>
                                </div>

                                <!-- Arrow Action -->
                                <div class="shrink-0 self-end md:self-center flex items-center gap-2 px-3 py-1.5 rounded-xl bg-subtle-fill group-hover:bg-accent group-hover:text-white dark:group-hover:text-[#0b0f14] transition-all text-xs font-mono font-medium text-ink">
                                    <span>${isEn ? 'View Domain' : '开始阅读'}</span>
                                    <i class="ri-arrow-right-line text-sm transform group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Part 2: 心智系统 -->
                <div class="space-y-4 pt-4">
                    <div class="flex items-center justify-between border-b border-subtle-border pb-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <h3 class="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                                    ${isEn ? 'PART II · MINDSET & LONGEVITY' : '第二部分 · 心智系统'}
                                </h3>
                            </div>
                            <p class="text-xs text-ink-secondary mt-1">
                                ${isEn ? 'Overcome bathroom scale anxiety, establish lean mass metrics, and forge permanent identity.' : '破除体重秤精神内耗，锚定瘦体重唯一指标，通过维持排期与衣橱仪式完成终身身份认同。'}
                            </p>
                        </div>
                        <span class="text-xs text-ink-secondary font-mono">
                            ${isEn ? '1 Domain' : '1 大心智领域'}
                        </span>
                    </div>

                    <div class="space-y-3">
                        ${sustainDomains.map(domain => `
                            <button onclick="app.openDomain('${domain.id}')" class="cursor-pointer w-full text-left bg-surface border-2 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/[0.03] p-5 sm:p-6 rounded-3xl transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs active:scale-[0.99] relative overflow-hidden">
                                
                                <div class="flex items-start md:items-center gap-4 min-w-0 flex-grow">
                                    <!-- Domain Icon -->
                                    <div class="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center font-mono font-bold text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-[#0b0f14] transition-all">
                                        <i class="${domain.icon} text-lg"></i>
                                        <span class="text-[9px] leading-tight">05</span>
                                    </div>

                                    <!-- Domain Content -->
                                    <div class="min-w-0 space-y-1.5">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                ${domain.badge}
                                            </span>
                                            <span class="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-subtle-fill text-ink-secondary">
                                                ${bookView.getText(domain.provenance, lang)}
                                            </span>
                                            <span class="text-[11px] font-mono text-ink-secondary/70">
                                                <i class="ri-time-line text-[10px]"></i> ${bookView.getText(domain.readTime, lang)}
                                            </span>
                                        </div>

                                        <h3 class="font-serif font-bold text-ink text-lg sm:text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                                            ${bookView.getText(domain.title, lang)}
                                        </h3>

                                        <p class="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
                                            ${bookView.getText(domain.subtitle, lang)}
                                        </p>

                                        <p class="text-xs text-ink-secondary/80 font-sans line-clamp-1 pt-0.5">
                                            <span class="text-emerald-600 dark:text-emerald-400 font-semibold">${isEn ? 'Core focus:' : '核心要素：'}</span> ${bookView.getText(domain.highlights, lang)}
                                        </p>
                                    </div>
                                </div>

                                <!-- Arrow Action -->
                                <div class="shrink-0 self-end md:self-center flex items-center gap-2 px-3 py-1.5 rounded-xl bg-subtle-fill group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-[#0b0f14] transition-all text-xs font-mono font-medium text-ink">
                                    <span>${isEn ? 'View Domain' : '开始阅读'}</span>
                                    <i class="ri-arrow-right-line text-sm transform group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Direct Fast-Track Tools (全局实战交互工具箱) -->
                <div class="space-y-3 pt-4">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-ink-secondary font-mono flex items-center gap-1.5">
                        <i class="ri-tools-line text-accent"></i>
                        <span>${isEn ? 'INTERACTIVE FAST-TRACK TOOLKIT' : '全局实战交互工具箱'}</span>
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <button onclick="app.openDomain('domain-exercises')" class="cursor-pointer text-left p-4 rounded-2xl bg-surface border border-subtle-border hover:border-accent/60 p-4 transition-all group shadow-xs">
                            <div class="flex items-center gap-2 text-accent font-mono text-xs font-bold mb-1">
                                <i class="ri-boxing-line text-base"></i>
                                <span>${isEn ? 'Exercise Workshop' : '50 个原著动作库'}</span>
                            </div>
                            <p class="text-xs text-ink font-serif font-bold">${isEn ? '50 Original Photo Specs' : '动作技术规格规约'}</p>
                            <p class="text-[11px] text-ink-secondary mt-1">${isEn ? 'Instant search, muscle filters, form cues & TUT' : '即时检索、部位筛选、发力口诀与节拍'}</p>
                        </button>

                        <button onclick="app.openDomain('domain-somatotypes')" class="cursor-pointer text-left p-4 rounded-2xl bg-surface border border-subtle-border hover:border-accent/60 p-4 transition-all group shadow-xs">
                            <div class="flex items-center gap-2 text-accent font-mono text-xs font-bold mb-1">
                                <i class="ri-body-scan-line text-base"></i>
                                <span>${isEn ? 'Somatotype Router' : '体型自测与定制课表'}</span>
                            </div>
                            <p class="text-xs text-ink font-serif font-bold">${isEn ? 'Wrist Test & 4-Week Routes' : '手腕测试与专属分化课表'}</p>
                            <p class="text-[11px] text-ink-secondary mt-1">${isEn ? 'Ecto, Meso & Endo 4-week splits' : '外胚/中胚/内胚专属雕刻方案与启动课表'}</p>
                        </button>

                        <button onclick="app.openDomain('domain-metabolism')" class="cursor-pointer text-left p-4 rounded-2xl bg-surface border border-subtle-border hover:border-accent/60 p-4 transition-all group shadow-xs">
                            <div class="flex items-center gap-2 text-accent font-mono text-xs font-bold mb-1">
                                <i class="ri-restaurant-line text-base"></i>
                                <span>${isEn ? 'Metabolic Nutrition' : '营养代谢与饮食全案'}</span>
                            </div>
                            <p class="text-xs text-ink font-serif font-bold">${isEn ? '2:1 Plate & Somatotype Diets' : '视觉餐盘与三大体型饮食'}</p>
                            <p class="text-[11px] text-ink-secondary mt-1">${isEn ? 'Ecto mass meals, Endo insulin reset & cardio' : '外胚增肌配餐、内胚控糖战术与靶心率'}</p>
                        </button>

                        <button onclick="app.openDomain('domain-longevity')" class="cursor-pointer text-left p-4 rounded-2xl bg-surface border border-subtle-border hover:border-emerald-500/60 p-4 transition-all group shadow-xs">
                            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold mb-1">
                                <i class="ri-calculator-line text-base"></i>
                                <span>${isEn ? 'LBM & Protein Calc' : '瘦体重与终身维持'}</span>
                            </div>
                            <p class="text-xs text-ink font-serif font-bold">${isEn ? 'Interactive LBM Model' : '交互式瘦体重精准测算器'}</p>
                            <p class="text-[11px] text-ink-secondary mt-1">${isEn ? 'Weight & Body Fat Multipliers' : '输入体重与体脂自动运算'}</p>
                        </button>
                    </div>
                </div>

            </div>
        `;
    },

    /**
     * 渲染单领域详尽阅读与实战页面 (Domain Reader)
     * 重要：顶部导航采用文档流静态布局，严禁 sticky 浮动，彻底消除阅读遮挡！
     */
    renderDomainViewHTML: (app, domainId) => {
        const domain = getDomainData(domainId);
        const lang = app.state.language || app.state.bookLanguage || 'zh';
        const isEn = lang === 'en';

        if (!domain) {
            return `
                <div class="p-12 text-center text-ink-secondary space-y-4">
                    <h2 class="text-xl font-serif font-bold text-ink">${isEn ? 'Domain Not Found' : '领域未找到'}</h2>
                    <button onclick="app.openTheory()" class="px-4 py-2 rounded-xl bg-accent text-white text-xs font-medium">
                        ${isEn ? 'Back to Theory Overview' : '返回理论总览'}
                    </button>
                </div>
            `;
        }

        // 查找上一领域与下一领域
        const currentIndex = THEORY_DOMAINS.findIndex(d => d.id === domainId);
        const prevDomain = currentIndex > 0 ? THEORY_DOMAINS[currentIndex - 1] : null;
        const nextDomain = currentIndex < THEORY_DOMAINS.length - 1 ? THEORY_DOMAINS[currentIndex + 1] : null;

        // 领域三专属双引擎切换（动作工坊 vs 体型定制）
        const actionTab = app.state.actionTab || 'all';
        // 当前活动体型标签
        const somatotypeTab = app.state.somatotypeTab || 'all';
        // 当前活动肌群过滤
        const exerciseFilter = app.state.exerciseFilter || 'all';

        return `
            <div class="space-y-8 pb-20 animate-fade-in select-text">

                <!-- Reader Navigation & Language Bar: Static document flow (NO sticky, NO floating overlay!) -->
                <div class="flex items-center justify-between border-b border-subtle-border pb-4 transition-colors">
                    <button onclick="app.openTheory()" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-mono text-ink-secondary hover:text-ink transition-colors">
                        <i class="ri-arrow-left-s-line text-sm text-accent"></i>
                        <span>${isEn ? 'Theory Overview' : '理论总览'}</span>
                    </button>

                    <!-- Language Mode Switcher [中文 | EN] - NO BILINGUAL MIXING -->
                    <div class="flex items-center p-0.5 rounded-xl bg-subtle-fill border border-subtle-border text-xs font-mono">
                        <button onclick="app.setLanguage('zh')" class="cursor-pointer px-3 py-1 rounded-lg transition-all ${!isEn ? 'bg-surface text-accent font-bold shadow-xs' : 'text-ink-secondary hover:text-ink'}">
                            中文
                        </button>
                        <button onclick="app.setLanguage('en')" class="cursor-pointer px-3 py-1 rounded-lg transition-all ${isEn ? 'bg-surface text-accent font-bold shadow-xs' : 'text-ink-secondary hover:text-ink'}">
                            EN
                        </button>
                    </div>

                    <!-- Domain Sequence Indicator -->
                    <span class="text-xs font-mono text-ink-secondary">
                        ${domain.badge} / 05
                    </span>
                </div>

                <!-- Domain Header -->
                <header class="space-y-3 border-b border-subtle-border pb-6">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-accent/10 text-accent">
                            ${domain.badge}
                        </span>
                        <span class="text-[11px] font-mono text-ink-secondary px-2 py-0.5 rounded bg-subtle-fill border border-subtle-border">
                            ${bookView.getText(domain.category, lang)}
                        </span>
                        <span class="text-[11px] font-mono text-ink-secondary px-2 py-0.5 rounded bg-subtle-fill border border-subtle-border">
                            ${bookView.getText(domain.provenance, lang)}
                        </span>
                        <span class="text-[11px] font-mono text-ink-secondary">
                            <i class="ri-time-line"></i> ${bookView.getText(domain.readTime, lang)}
                        </span>
                    </div>

                    <h1 class="text-2xl sm:text-4xl font-bold font-serif text-ink tracking-tight leading-tight">
                        ${bookView.getText(domain.title, lang)}
                    </h1>

                    <p class="text-sm sm:text-base text-ink-secondary font-sans leading-relaxed">
                        ${bookView.getText(domain.subtitle, lang)}
                    </p>
                </header>

                <!-- Steve Zim Quote Card -->
                ${domain.quote ? `
                <div class="p-5 rounded-2xl bg-surface border-l-4 border-accent border-y border-r border-subtle-border space-y-2 shadow-xs">
                    <div class="flex items-start gap-2.5 text-accent">
                        <i class="ri-double-quotes-l text-xl shrink-0 mt-0.5"></i>
                        <p class="text-sm sm:text-base font-serif italic text-ink leading-relaxed">
                            ${bookView.getText(domain.quote, lang)}
                        </p>
                    </div>
                    <div class="text-right text-[11px] font-mono text-ink-secondary font-bold tracking-wider">
                        — ${domain.quote.author || 'Steve Zim'}
                    </div>
                </div>
                ` : ''}

                <!-- Executive Summary -->
                <div class="space-y-2.5 bg-subtle-fill/60 border border-subtle-border rounded-2xl p-5">
                    <div class="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent">
                        <i class="ri-sparkling-2-line"></i>
                        <span>${isEn ? 'Executive Summary & Methodological Focus' : '领域要义与方法论聚焦'}</span>
                    </div>
                    <div class="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                        ${bookView.parseMarkdown(bookView.getText(domain.summary, lang))}
                    </div>
                </div>

                <!-- Key Principles Cards -->
                ${domain.keyPrinciples ? `
                <div class="space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-ink-secondary font-mono">
                        ${isEn ? 'Core Domain Principles' : '核心法则与行动公理'}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        ${domain.keyPrinciples.map(p => `
                            <div class="p-4 rounded-xl bg-surface border border-subtle-border space-y-2 shadow-xs">
                                <div class="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                    <i class="${p.icon} text-sm"></i>
                                </div>
                                <h4 class="font-serif font-bold text-ink text-sm">
                                    ${bookView.getText(p.title, lang)}
                                </h4>
                                <div class="text-xs text-ink-secondary leading-relaxed font-sans">
                                    ${bookView.parseMarkdown(bookView.getText(p.desc, lang))}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Domain 03 特别交互：体型专属路线筛选 (Somatotype Route Switcher) -->
                ${domainId === 'domain-somatotypes' ? `
                    <div class="bg-surface border-2 border-accent/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle-border pb-3">
                            <div class="space-y-0.5">
                                <div class="flex items-center gap-2">
                                    <i class="ri-user-settings-line text-accent text-base"></i>
                                    <h3 class="font-serif font-bold text-ink text-sm sm:text-base">
                                        ${isEn ? 'Somatotype Route Switcher' : '三大体型专属路线筛选'}
                                    </h3>
                                </div>
                                <p class="text-xs text-ink-secondary">
                                    ${isEn ? 'Select your body type from the wrist test to view tailored 4-week schedules:' : '手腕骨突自测诊断后，一键聚焦你的专属 4 周进阶课表：'}
                                </p>
                            </div>
                            <button onclick="app.openDomain('domain-exercises')" class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-subtle-fill hover:bg-subtle-border border border-subtle-border text-xs font-mono text-ink transition-all self-start sm:self-auto shadow-2xs">
                                <i class="ri-boxing-line text-accent"></i>
                                <span>${isEn ? 'Exercise Workshop (50 Specs) ->' : '查阅 50 大动作技术库 ->'}</span>
                            </button>
                        </div>

                        <!-- Somatotype Filter Chips -->
                        <div class="flex flex-wrap gap-2 text-xs font-mono">
                            ${[
                    { id: 'all', zh: '全部路线 (完整纵览)', en: 'All Routes (Complete)' },
                    { id: 'ecto', zh: '外胚型路线 (Ectomorph)', en: 'Ectomorph' },
                    { id: 'meso', zh: '中胚型路线 (Mesomorph)', en: 'Mesomorph' },
                    { id: 'endo', zh: '内胚型路线 (Endomorph)', en: 'Endomorph' }
                ].map(tab => {
                    const isActive = somatotypeTab === tab.id;
                    return `
                                    <button onclick="app.setSomatotypeTab('${tab.id}')" class="cursor-pointer px-3 py-1.5 rounded-xl border transition-all ${isActive ? 'bg-accent text-white dark:text-[#0b0f14] font-bold border-accent shadow-2xs' : 'bg-subtle-fill border-subtle-border text-ink-secondary hover:text-ink'}">
                                        ${isEn ? tab.en : tab.zh}
                                    </button>
                                `;
                }).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Domain 04 特别交互：50 大动作技术检索工坊 (Exercise Workshop & Instant Search) -->
                ${domainId === 'domain-exercises' ? `
                    <div class="bg-surface border-2 border-accent/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle-border pb-3">
                            <div class="space-y-0.5">
                                <div class="flex items-center gap-2">
                                    <i class="ri-boxing-line text-accent text-base"></i>
                                    <h3 class="font-serif font-bold text-ink text-sm sm:text-base">
                                        ${isEn ? 'Master 50 Photo Exercise Workshop' : '50 大原著动作技术规格工坊'}
                                    </h3>
                                </div>
                                <p class="text-xs text-ink-secondary">
                                    ${isEn ? 'Instant search across 50 exercises by name, muscle, equipment, and cues:' : '支持按动作名称、目标部位、器械（哑铃/瑞士球/拉力器）及发力口诀全息即时检索：'}
                                </p>
                            </div>
                            <button onclick="app.openDomain('domain-somatotypes')" class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-subtle-fill hover:bg-subtle-border border border-subtle-border text-xs font-mono text-ink transition-all self-start sm:self-auto shadow-2xs">
                                <i class="ri-body-scan-line text-accent"></i>
                                <span>${isEn ? '<- Somatotype Schedules' : '<- 查看体型定制课表'}</span>
                            </button>
                        </div>

                        <!-- Instant Search Input Bar -->
                        <div class="relative flex items-center">
                            <div class="absolute left-3.5 text-ink-secondary/70 pointer-events-none flex items-center">
                                <i class="ri-search-line text-sm text-accent"></i>
                            </div>
                            <input
                                id="exercise-search-input"
                                type="text"
                                value="${app.state.exerciseSearchQuery || ''}"
                                oninput="app.handleExerciseSearch(this.value)"
                                placeholder="${isEn ? 'Search 50 exercises by name, muscle, equipment (e.g. Lunge, Fly, Swiss Ball, Triceps)...' : '检索 50 个动作名称、目标部位、器械（如：箭步、飞鸟、瑞士球、三头、卷腹...）'}"
                                class="w-full pl-9 pr-28 py-2.5 rounded-xl bg-subtle-fill border border-subtle-border focus:border-accent focus:bg-surface text-ink text-xs sm:text-sm font-sans transition-all placeholder:text-ink-secondary/50 focus:outline-hidden shadow-2xs"
                            />
                            <div class="absolute right-2.5 flex items-center gap-1.5">
                                <span id="exercise-search-counter" class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface border border-subtle-border text-ink-secondary">
                                    ${isEn ? '50 / 50' : '50 / 50 动作'}
                                </span>
                                <button id="exercise-search-clear-btn"
                                        onclick="app.clearExerciseSearch()"
                                        style="${app.state.exerciseSearchQuery ? 'display: inline-flex;' : 'display: none;'}"
                                        class="cursor-pointer text-ink-secondary hover:text-ink p-1 rounded-md hover:bg-subtle-fill transition-colors"
                                        title="${isEn ? 'Clear' : '清空'}">
                                    <i class="ri-close-line text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Muscle Group Quick Filters -->
                        <div class="space-y-1.5">
                            <div class="flex items-center justify-between text-xs font-mono">
                                <span class="text-ink-secondary font-bold flex items-center gap-1">
                                    <i class="ri-filter-3-line text-accent"></i> ${isEn ? 'Filter by Muscle Group:' : '按肌群快速筛选:'}
                                </span>
                                <span class="text-ink-secondary/70">${isEn ? '50 Exercise Specs' : '50 个动作规格'}</span>
                            </div>
                            <div class="flex flex-wrap gap-1.5 text-xs font-mono">
                                ${[
                    { id: 'all', zh: '全部 (50)', en: 'All (50)' },
                    { id: 'legs', zh: '臀腿 (10)', en: 'Legs (10)' },
                    { id: 'back', zh: '背阔 (6)', en: 'Back (6)' },
                    { id: 'shoulders', zh: '肩部 (6)', en: 'Shoulders (6)' },
                    { id: 'chest', zh: '胸部 (6)', en: 'Chest (6)' },
                    { id: 'arms', zh: '手臂 (11)', en: 'Arms (11)' },
                    { id: 'abs', zh: '核心 (11)', en: 'Abs (11)' }
                ].map(filter => {
                    const isActive = exerciseFilter === filter.id;
                    return `
                                        <button onclick="app.setExerciseFilter('${filter.id}')" class="cursor-pointer px-2.5 py-1 rounded-lg border transition-all ${isActive ? 'bg-accent text-white dark:text-[#0b0f14] font-bold border-accent shadow-2xs' : 'bg-subtle-fill border-subtle-border text-ink-secondary hover:text-ink'}">
                                            ${isEn ? filter.en : filter.zh}
                                        </button>
                                    `;
                }).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Domain Main Sections with Full Markdown Parsing -->
                <div id="exercise-workshop-container" class="space-y-8">
                ${domain.sections ? domain.sections.map((sec, secIdx) => {
                    const titleStr = (sec.title.zh || sec.title.en || '').toLowerCase();

                    // Domain 03 (Somatotypes) 专属路线过滤
                    if (domainId === 'domain-somatotypes' && somatotypeTab !== 'all') {
                        const isDiagnostic = titleStr.includes('诊断') || titleStr.includes('自测') || titleStr.includes('对照') || titleStr.includes('剖析') || titleStr.includes('启动期') || titleStr.includes('schedules') || titleStr.includes('突破平台期');
                        if (!isDiagnostic) {
                            if (somatotypeTab === 'ecto' && !titleStr.includes('外胚型') && !titleStr.includes('ectomorph')) return '';
                            if (somatotypeTab === 'meso' && !titleStr.includes('中胚型') && !titleStr.includes('mesomorph')) return '';
                            if (somatotypeTab === 'endo' && !titleStr.includes('内胚型') && !titleStr.includes('endomorph')) return '';
                        }
                    }

                    // Domain 04 (Exercises) 动作库内部肌群过滤
                    if (domainId === 'domain-exercises' && exerciseFilter !== 'all' && sec.exercises) {
                        if (exerciseFilter === 'legs' && !titleStr.includes('臀部') && !titleStr.includes('下肢') && !titleStr.includes('legs')) return '';
                        if (exerciseFilter === 'back' && !titleStr.includes('背部') && !titleStr.includes('back')) return '';
                        if (exerciseFilter === 'shoulders' && !titleStr.includes('肩部') && !titleStr.includes('三角肌') && !titleStr.includes('shoulders')) return '';
                        if (exerciseFilter === 'chest' && !titleStr.includes('胸部') && !titleStr.includes('chest')) return '';
                        if (exerciseFilter === 'arms' && !titleStr.includes('手臂') && !titleStr.includes('二头') && !titleStr.includes('三头') && !titleStr.includes('arms')) return '';
                        if (exerciseFilter === 'abs' && !titleStr.includes('腹肌') && !titleStr.includes('核心') && !titleStr.includes('abdominals')) return '';
                    }

                    const sectionContent = bookView.getText(sec.content, lang);
                    return `
                    <section class="${sec.exercises ? 'exercise-group-section ' : ''}space-y-4 pt-2">
                        <h2 class="text-lg sm:text-xl font-bold font-serif text-ink tracking-tight border-b border-subtle-border pb-2 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-accent shrink-0"></span>
                            <span>${bookView.getText(sec.title, lang)}</span>
                        </h2>

                        ${sectionContent ? `
                            <div class="text-sm sm:text-base text-ink leading-relaxed space-y-3 font-sans">
                                ${bookView.parseMarkdown(sectionContent)}
                            </div>
                        ` : ''}

                        <!-- Diagram Display (e.g. Chapter 3 Page 39 Nutrition Plate) -->
                        ${sec.diagram ? `
                            <div class="p-4 sm:p-6 bg-surface border border-subtle-border rounded-2xl space-y-3 text-center shadow-xs">
                                <div class="max-w-md mx-auto rounded-xl overflow-hidden border border-subtle-border bg-white cursor-zoom-in" onclick="app.openImageModal('${sec.diagram.image}', '${sec.diagram.alt}')">
                                    <img src="${sec.diagram.image}" alt="${sec.diagram.alt}" class="w-full h-auto object-contain p-2 hover:scale-[1.02] transition-transform" />
                                </div>
                                <p class="text-xs text-ink-secondary font-mono">
                                    <i class="ri-image-line"></i> ${bookView.getText(sec.diagram.caption, lang)}
                                </p>
                            </div>
                        ` : ''}

                        <!-- Formula Images Display (e.g. Chapter 11 Page 193 Formulas) -->
                        ${sec.formulaImages ? `
                            <div class="p-5 bg-surface border border-subtle-border rounded-2xl space-y-4 shadow-xs">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-ink-secondary font-mono">
                                    ${isEn ? 'Original Calculation Formulas' : '原书计算公式原版图解'}
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    ${sec.formulaImages.map(img => `
                                        <div class="p-3 bg-white rounded-xl border border-subtle-border text-center">
                                            <img src="${img.image}" alt="${img.alt}" class="max-h-16 mx-auto object-contain cursor-zoom-in" onclick="app.openImageModal('${img.image}', '${img.alt}')" />
                                            <p class="text-[11px] text-neutral-600 mt-2 font-mono">${bookView.getText(img.caption, lang)}</p>
                                        </div>
                                    `).join('')}
                                </div>

                                <!-- Interactive LBM Calculator Widget -->
                                <div class="mt-4 pt-4 border-t border-subtle-border">
                                    ${bookView.renderLBMCalculatorWidget(app)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Structured Table Display -->
                        ${sec.table ? `
                            <div class="overflow-x-auto rounded-2xl border border-subtle-border bg-surface shadow-xs">
                                <table class="w-full text-left border-collapse text-xs sm:text-sm">
                                    <thead>
                                        <tr class="bg-subtle-fill border-b border-subtle-border text-ink font-mono text-[11px] uppercase tracking-wider">
                                            ${(isEn ? (sec.table.headers.en || sec.table.headers.zh) : (sec.table.headers.zh || sec.table.headers.en)).map(h => `
                                                <th class="p-3.5 font-bold">${h}</th>
                                            `).join('')}
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-subtle-border text-ink">
                                        ${sec.table.rows.map(row => `
                                            <tr class="hover:bg-subtle-fill/40 transition-colors">
                                                ${Object.values(row).map(cell => `
                                                    <td class="p-3.5 leading-relaxed font-sans">
                                                        ${bookView.parseMarkdown(bookView.getText(cell, lang))}
                                                    </td>
                                                `).join('')}
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}

                        <!-- Master Exercise Cards Library (For Domain 03) -->
                        ${sec.exercises ? `
                            <div class="space-y-4 pt-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                                        ${isEn ? 'Exercise Technical Specifications' : '动作技术规格库'}
                                    </span>
                                    <span class="text-xs text-ink-secondary font-mono">
                                        ${isEn ? `${sec.exercises.length} Exercises` : `${sec.exercises.length} 个动作`}
                                    </span>
                                </div>
                                <div class="grid grid-cols-1 gap-4">
                                    ${sec.exercises.map((ex, exIdx) => `
                                        <div class="exercise-item-card p-5 sm:p-6 bg-surface border border-subtle-border hover:border-accent/40 rounded-2xl shadow-xs space-y-4 transition-all"
                                             data-search-index="${bookView.getExerciseSearchIndex(ex)}">
                                            
                                            <!-- Exercise Header & Badges -->
                                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle-border pb-3">
                                                <div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-xs font-mono font-bold text-accent">#${exIdx + 1}</span>
                                                        <h3 class="text-lg sm:text-xl font-bold font-serif text-ink tracking-tight">
                                                            ${bookView.getText(ex.name, lang)}
                                                        </h3>
                                                    </div>
                                                    ${!isEn && ex.name.en ? `<span class="text-xs font-mono text-ink-secondary italic">${ex.name.en}</span>` : ''}
                                                </div>
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <span class="text-xs font-mono px-2.5 py-1 rounded-md bg-accent/10 text-accent font-bold">
                                                        ${bookView.getText(ex.target, lang)}
                                                    </span>
                                                    <span class="text-xs font-mono px-2 py-0.5 rounded-md bg-subtle-fill text-ink-secondary">
                                                        ${ex.sets_reps}
                                                    </span>
                                                    <span class="text-xs font-mono px-2 py-0.5 rounded-md bg-subtle-fill text-ink-secondary">
                                                        ${isEn ? `Tempo: ${ex.tempo}` : `节奏: ${ex.tempo}`}
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- Photos + Instructions Grid -->
                                            <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                                                
                                                <!-- Action Photos Gallery -->
                                                <div class="md:col-span-5 flex flex-wrap gap-2 justify-center">
                                                    ${ex.images.map(img => `
                                                        <div class="rounded-xl overflow-hidden border border-subtle-border bg-white cursor-zoom-in max-w-[140px] sm:max-w-[170px]" onclick="app.openImageModal('${img}', '${bookView.getText(ex.name, lang)}')">
                                                            <img src="${img}" alt="${bookView.getText(ex.name, lang)}" class="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" />
                                                        </div>
                                                    `).join('')}
                                                </div>

                                                <!-- Setup & Cues & Mistakes -->
                                                <div class="md:col-span-7 space-y-3 text-xs sm:text-sm">
                                                    
                                                    <!-- Setup -->
                                                    <div class="space-y-1">
                                                        <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1">
                                                            <i class="ri-focus-2-line text-accent"></i> ${isEn ? 'Setup & Position' : '动作准备 (Setup)'}
                                                        </span>
                                                        <div class="text-ink leading-relaxed font-sans">${bookView.parseMarkdown(bookView.getText(ex.setup, lang))}</div>
                                                    </div>

                                                    <!-- Cues -->
                                                    <div class="space-y-1">
                                                        <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1">
                                                            <i class="ri-flashlight-line text-amber-500"></i> ${isEn ? 'Execution Cues' : '实操口诀 (Cues)'}
                                                        </span>
                                                        <div class="text-ink font-medium leading-relaxed font-sans">${bookView.parseMarkdown(bookView.getText(ex.cues, lang))}</div>
                                                    </div>

                                                    <!-- Mistakes & Fix -->
                                                    ${ex.mistakes ? `
                                                    <div class="p-3 rounded-xl bg-subtle-fill/80 border border-subtle-border space-y-1.5">
                                                        <div class="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 font-bold text-xs">
                                                            <i class="ri-error-warning-line"></i>
                                                            <span>${isEn ? 'Common Error:' : '常见错误:'} ${bookView.getText(ex.mistakes.error, lang)}</span>
                                                        </div>
                                                        <div class="flex items-start gap-1.5 text-xs text-ink-secondary font-sans">
                                                            <i class="ri-check-line text-emerald-500 font-bold shrink-0 mt-0.5"></i>
                                                            <span>${isEn ? 'Correction:' : '纠正对策:'} ${bookView.getText(ex.mistakes.fix, lang)}</span>
                                                        </div>
                                                    </div>
                                                    ` : ''}

                                                </div>
                                            </div>

                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                    </section>
                    `;
                }).join('') : ''}

                    <!-- Empty State for Search -->
                    <div id="exercise-search-empty-state" class="hidden p-8 sm:p-12 text-center bg-surface border border-dashed border-subtle-border rounded-2xl space-y-3">
                        <div class="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto text-xl">
                            <i class="ri-search-eye-line"></i>
                        </div>
                        <h3 class="text-sm sm:text-base font-bold font-serif text-ink">
                            ${isEn ? 'No exercises found matching "' : '未找到匹配“'}<span class="search-query-text text-accent font-mono font-bold"></span>${isEn ? '"' : '”的动作'}
                        </h3>
                        <p class="text-xs text-ink-secondary max-w-sm mx-auto">
                            ${isEn ? 'Try searching by body part (e.g. Glutes, Deltoid), equipment (e.g. Swiss Ball, Dumbbell), or movement type (e.g. Lunge, Curl).' : '尝试输入肌群（如：臀部、三角肌、三头）、器械（如：瑞士球、哑铃）或动作名称（如：箭步、飞鸟、卷腹）。'}
                        </p>
                        <button onclick="app.clearExerciseSearch()" class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white dark:text-[#0b0f14] text-xs font-mono font-medium shadow-xs hover:bg-accent/90 transition-all">
                            <i class="ri-refresh-line"></i> ${isEn ? 'Reset Search' : '清空搜索'}
                        </button>
                    </div>
                </div>

                <!-- Domain Navigation Footer -->
                <nav class="border-t border-subtle-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    ${prevDomain ? `
                        <button onclick="app.openDomain('${prevDomain.id}')" class="cursor-pointer w-full sm:w-auto px-5 py-3 rounded-xl bg-surface border border-subtle-border hover:border-accent/60 transition-all flex items-center gap-2 text-xs font-mono text-ink active:scale-95 shadow-xs">
                            <i class="ri-arrow-left-line text-accent"></i>
                            <div class="text-left">
                                <span class="block text-[10px] text-ink-secondary">${isEn ? 'Previous Domain' : '上一领域'}</span>
                                <span class="font-serif font-bold text-sm text-ink truncate">${bookView.getText(prevDomain.title, lang)}</span>
                            </div>
                        </button>
                    ` : `<div></div>`}

                    <button onclick="app.openTheory()" class="cursor-pointer px-4 py-2 rounded-xl bg-subtle-fill hover:bg-subtle-border text-xs font-mono text-ink transition-colors">
                        ${isEn ? 'Back to Theory Overview' : '返回理论总览'}
                    </button>

                    ${nextDomain ? `
                        <button onclick="app.openDomain('${nextDomain.id}')" class="cursor-pointer w-full sm:w-auto px-5 py-3 rounded-xl bg-surface border border-subtle-border hover:border-accent/60 transition-all flex items-center justify-end gap-2 text-xs font-mono text-ink active:scale-95 shadow-xs">
                            <div class="text-right">
                                <span class="block text-[10px] text-ink-secondary">${isEn ? 'Next Domain' : '下一领域'}</span>
                                <span class="font-serif font-bold text-sm text-ink truncate">${bookView.getText(nextDomain.title, lang)}</span>
                            </div>
                            <i class="ri-arrow-right-line text-accent"></i>
                        </button>
                    ` : `<div></div>`}
                </nav>

            </div>
        `;
    },

    /**
     * 兼容性适配器
     */
    renderBookHomeHTML: (app) => bookView.renderTheoryHomeHTML(app),
    renderStageViewHTML: (app, domainId) => bookView.renderDomainViewHTML(app, domainId),
    renderChapterViewHTML: (app, id) => {
        const domainId = app.mapToDomainId ? app.mapToDomainId(id) : 'domain-biomechanics';
        return bookView.renderDomainViewHTML(app, domainId);
    },

    /**
     * 交互式瘦体重 (LBM) 与蛋白质预算测算组件 (Domain 05)
     */
    renderLBMCalculatorWidget: (app) => {
        const lang = app.state.language || app.state.bookLanguage || 'zh';
        const isEn = lang === 'en';

        const calc = app.state.lbmCalc || {
            unit: localStorage.getItem('zim_calc_unit') || 'kg',
            weight: (localStorage.getItem('zim_calc_unit') === 'lbs') ? 154 : 70,
            bf: 18
        };
        const unit = calc.unit || 'kg';
        const isKg = unit === 'kg';

        let weightKg, weightLbs;
        if (isKg) {
            weightKg = parseFloat(calc.weight || 70);
            weightLbs = parseFloat((weightKg * 2.20462).toFixed(1));
        } else {
            weightLbs = parseFloat(calc.weight || 154);
            weightKg = parseFloat((weightLbs / 2.20462).toFixed(1));
        }

        const bf = parseFloat(calc.bf || 18);
        const fatKg = (weightKg * (bf / 100)).toFixed(1);
        const fatLbs = (weightLbs * (bf / 100)).toFixed(1);
        const lbmKg = (weightKg - fatKg).toFixed(1);
        const lbmLbs = (weightLbs - fatLbs).toFixed(1);

        // Daily Water Hydration (Zim's formulas: kg * 33ml / lbs / 2 oz)
        const waterLiters = (weightKg * 0.033).toFixed(1);
        const waterOz = Math.round(weightLbs / 2);

        // Daily Target Protein Budget
        const fatLossPro = Math.round(lbmLbs * 1.0);
        const tonePro = Math.round(lbmLbs * 1.25);
        const massPro = Math.round(lbmLbs * 1.5);

        return `
            <div id="lbm-calculator-widget" class="bg-subtle-fill/50 rounded-2xl p-4 sm:p-5 border border-subtle-border space-y-4">
                
                <!-- Calculator Header with Unit Toggle Switch -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-subtle-border pb-3">
                    <div class="flex items-center gap-2">
                        <i class="ri-calculator-line text-accent text-lg"></i>
                        <h4 class="font-serif font-bold text-ink text-sm sm:text-base">
                            ${isEn ? 'Steve Zim Lean Body Mass & Protein Calculator' : 'Steve Zim 瘦体重与蛋白质精准测算器'}
                        </h4>
                    </div>

                    <!-- Unit Switcher [ KG (默认) | 磅 (lbs) ] -->
                    <div class="flex items-center p-0.5 rounded-xl bg-subtle-fill border border-subtle-border text-xs font-mono self-start sm:self-auto shadow-2xs">
                        <button onclick="app.setLBMUnit('kg')" class="cursor-pointer px-3 py-1 rounded-lg transition-all ${isKg ? 'bg-surface text-accent font-bold shadow-xs' : 'text-ink-secondary hover:text-ink'}">
                            KG (${isEn ? 'Metric' : '公斤/默认'})
                        </button>
                        <button onclick="app.setLBMUnit('lbs')" class="cursor-pointer px-3 py-1 rounded-lg transition-all ${!isKg ? 'bg-surface text-accent font-bold shadow-xs' : 'text-ink-secondary hover:text-ink'}">
                            ${isEn ? 'lbs (Imperial)' : '磅 lbs (英制)'}
                        </button>
                    </div>
                </div>

                <!-- Primary Direct Numeric Inputs & Companion Sliders -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <!-- 1. Body Weight Input Card -->
                    <div class="p-3.5 bg-surface rounded-xl border border-subtle-border space-y-2.5 shadow-2xs">
                        <div class="flex items-center justify-between">
                            <label for="lbm-weight-input" class="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
                                <i class="ri-scales-3-line text-accent text-sm"></i>
                                <span>${isEn ? 'Body Weight' : '总体重'}</span>
                            </label>
                            <span id="lbm-weight-conversion" class="text-[11px] font-mono text-ink-secondary">
                                ≈ ${isKg ? `${weightLbs} lbs` : `${weightKg} kg`}
                            </span>
                        </div>
                        
                        <!-- Direct Numerical Input + Steppers -->
                        <div class="flex items-center gap-2">
                            <button type="button"
                                    onclick="app.stepLBMVal('weight', ${isKg ? -0.5 : -1})" 
                                    class="cursor-pointer w-9 h-9 rounded-lg bg-subtle-fill hover:bg-accent hover:text-white dark:hover:text-[#0b0f14] border border-subtle-border flex items-center justify-center text-ink font-bold transition-all active:scale-95" 
                                    title="${isEn ? 'Decrease' : '微调减少'}">
                                <i class="ri-subtract-line text-sm"></i>
                            </button>
                            <div class="relative flex-1">
                                <input
                                    id="lbm-weight-input"
                                    type="number"
                                    min="${isKg ? '30' : '66'}"
                                    max="${isKg ? '250' : '550'}"
                                    step="${isKg ? '0.5' : '1'}"
                                    value="${isKg ? weightKg : weightLbs}"
                                    oninput="app.updateLBMCalc('weight', this.value)"
                                    class="w-full text-center font-mono font-bold text-base sm:text-lg text-ink bg-subtle-fill border border-subtle-border rounded-lg py-1.5 pl-3 pr-10 focus:outline-hidden focus:border-accent focus:bg-surface transition-all"
                                    placeholder="${isKg ? '70.0' : '154'}"
                                />
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-accent pointer-events-none select-none">
                                    ${isKg ? 'KG' : 'lbs'}
                                </span>
                            </div>
                            <button type="button" 
                                    onclick="app.stepLBMVal('weight', ${isKg ? 0.5 : 1})" 
                                    class="cursor-pointer w-9 h-9 rounded-lg bg-subtle-fill hover:bg-accent hover:text-white dark:hover:text-[#0b0f14] border border-subtle-border flex items-center justify-center text-ink font-bold transition-all active:scale-95" 
                                    title="${isEn ? 'Increase' : '微调增加'}">
                                <i class="ri-add-line text-sm"></i>
                            </button>
                        </div>

                        <!-- Companion Visual Range Slider -->
                        <div class="pt-0.5 space-y-1">
                            <input
                                id="lbm-weight-slider"
                                type="range"
                                min="${isKg ? '40' : '90'}"
                                max="${isKg ? '150' : '330'}"
                                step="${isKg ? '0.5' : '1'}"
                                value="${isKg ? weightKg : weightLbs}"
                                oninput="app.updateLBMCalc('weight', this.value)"
                                class="w-full h-1.5 bg-subtle-border rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                            <div class="flex justify-between text-[10px] font-mono text-ink-secondary/60">
                                <span>${isKg ? '40 kg' : '90 lbs'}</span>
                                <span class="text-ink-secondary/80">${isEn ? 'Direct typing or slide' : '可直接键盘输入或拖动'}</span>
                                <span>${isKg ? '150 kg' : '330 lbs'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Body Fat % Input Card -->
                    <div class="p-3.5 bg-surface rounded-xl border border-subtle-border space-y-2.5 shadow-2xs">
                        <div class="flex items-center justify-between">
                            <label for="lbm-bf-input" class="text-xs font-mono font-bold text-ink flex items-center gap-1.5">
                                <i class="ri-percent-line text-accent text-sm"></i>
                                <span>${isEn ? 'Body Fat Percentage' : '体脂率'}</span>
                            </label>
                            <span id="lbm-bf-hint" class="text-[11px] font-mono text-ink-secondary">
                                ${isEn ? 'Target: 10-14% (M) / 16-20% (F)' : '标靶: 男 10-14% · 女 16-20%'}
                            </span>
                        </div>
                        
                        <!-- Direct Numerical Input + Steppers -->
                        <div class="flex items-center gap-2">
                            <button type="button" 
                                    onclick="app.stepLBMVal('bf', -0.5)" 
                                    class="cursor-pointer w-9 h-9 rounded-lg bg-subtle-fill hover:bg-accent hover:text-white dark:hover:text-[#0b0f14] border border-subtle-border flex items-center justify-center text-ink font-bold transition-all active:scale-95" 
                                    title="${isEn ? 'Decrease (-0.5%)' : '微调减少 (-0.5%)'}">
                                <i class="ri-subtract-line text-sm"></i>
                            </button>
                            <div class="relative flex-1">
                                <input
                                    id="lbm-bf-input"
                                    type="number"
                                    min="3"
                                    max="60"
                                    step="0.5"
                                    value="${bf}"
                                    oninput="app.updateLBMCalc('bf', this.value)"
                                    class="w-full text-center font-mono font-bold text-base sm:text-lg text-ink bg-subtle-fill border border-subtle-border rounded-lg py-1.5 pl-3 pr-8 focus:outline-hidden focus:border-accent focus:bg-surface transition-all"
                                    placeholder="18.0"
                                />
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-accent pointer-events-none select-none">
                                    %
                                </span>
                            </div>
                            <button type="button" 
                                    onclick="app.stepLBMVal('bf', 0.5)" 
                                    class="cursor-pointer w-9 h-9 rounded-lg bg-subtle-fill hover:bg-accent hover:text-white dark:hover:text-[#0b0f14] border border-subtle-border flex items-center justify-center text-ink font-bold transition-all active:scale-95" 
                                    title="${isEn ? 'Increase (+0.5%)' : '微调增加 (+0.5%)'}">
                                <i class="ri-add-line text-sm"></i>
                            </button>
                        </div>

                        <!-- Companion Visual Range Slider -->
                        <div class="pt-0.5 space-y-1">
                            <input
                                id="lbm-bf-slider"
                                type="range"
                                min="5"
                                max="45"
                                step="0.5"
                                value="${bf}"
                                oninput="app.updateLBMCalc('bf', this.value)"
                                class="w-full h-1.5 bg-subtle-border rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                            <div class="flex justify-between text-[10px] font-mono text-ink-secondary/60">
                                <span>5%</span>
                                <span class="text-ink-secondary/80">${isEn ? 'Direct typing or slide' : '可直接键盘输入或拖动'}</span>
                                <span>45%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Calculated Output Cards (5 Cards) -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
                    
                    <!-- 1. LBM (Core Target) -->
                    <div class="p-3 rounded-xl bg-surface border-2 border-accent/40 text-center bg-accent/[0.04] shadow-xs flex flex-col justify-between">
                        <span class="block text-[10px] font-mono text-accent font-bold">${isEn ? 'Lean Body Mass (LBM)' : '纯瘦肌肉质量 (LBM)'}</span>
                        <div id="lbm-out-lbm" class="my-1">
                            <div class="text-base sm:text-lg font-bold font-mono text-accent whitespace-nowrap">${isKg ? `${lbmKg} kg` : `${lbmLbs} lbs`}</div>
                            <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${isKg ? `${lbmLbs} lbs` : `${lbmKg} kg`})</div>
                        </div>
                        <span class="block text-[10px] text-ink-secondary">${isEn ? 'Metabolic Base' : '决定基础代谢底盘'}</span>
                    </div>

                    <!-- 2. Fat Mass -->
                    <div class="p-3 rounded-xl bg-surface border border-subtle-border text-center shadow-xs flex flex-col justify-between">
                        <span class="block text-[10px] font-mono text-ink-secondary">${isEn ? 'Body Fat Mass' : '脂肪总重量'}</span>
                        <div id="lbm-out-fat" class="my-1">
                            <div class="text-base sm:text-lg font-bold font-mono text-ink whitespace-nowrap">${isKg ? `${fatKg} kg` : `${fatLbs} lbs`}</div>
                            <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${isKg ? `${fatLbs} lbs` : `${fatKg} kg`})</div>
                        </div>
                        <span class="block text-[10px] text-ink-secondary">${isEn ? 'No protein demand' : '不消耗蛋白质储备'}</span>
                    </div>

                    <!-- 3. Hollywood Toning -->
                    <div class="p-3 rounded-xl bg-surface border border-subtle-border text-center shadow-xs flex flex-col justify-between">
                        <span class="block text-[10px] font-mono text-ink-secondary">${isEn ? 'Hollywood Toning' : '好莱坞紧致塑形'}</span>
                        <div class="my-1">
                            <div id="lbm-out-tone" class="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                ${tonePro} ${isEn ? 'g / day' : '克/天'}
                            </div>
                            <div class="text-[11px] text-ink-secondary font-mono whitespace-nowrap">1.25g/lb · ${(1.25 * 2.20462).toFixed(1)}g/kg</div>
                        </div>
                        <span class="block text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">${isEn ? 'Dense definition' : '高致密度·防臃肿'}</span>
                    </div>

                    <!-- 4. Hypertrophy -->
                    <div class="p-3 rounded-xl bg-surface border border-subtle-border text-center shadow-xs flex flex-col justify-between">
                        <span class="block text-[10px] font-mono text-ink-secondary">${isEn ? 'Hypertrophy Mass' : '进阶增肌塑形'}</span>
                        <div class="my-1">
                            <div id="lbm-out-mass" class="text-base sm:text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                ${massPro} ${isEn ? 'g / day' : '克/天'}
                            </div>
                            <div class="text-[11px] text-ink-secondary font-mono whitespace-nowrap">1.5g/lb · ${(1.5 * 2.20462).toFixed(1)}g/kg</div>
                        </div>
                        <span class="block text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-mono">${isEn ? 'Maximum thickness' : '骨架增厚·围度突破'}</span>
                    </div>

                    <!-- 5. Daily Water -->
                    <div class="col-span-2 sm:col-span-1 p-3 rounded-xl bg-surface border border-subtle-border text-center shadow-xs flex flex-col justify-between">
                        <span class="block text-[10px] font-mono text-ink-secondary">${isEn ? 'Daily Hydration' : '每日细胞纯水量'}</span>
                        <div id="lbm-out-water" class="my-1">
                            <div class="text-base sm:text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 whitespace-nowrap">${isKg ? `${waterLiters} 升` : `${waterOz} oz`}</div>
                            <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${isKg ? `${waterOz} oz` : `${waterLiters} 升`})</div>
                        </div>
                        <span class="block text-[10px] text-ink-secondary font-mono">${isEn ? 'Weight ÷ 2 oz' : '33ml/kg · 磅÷2'}</span>
                    </div>
                </div>

                <!-- 差异对比备注文案 / Strategy Comparison Note -->
                <div class="mt-3 p-3.5 sm:p-4 rounded-xl bg-surface border border-subtle-border space-y-2.5 shadow-2xs">
                    <div class="flex items-center gap-2 font-bold font-mono text-xs sm:text-sm text-ink">
                        <i class="ri-scales-3-line text-accent"></i>
                        <span>${isEn ? 'Physique Route Differences: Hollywood Toning vs. Hypertrophy' : '好莱坞紧致塑形 vs 进阶增肌塑形：核心差异与选择指南'}</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                        <!-- 好莱坞紧致塑形 -->
                        <div class="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <span class="font-bold font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                    <i class="ri-sparkling-fill text-xs"></i>
                                    ${isEn ? 'Hollywood Toning (1.25g / lb LBM)' : '好莱坞紧致塑形（1.25g / 磅 LBM）'}
                                </span>
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                                    ${isEn ? 'Standard Maintenance' : '黄金标准 · 防臃肿'}
                                </span>
                            </div>
                            <div class="text-[11px] text-ink-secondary font-sans space-y-1">
                                <p>• <b>${isEn ? 'Core Objective' : '核心目标'}</b>：${isEn ? 'High-density muscle definition and razor-sharp red-carpet lines (V-taper & Hourglass). Never inflates excessive bulk so clothing and suits drape impeccably.' : '追求极高肌肉致密度与红毯线条（倒三角与沙漏比例），<b>绝不盲目做大围度</b>，确保穿西装、衬衫或礼服时肩背平整挺拔，腰身纤紧。'}</p>
                                <p>• <b>${isEn ? 'Best For' : '适用场景'}</b>：${isEn ? 'Mesomorphs maintaining form, Endomorphs stripping fat while staying tight, and professionals seeking a sharp, camera-ready silhouette.' : '中胚型维持期、内胚型减脂收紧期，以及希望保持穿衣显瘦、脱衣有肉的职场与出镜人群。'}</p>
                            </div>
                        </div>

                        <!-- 进阶增肌塑形 -->
                        <div class="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1.5">
                            <div class="flex items-center justify-between">
                                <span class="font-bold font-mono text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                                    <i class="ri-flashlight-fill text-xs"></i>
                                    ${isEn ? 'Advanced Hypertrophy (1.5g / lb LBM)' : '进阶增肌塑形（1.5g / 磅 LBM）'}
                                </span>
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold">
                                    ${isEn ? 'Frame Thickening' : '骨架增厚 · 围度突破'}
                                </span>
                            </div>
                            <div class="text-[11px] text-ink-secondary font-sans space-y-1">
                                <p>• <b>${isEn ? 'Core Objective' : '核心目标'}</b>：${isEn ? 'Breakthrough muscle cross-sectional area and skeletal frame broadening. Adds substantial contractile tissue to narrow frames.' : '突破肌肉横截面积与骨骼肌维度瓶颈，为偏窄骨架“实质性添砖加瓦”，显著拓宽背阔肌外沿与胸肩肉量厚度。'}</p>
                                <p>• <b>${isEn ? 'Best For' : '适用场景'}</b>：${isEn ? 'Ectomorph hardgainers in muscle-building phase, or anyone needing to expand narrow clavicles and add chest/lat thickness.' : '外胚型（天生消瘦、窄肩长肢）全力增肌增重阶段，或体脂已达标但自觉躯干单薄、需要增加视觉厚度的进阶期。'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 渲染高保真大图弹窗 (Lightbox Modal)
     */
    renderImageModalHTML: (app) => {
        const modal = app.state.selectedImageModal;
        if (!modal) return '';
        const lang = app.state.language || app.state.bookLanguage || 'zh';
        const isEn = lang === 'en';

        return `
            <div class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onclick="app.closeImageModal()">
                <div class="relative max-w-3xl w-full bg-surface border border-subtle-border rounded-2xl p-4 sm:p-6 shadow-2xl space-y-3" onclick="event.stopPropagation()">
                    <div class="flex items-center justify-between border-b border-subtle-border pb-3">
                        <h4 class="font-serif font-bold text-ink text-sm sm:text-base truncate">${modal.title || (isEn ? 'Photo Demonstration' : '动作实拍图解')}</h4>
                        <button onclick="app.closeImageModal()" class="cursor-pointer text-ink-secondary hover:text-ink w-8 h-8 rounded-full bg-subtle-fill hover:bg-subtle-border flex items-center justify-center" aria-label="${isEn ? 'Close' : '关闭'}">
                            <i class="ri-close-line text-lg"></i>
                        </button>
                    </div>
                    <div class="flex justify-center bg-white rounded-xl p-2 max-h-[75vh] overflow-hidden">
                        <img src="${modal.src}" alt="${modal.title}" class="max-h-[70vh] w-auto object-contain" />
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 渲染 Talks at Google 专场演讲视频弹窗 (Video Modal)
     * 支持宽屏双栏影院级排版（左侧视窗+时间轴，右侧核心理论），移动端流式上下自适应
     */
    renderGoogleTalkModalHTML: (app) => {
        const lang = app.state.language || app.state.bookLanguage || 'zh';
        const isEn = lang === 'en';
        const talk = BOOK_META.googleTalk;
        if (!talk) return '';

        return `
            <div id="google-talk-video-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 py-6 sm:py-10 animate-fade-in" onclick="app.closeGoogleTalkModal()">
                <div class="relative w-full max-w-5xl xl:max-w-6xl bg-surface border border-subtle-border rounded-3xl overflow-hidden shadow-2xl space-y-0 my-auto" onclick="event.stopPropagation()">
                    
                    <!-- Modal Top Navigation Header -->
                    <div class="flex items-center justify-between px-5 py-3.5 border-b border-subtle-border bg-subtle-fill/40">
                        <div class="flex items-center gap-2.5 min-w-0 pr-2">
                            <span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                                <i class="ri-youtube-fill"></i>
                                <span>Talks at Google</span>
                            </span>
                            <h4 class="font-serif font-bold text-ink text-xs sm:text-sm truncate">
                                ${bookView.getText(talk.title, lang)}
                            </h4>
                        </div>

                        <!-- Actions: Open in YouTube & Close -->
                        <div class="flex items-center gap-2 shrink-0">
                            <a href="${talk.videoUrl}" target="_blank" rel="noopener noreferrer" class="cursor-pointer text-xs font-mono font-medium text-ink-secondary hover:text-ink px-2.5 py-1 rounded-lg bg-surface border border-subtle-border hover:border-accent/40 flex items-center gap-1 transition-all shadow-2xs" title="${isEn ? 'Open on YouTube' : '在 YouTube 上打开'}">
                                <span class="hidden sm:inline">${isEn ? 'Open on YouTube' : '在 YouTube 打开'}</span>
                                <i class="ri-external-link-line text-xs"></i>
                            </a>
                            <button onclick="app.closeGoogleTalkModal()" class="cursor-pointer text-ink-secondary hover:text-ink w-8 h-8 rounded-full bg-subtle-fill hover:bg-subtle-border/80 flex items-center justify-center transition-all active:scale-95" aria-label="${isEn ? 'Close' : '关闭'}">
                                <i class="ri-close-line text-lg"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Responsive Dual-Column Body (Desktop: Left Video+Chapters, Right Notes; Mobile: Stacked) -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-subtle-border">
                        
                        <!-- Left Column: Video Player + Meta + Direct Chapter Seekers (lg:col-span-7) -->
                        <div class="lg:col-span-7 flex flex-col bg-surface">
                            <!-- 16:9 Responsive Embedded Video Container -->
                            <div class="aspect-video w-full bg-black relative shrink-0">
                                <iframe id="google-talk-iframe" src="" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Steve Zim Talks at Google"></iframe>
                            </div>

                            <!-- Video Meta & Authors@Google Header (Relocated to Left under Video) -->
                            <div class="px-4 py-2.5 bg-subtle-fill/15 border-b border-subtle-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                        <i class="ri-video-line text-xs"></i>
                                        <span>AUTHORS@GOOGLE</span>
                                    </span>
                                    <span class="text-xs font-mono font-medium text-ink">${talk.location}</span>
                                    <span class="text-xs text-ink-secondary/50 hidden sm:inline">•</span>
                                    <span class="text-xs font-mono text-ink-secondary">${talk.date}</span>
                                </div>
                                <div class="flex items-center gap-2 text-xs font-mono text-ink-secondary shrink-0">
                                    <span class="inline-flex items-center gap-1">
                                        <i class="ri-time-line text-accent"></i>
                                        <span>${talk.duration} Keynote</span>
                                    </span>
                                    <span class="text-ink-secondary/50 hidden sm:inline">•</span>
                                    <span class="hidden sm:inline">${isEn ? 'Google Tech Talk' : '现场问答纠偏'}</span>
                                </div>
                            </div>

                            <!-- Direct Chapter Timeline: Horizontal Accordion in a Single Row -->
                            <div class="px-3.5 sm:px-4 py-3 bg-subtle-fill/25 border-t lg:border-t-0 border-subtle-border">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-[11px] font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-1.5">
                                        <i class="ri-skip-forward-line text-xs"></i>
                                        <span>${isEn ? 'DIRECT CHAPTER SEEK' : 'Timeline'}</span>
                                    </div>
                                    <span class="text-[10px] font-mono text-ink-secondary/70 hidden sm:inline">
                                        ${isEn ? 'Hover chapter to expand full content · Click to seek' : '移入卡片平滑展开 · 默认显示当前节点'}
                                    </span>
                                </div>
                                
                                <!-- 5 Chapter Cards in Single Row (Flex Horizontal Accordion) -->
                                <div id="google-talk-chapters-row" class="flex gap-1.5 sm:gap-2 w-full items-stretch min-h-[76px]" onmouseleave="app.resetGoogleTalkChapterPreview()">
                                    ${talk.keyTopics ? talk.keyTopics.map((topic, idx) => {
            const activeIdx = app.state.activeGoogleTalkIndex ?? 0;
            const isActive = idx === activeIdx;
            const flexClass = isActive
                ? 'flex-[3.5] sm:flex-[4] bg-surface border-accent shadow-md ring-1 ring-accent/30'
                : 'flex-1 bg-subtle-fill/40 border-subtle-border hover:bg-subtle-fill';

            return `
                                        <div class="google-talk-chapter-card ${flexClass} cursor-pointer rounded-2xl border transition-all duration-300 ease-out overflow-hidden p-2 sm:p-2.5 flex flex-col justify-center min-w-0" 
                                             onmouseenter="app.previewGoogleTalkChapter(${idx})" 
                                             onclick="app.seekGoogleTalk(${topic.seconds}, ${idx})"
                                             title="${bookView.getText(topic.title, lang)}">
                                            
                                            <!-- Simple Collapsed Content (When card is shrunk) -->
                                            <div class="chapter-simple-content ${isActive ? 'hidden' : ''} flex flex-col items-center justify-center text-center py-1 gap-1">
                                                <span class="font-mono text-[10px] font-bold text-accent flex items-center gap-0.5 shrink-0">
                                                    <i class="ri-play-mini-fill text-xs text-rose-500"></i>
                                                    <span>${topic.time}</span>
                                                </span>
                                                <span class="font-serif font-bold text-[11px] text-ink truncate w-full px-0.5">
                                                    ${bookView.getText(topic.shortTitle || topic.title, lang)}
                                                </span>
                                            </div>

                                            <!-- Full Expanded Content (When card is active or hovered) -->
                                            <div class="chapter-full-content ${isActive ? '' : 'hidden'} space-y-1 animate-fade-in min-w-0">
                                                <div class="flex items-center justify-between gap-1">
                                                    <span class="font-mono text-[10px] font-bold text-accent flex items-center gap-1 shrink-0">
                                                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                        <i class="ri-play-mini-fill text-xs text-rose-500"></i>
                                                        <span>${topic.time} · ${isEn ? `Part 0${idx + 1}` : `第 ${idx + 1} 章节`}</span>
                                                    </span>
                                                    <span class="text-[9px] font-mono text-accent/80 font-semibold uppercase tracking-wider shrink-0">
                                                        ${isEn ? 'NOW ACTIVE' : '当前节点'}
                                                    </span>
                                                </div>
                                                <h6 class="font-serif font-bold text-xs sm:text-sm text-ink truncate">
                                                    ${bookView.getText(topic.title, lang)}
                                                </h6>
                                                <p class="text-[11px] text-ink-secondary leading-snug line-clamp-2 font-sans">
                                                    ${bookView.getText(topic.desc, lang)}
                                                </p>
                                            </div>

                                        </div>
                                        `;
        }).join('') : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Reading Dossier (Synopsis & 3 Pillars) (lg:col-span-5) -->
                        <div class="lg:col-span-5 p-5 sm:p-6 bg-surface text-xs text-ink-secondary space-y-4 overflow-y-auto lg:max-h-[640px]">
                            <!-- 1. Formatted Synopsis -->
                            <div class="space-y-1.5">
                                <div class="text-[11px] font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-1.5">
                                    <i class="ri-sparkling-fill text-xs"></i>
                                    <span>${isEn ? 'KEYNOTE SYNOPSIS' : '演讲主旨 · 好莱坞身材的生化力学公式'}</span>
                                </div>
                                <p class="text-xs text-ink-secondary leading-relaxed font-sans font-normal">
                                    ${bookView.parseInline(bookView.getText(talk.summary, lang))}
                                </p>
                            </div>

                            <!-- 2. The Three Scientific Pillars Grid -->
                            ${talk.pillars ? `
                            <div class="space-y-2.5 pt-1">
                                <div class="text-[11px] font-mono uppercase tracking-wider text-ink font-bold flex items-center gap-1.5">
                                    <i class="ri-shield-flash-line text-xs text-accent"></i>
                                    <span>${isEn ? 'THREE SCIENTIFIC ENGINES' : '三大核心支柱拆解'}</span>
                                </div>
                                <div class="space-y-2.5">
                                    ${talk.pillars.map(pillar => `
                                        <div class="p-3 rounded-2xl bg-subtle-fill/40 hover:bg-subtle-fill/70 border border-subtle-border space-y-1.5 transition-colors">
                                            <div class="flex items-center justify-between">
                                                <span class="text-[10px] font-mono font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10">
                                                    ${pillar.number} · ${pillar.name}
                                                </span>
                                                <span class="text-[10px] font-mono text-ink-secondary font-medium">
                                                    ${pillar.badge}
                                                </span>
                                            </div>
                                            <h5 class="font-serif font-bold text-xs text-ink">
                                                ${bookView.getText(pillar.title, lang)}
                                            </h5>
                                            <p class="text-[11px] text-ink-secondary leading-relaxed">
                                                ${bookView.getText(pillar.desc, lang)}
                                            </p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            ` : ''}
                        </div>

                    </div>

                </div>
            </div>
        `;
    }
};
