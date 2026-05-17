import 'remixicon/fonts/remixicon.css';
import { translations } from './locales.js';

// Make app global for inline onclick handlers in HTML
const app = {
    state: {
        currentView: 'home', // 'home' or 'workout'
        activeDay: null, // 'monday', 'wednesday', 'friday', 'saturday', 'sunday'
        todayDayIndex: new Date().getDay(), // 0 = Sunday, 1 = Monday, etc.
        expandedCards: {}, // Stores state of expanded cards per day
        manifest: null, // Loaded from data/manifest.json
        workoutCache: {}, // Cache for loaded workout plans
        lang: 'cn', // 'cn' or 'en'
        activeWorkoutTab: 'training' // 'training', 'recovery', 'strategy'
    },

    translations: translations,

    t: (key) => {
        const lang = app.state.lang;
        const keys = key.split('.');
        let val = app.translations[lang];
        for (const k of keys) {
            val = val ? val[k] : null;
        }
        return val || key;
    },

    toggleLang: () => {
        app.state.lang = app.state.lang === 'cn' ? 'en' : 'cn';
        // Re-render current view
        if (app.state.currentView === 'home') {
            app.renderHome();
        } else {
            app.renderWorkout();
        }
    },

    init: async () => {
        try {
            // Setup Manifest from Filenames
            app.state.manifest = { plans: {} };

            // Eagerly load all JSON files in data directory
            const modules = import.meta.glob('./data/*.json', { eager: true });

            for (const path in modules) {
                const module = modules[path];
                // path is like "./data/monday.json"
                // Extract filename
                const filename = path.split('/').pop(); // "monday.json"
                const dayKey = filename.replace('.json', ''); // "monday"

                app.state.manifest.plans[dayKey] = {
                    filename: filename
                };

                // Cache the data immediately
                app.state.workoutCache[filename] = module.default || module;
            }

            console.log("Generated Manifest:", app.state.manifest);
            app.renderHome();

        } catch (e) {
            console.error("Failed to load workout data automatically.", e);
            document.getElementById('app-container').innerHTML = `
                <div class="p-8 text-center text-ink-secondary">
                    <h2 class="text-xl font-bold font-serif text-ink mb-2">Error Loading Data</h2>
                    <p>Failed to initialize workout library.</p>
                </div>
            `;
        }
    },

    toggleDetails: (dayKey, index) => {
        const content = document.getElementById(`details-${index}`);
        const icon = document.getElementById(`icon-${index}`);
        const btnText = document.getElementById(`btn-text-${index}`);

        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            icon.style.transform = 'rotate(180deg)';
            if (btnText) btnText.innerText = app.t('hideDetails');
        } else {
            content.classList.add('collapsed');
            icon.style.transform = 'rotate(0deg)';
            if (btnText) btnText.innerText = app.t('showDetails');
        }
    },

    goHome: () => {
        app.state.currentView = 'home';
        app.renderHome();
    },

    switchWorkoutTab: (tabId) => {
        app.state.activeWorkoutTab = tabId;
        // Re-render the workout view
        app.renderWorkout(app.state.activeDay);
    },

    startWorkout: async (dayKey) => {
        const planConfig = app.state.manifest.plans[dayKey];
        if (!planConfig) {
            console.error("No plan found for " + dayKey);
            return;
        }

        const filename = planConfig.filename;
        if (!app.state.workoutCache[filename]) {
            console.error(`Data for ${filename} not found in cache.`);
            return;
        }

        app.state.currentView = 'workout';
        app.state.activeDay = dayKey;
        app.state.activePlanConfig = planConfig;
        app.state.activePlanData = app.state.workoutCache[filename];

        app.renderWorkout();
    },

    getTodayKey: () => {
        const map = {
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday',
            0: 'sunday'
        };
        return map[app.state.todayDayIndex] || 'recovery';
    },

    renderHome: () => {
        const container = document.getElementById('app-container');
        const headerActions = document.getElementById('header-actions');

        // Render Language Toggle in Header
        headerActions.innerHTML = `
            <button onclick="app.toggleLang()" class="cursor-pointer text-xs font-bold text-ink-secondary bg-subtle-fill hover:bg-subtle-border px-3 py-1.5 rounded-xl transition-colors uppercase">
                ${app.state.lang === 'cn' ? 'EN' : '中文'}
            </button>
        `;

        const todayKey = app.getTodayKey();

        // Dynamic Schedule Generation
        const weekOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        // Get all available plan keys from manifest, excluding 'daily'
        const planKeys = Object.keys(app.state.manifest.plans).filter(k => k !== 'daily');

        // Sort keys based on weekOrder
        planKeys.sort((a, b) => {
            const indexA = weekOrder.indexOf(a);
            const indexB = weekOrder.indexOf(b);
            // If not found in weekOrder, put at the end
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });

        // Generate days array dynamically
        const days = planKeys.map(key => {
            const planConfig = app.state.manifest.plans[key];

            // Get data from cache
            const data = app.state.workoutCache[planConfig.filename];
            const title = data ? data.title : key; // Fallback to key if no title

            // Localized Day Name
            const dayName = app.t(`weekdays.${key}`) || key; // Fallback to key if not in translations

            return {
                key: key,
                label: `${dayName}: ${title}`
            };
        });

        let html = `
            <div class="space-y-12 pb-10">
                <!-- Date Header -->
                <div class="text-left py-4">
                    <p class="text-ink-secondary text-sm uppercase tracking-widest font-semibold">${new Date().toLocaleDateString(app.state.lang === 'cn' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <h2 class="text-[28px] leading-[1.2] font-bold font-serif text-ink mt-2">${app.t('todayTarget')}</h2>
                </div>

                <!-- Daily Posture Correction (Mandatory) -->
                <div class="bg-surface border border-subtle-border p-6 relative overflow-hidden group rounded-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div class="relative z-10">
                            <h3 class="text-[20px] font-bold font-serif text-ink mt-4">${app.t('dailyTitle')}</h3>
                        </div>
                        <div class="absolute right-[-10px] top-[-15px] text-[64px] font-black pointer-events-none uppercase tracking-tighter transform rotate-6 select-none z-0 hollow-watermark">
                            ${app.t('mandatory')}
                        </div>
                    </div>
                    <p class="text-ink-secondary text-base mb-8 font-light">${app.t('dailyDesc')}</p>
                    <button onclick="app.startWorkout('daily')" class="cursor-pointer w-full bg-subtle-fill hover:bg-subtle-border text-ink font-medium py-3.5 transition-all flex items-center justify-center gap-2 active:scale-[0.98] rounded-xl">
                        <span>${app.t('startRitual')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-ink-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>

                <!-- Workouts List -->
                <div class="space-y-4">
                    <h3 class="text-ink-secondary text-xs font-bold uppercase tracking-widest mb-4">${app.t('weeklySchedule')}</h3>
                    ${days.map(day => {
            const isToday = day.key === todayKey;

            return `
                        <button onclick="app.startWorkout('${day.key}')" class="cursor-pointer w-full text-left bg-surface border ${isToday ? 'border-stroke-tint' : 'border-subtle-border'} hover:bg-subtle-fill p-5 transition-all relative overflow-hidden group flex justify-between items-center rounded-2xl">
                            <div class="relative z-10">
                                <h4 class="font-serif font-bold text-ink text-[18px]">${day.label}</h4>
                                <p class="text-ink-secondary text-xs mt-2 uppercase tracking-wider font-light">${app.t('startWorkout')}</p>
                            </div>
                            ${isToday ? `<div class="absolute right-[-10px] bottom-[-20px] text-[72px] font-black text-ink opacity-[0.05] pointer-events-none uppercase tracking-tighter transform -rotate-6 select-none z-0">TODAY</div>` : ''}
                        </button>
                        `
        }).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderWorkout: () => {
        const container = document.getElementById('app-container');
        const headerActions = document.getElementById('header-actions');

        const dayKey = app.state.activeDay;

        // Add Language Toggle to headerActions on workout view too
        headerActions.innerHTML = `
             <button onclick="app.toggleLang()" class="cursor-pointer text-xs font-bold text-ink-secondary bg-subtle-fill hover:bg-subtle-border px-3 py-1.5 rounded transition-colors uppercase">
                ${app.state.lang === 'cn' ? 'EN' : '中文'}
             </button>
        `;

        const planData = app.state.activePlanData;

        if (!planData) return;

        const currentTab = app.state.activeWorkoutTab || 'training';

        // Tab UI
        const tabList = [
            { id: 'training', label: app.state.lang === 'cn' ? '训练' : 'Training' },
            { id: 'recovery', label: app.state.lang === 'cn' ? '放松' : 'Recovery' },
            { id: 'strategy', label: app.state.lang === 'cn' ? '理论' : 'Strategy' }
        ];

        const renderTabsHTML = `
            <div class="flex items-center gap-8 mb-12 border-b border-subtle-border">
                ${tabList.map(tab => `
                    <button onclick="app.switchWorkoutTab('${tab.id}')" 
                            class="cursor-pointer text-[14px] pb-3 -mb-[1px] uppercase tracking-[0.1em] transition-all ${currentTab === tab.id ? 'font-serif font-bold text-ink border-b-2 border-ink' : 'font-sans text-ink-secondary hover:text-ink border-b-2 border-transparent'}">
                        ${tab.label}
                    </button>
                `).join('')}
            </div>
        `;

        const allKeys = Object.keys(planData.sections);
        const recoveryKeys = ['stretch', 'cooldown'];
        const trainingKeys = allKeys.filter(k => !recoveryKeys.includes(k));

        let tabContentHTML = '';

        if (currentTab === 'training') {
            const standardSections = ['warmup', 'strength'];
            const presentStandardKeys = standardSections.filter(k => trainingKeys.includes(k));
            const otherKeys = trainingKeys.filter(k => !standardSections.includes(k)).sort();
            const orderedKeys = [...presentStandardKeys, ...otherKeys];

            tabContentHTML = orderedKeys.map(key => {
                const exercises = planData.sections[key];
                let title = key;
                if (standardSections.includes(key)) {
                    if (key === 'warmup') title = app.t('warmUp');
                    else if (key === 'strength') title = planData.type === 'daily_correction' ? app.t('posture') : app.t('strength');
                } else {
                    title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    if (key.startsWith('circuit')) {
                        title = title.replace(/Circuit (\d+) (.*)/, 'Circuit $1: $2');
                    }
                }
                return app.renderSection(title, exercises, dayKey);
            }).join('');

            if (!tabContentHTML) {
                tabContentHTML = `<div class="text-ink-secondary text-sm italic py-8 border-t border-subtle-border">${app.state.lang === 'cn' ? '暂无训练数据' : 'No training data.'}</div>`;
            }

        } else if (currentTab === 'recovery') {
            const orderedKeys = recoveryKeys.filter(k => allKeys.includes(k));
            tabContentHTML = orderedKeys.map(key => {
                const exercises = planData.sections[key];
                let title = key === 'stretch' ? app.t('stretch') : key;
                return app.renderSection(title, exercises, dayKey);
            }).join('');

            if (!tabContentHTML) {
                tabContentHTML = `<div class="text-ink-secondary text-sm italic py-8 border-t border-subtle-border">${app.state.lang === 'cn' ? '暂无放松数据' : 'No recovery data.'}</div>`;
            }

        } else if (currentTab === 'strategy') {
            tabContentHTML = `
                <!-- Theory & Strategy -->
                <div class="space-y-12 py-4">
                     ${planData.strategic_importance ? `
                        <div>
                            <h4 class="text-[14px] font-bold font-serif text-ink uppercase tracking-[0.1em] mb-4">
                                ${app.t('strategicImportance')}
                            </h4>
                            <div class="leading-relaxed text-base text-ink-secondary">
                                ${planData.strategic_importance}
                            </div>
                        </div>
                     ` : ''}
                     
                     ${planData.core_principle ? `
                        <div>
                            <h4 class="text-[14px] font-bold font-serif text-ink uppercase tracking-[0.1em] mb-4">
                                ${app.t('corePrinciple')}
                            </h4>
                            <div class="leading-relaxed text-base text-ink-secondary">
                                ${planData.core_principle}
                            </div>
                        </div>
                     ` : ''}

                     ${(planData.dietary_suggestions || planData.diet) ? `
                        <div>
                            <h4 class="text-[14px] font-bold font-serif text-ink uppercase tracking-[0.1em] mb-4">
                                ${app.t('dietarySuggestions')}
                            </h4>
                            <div class="leading-relaxed text-base text-ink-secondary">
                                <p>${planData.dietary_suggestions || planData.diet}</p>
                            </div>
                        </div>
                     ` : ''}

                     ${planData.nutrition_timing ? `
                        <div>
                            <h4 class="text-[14px] font-bold font-serif text-ink uppercase tracking-[0.1em] mb-4">
                                ${app.t('nutritionTiming')}
                            </h4>
                            <ul class="text-base text-ink-secondary leading-relaxed space-y-6">
                                ${Object.entries(planData.nutrition_timing).map(([k, v]) => {
                const label = k === 'pre_workout' ? 'Pre' : k === 'intra_workout' ? 'Intra' : k === 'post_workout' ? 'Post' : k === 'evening' ? 'Eve' : k;
                let content = '';
                if (typeof v === 'string') {
                    content = v;
                } else if (v && typeof v === 'object') {
                    content = `<span class="font-medium text-ink">${v.composition || ''}</span> <span class="italic text-ink-secondary block md:inline md:ml-2">${v.timing || ''}</span>`;
                }
                return `
                <li class="flex flex-col md:flex-row md:gap-6 items-start pb-6 border-b border-subtle-fill last:border-0 last:pb-0">
                    <span class="font-serif font-bold text-ink text-sm uppercase tracking-wider md:min-w-[4em] pt-1">${label}</span>
                    <div class="text-base text-ink-secondary leading-[1.85] flex-grow">
                        ${content}
                    </div>
                </li>
                `;
            }).join('')}
                            </ul>
                        </div>
                     ` : ''}

                     ${(() => {
                    const metadataField = (title, data) => {
                        if (!data) return '';
                        const formatKey = (k) => k.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                        const renderValue = (v) => {
                            if (typeof v === 'string') return v;
                            if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                                return `<ul class="list-none space-y-3 mt-3">${Object.entries(v).map(([subK, subV]) =>
                                    `<li><span class="font-serif font-medium text-ink">${formatKey(subK)}:</span> <span class="text-ink-secondary">${typeof subV === 'string' ? subV : JSON.stringify(subV)}</span></li>`
                                ).join('')}</ul>`;
                            }
                            if (Array.isArray(v)) {
                                return `<ul class="list-none space-y-3 mt-3">${v.map(item => `<li>— ${item}</li>`).join('')}</ul>`;
                            }
                            return JSON.stringify(v);
                        };

                        return `
                        <div>
                            <h4 class="text-[14px] font-bold font-serif text-ink uppercase tracking-[0.1em] mb-4">
                                ${title}
                            </h4>
                            <ul class="space-y-6">
                                ${Object.entries(data).map(([k, v]) => `
                                    <li class="pb-4">
                                        <div class="font-serif font-semibold text-ink mb-2">${formatKey(k)}</div>
                                        <div class="text-ink-secondary leading-[1.85]">${renderValue(v)}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                    };

                    return `
                            ${metadataField(app.t('postWorkoutNotes'), planData.post_workout_notes)}
                            ${metadataField(app.t('recoveryOptimization'), planData.recovery_optimization)}
                        `;
                })()}
                </div>
            `;
        }

        const html = `
            <div class="pb-24">
                <!-- Main Title & Meta -->
                <div class="mb-12">
                    <h2 class="text-[40px] leading-[1.1] font-bold font-serif text-ink tracking-tight">${planData.title}</h2>
                     ${planData.execution_notes ? `
                        <div class="mt-8 p-6 bg-subtle-fill border border-subtle-border rounded-xl">
                             <div class="font-bold flex items-center gap-2 mb-3 text-ink">
                                <span>${app.t('technique') || 'Notes'}</span>
                             </div>
                             <div class="space-y-2 text-ink-secondary text-sm leading-[1.6]">
                                ${Object.entries(planData.execution_notes).map(([k, v]) => `<div><span class="font-serif font-semibold text-ink">${k.replace(/_/g, ' ')}:</span> ${v}</div>`).join('')}
                             </div>
                        </div>
                     ` : ''}
                </div>

                ${renderTabsHTML}

                <div class="min-h-[400px]">
                    ${tabContentHTML}
                </div>
                
                <!-- Terminal Coda (Completion) -->
                <div class="mt-20 pt-16 border-t border-subtle-border text-center flex flex-col items-center">
                    <div class="text-[14px] font-serif font-bold text-ink-secondary uppercase tracking-[0.1em] mb-8">
                        ${app.t('sessionComplete')}
                    </div>
                    <button onclick="app.goHome()" class="cursor-pointer bg-surface border border-stroke-tint hover:bg-subtle-fill text-ink font-serif font-bold py-4 px-12 transition-colors rounded-xl">
                        ${app.t('finishWorkout')}
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        app.restoreCheckboxState(dayKey);
    },

    renderSection: (title, exercises, dayKey) => {
        if (!exercises || exercises.length === 0) return '';

        return `
            <div class="mb-16">
                <div class="flex items-center gap-6 mb-10 mt-16 relative">
                     <div class="h-px bg-subtle-border flex-grow hidden sm:block border-dashed"></div>
                     <h3 class="text-[24px] font-bold font-serif text-ink tracking-tight">${title}</h3>
                     <div class="h-px bg-subtle-border flex-grow hidden sm:block border-dashed"></div>
                </div>
                <!-- Horizontal Scroll Container -->
                <div class="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth no-scrollbar">
                    ${exercises.map((ex, index) => app.renderExerciseCard(ex, index, dayKey, title)).join('')}
                </div>
            </div>
        `;
    },

    renderExerciseCard: (ex, index, dayKey, sectionTitle) => {
        const safe = (arr) => arr && arr.length ? arr : [];
        let safeId = ex.id ? ex.id.replace(/[^a-zA-Z0-9-_]/g, '') : null;
        if (!safeId) {
            safeId = `${sectionTitle}-${index}`.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
        }

        // Extract rest time number
        let restTime = 60;
        let restText = "60s";
        if (ex.rest && ex.rest !== "N/A") {
            const match = ex.rest.match(/(\d+)/);
            if (match) {
                restTime = parseInt(match[1]);
                restText = ex.rest;
            }
        }

        const restLabel = app.state.lang === 'cn' ? '休息: ' : 'Rest: ';

        // Handle sets_reps vs duration
        const metaDuration = ex.sets_reps || ex.duration || '';

        // Handle technique_notes
        let structuredNotes = '';
        if (ex.technique_notes) {
            const parts = ex.technique_notes.split(/【/);
            structuredNotes = parts.map((part, i) => {
                if (!part.trim()) return '';
                if (part.includes('】')) {
                    const [title, content] = part.split('】');
                    return `
                        <div class="mb-4 last:mb-0">
                            <span class="font-serif font-bold text-ink mr-2">${title}:</span>
                            <span class="text-ink-secondary text-base leading-[1.85]">${content}</span>
                        </div>
                     `;
                } else {
                    return `<div class="mb-4 text-ink-secondary text-base leading-[1.85]">${part}</div>`;
                }
            }).join('');
        }

        return `
        <div class="flex-shrink-0 w-[88vw] sm:w-[480px] snap-start bg-surface border border-subtle-border rounded-2xl overflow-hidden exercise-card transition-all relative group flex flex-col">
            <!-- Card Header -->
            <div class="p-6 sm:p-8 flex flex-col gap-6 select-none flex-grow relative z-10 overflow-hidden">

                <div class="flex items-start gap-4">
                    <div class="flex-grow">
                        <h3 class="font-bold text-[22px] font-serif text-ink leading-tight">${ex.name}</h3>
                        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                            ${ex.target ? `<span class="text-ink-secondary text-[12px] uppercase tracking-wider font-bold">${ex.target}</span>` : ''}
                            ${ex.tempo ? `<span class="text-ink-secondary text-[12px] font-mono opacity-80 italic">Tempo: ${ex.tempo}</span>` : ''}
                        </div>
                    </div>
                    <div class="flex flex-shrink-0 items-center gap-3 pt-1" onclick="event.stopPropagation()">
                         ${(ex.rest && ex.rest !== "N/A") ? `
                         <button onclick="app.startTimer(this, ${restTime})" class="group cursor-pointer w-9 h-9 flex items-center justify-center bg-subtle-fill hover:bg-subtle-border text-ink-secondary transition-all border border-subtle-border rounded-full active:scale-90 relative" title="${app.t('restTimer')} (${restText})">
                            <span class="group-[.timer-active]:hidden">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            <div class="hidden group-[.timer-active]:flex flex-col items-center justify-center leading-none">
                                <span class="countdown-display font-mono font-bold text-[10px] text-accent"></span>
                            </div>
                         </button>
                         ` : ''}
                         <input type="checkbox" id="check-${safeId}" class="custom-checkbox" onchange="app.toggleCheck('${dayKey}', '${safeId}')">
                    </div>
                </div>

                <!-- Summary Row -->
                <div class="pt-4 border-t border-subtle-border/50">
                    <div class="text-ink font-serif font-medium text-lg leading-tight">
                        ${metaDuration}
                    </div>
                </div>
            </div>

            <!-- Learning Content (Always Visible) -->
            <div id="details-${safeId}" class="learning-content border-t border-subtle-border px-6 sm:px-8">
                <div class="py-8"> 
                    ${safe(ex.setup).length > 0 ? `
                        <div class="mb-8 pl-4 border-l border-subtle-border text-[15px] text-ink-secondary font-mono leading-[1.6]">
                            ${ex.setup.map(s => `<div>${s}</div>`).join('')}
                        </div>
                    ` : ''}
                    
                    ${structuredNotes ? `
                        <div class="mb-8">
                            ${structuredNotes}
                        </div>
                    ` : ''}

                    ${ex.muscle_feeling ? `
                        <div class="mb-8 pl-4 border-l-2 border-accent/40 bg-subtle-fill/50 py-3 pr-4">
                             <div class="flex items-center gap-2 mb-2">
                                <span class="font-bold font-serif text-ink uppercase tracking-widest text-[13px]">${app.t('muscleFeeling')}</span>
                             </div>
                             <p class="leading-[1.85] text-ink-secondary">${ex.muscle_feeling}</p>
                        </div>
                    ` : ''}

                    ${safe(ex.cues).length > 0 ? `
                        <div class="mb-8">
                            <h4 class="text-[13px] font-bold font-serif text-ink uppercase tracking-widest mb-3">${app.t('technique')}</h4>
                            <ul class="space-y-3">
                                ${ex.cues.map(c => {
            const html = c.replace(/\*\*(.*?)\*\*/g, '<span class="text-ink font-bold">$1</span>');
            return `<li class="text-base text-ink-secondary pl-4 border-l border-subtle-border leading-[1.85]">${html}</li>`;
        }).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${safe(ex.mistakes).length > 0 ? `
                        <div class="mb-8">
                             <h4 class="text-[13px] font-bold font-serif text-ink uppercase tracking-widest mb-3">${app.t('commonErrors')}</h4>
                             <div class="space-y-4">
                                ${ex.mistakes.map(m => `
                                    <div class="pl-4 border-l-2 border-stroke-tint py-1">
                                        <div class="text-ink font-semibold leading-[1.6]"><del class="opacity-70">${m.error}</del></div>
                                        <div class="text-ink-secondary mt-1 leading-[1.6]"><span class="uppercase tracking-widest text-[11px] font-bold mr-2">${app.t('fix')}:</span> ${m.fix}</div>
                                    </div>
                                `).join('')}
                             </div>
                        </div>
                    ` : ''}
                </div>
                
                 ${(ex.progression || ex.weight_selection) ? `
                     <div class="border-t border-subtle-border py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                         ${ex.weight_selection ? `
                             <div>
                                 <h4 class="text-[13px] font-bold font-serif text-ink uppercase tracking-widest mb-3">${app.t('weightSelection')}</h4>
                                 <div class="space-y-2 text-base text-ink-secondary leading-[1.6]">
                                     ${ex.weight_selection.method ? `<div><span class="font-serif font-bold text-ink mr-2">Method:</span> ${ex.weight_selection.method}</div>` : ''}
                                     ${ex.weight_selection.first_time_estimate ? `<div><span class="font-serif font-bold text-ink mr-2">Estimate:</span> ${ex.weight_selection.first_time_estimate}</div>` : ''}
                                     ${ex.weight_selection.progression ? `<div><span class="font-serif font-bold text-ink mr-2">Progression:</span> ${ex.weight_selection.progression}</div>` : ''}
                                 </div>
                             </div>
                         ` : ''}
                         ${ex.progression ? `
                             <div>
                                 <h4 class="text-[13px] font-bold font-serif text-ink uppercase tracking-widest mb-3">${app.t('progression')}</h4>
                                 <ul class="space-y-2 text-base text-ink-secondary leading-[1.6]">
                                     ${Array.isArray(ex.progression) ? ex.progression.map(p => `
                                         <li class="flex items-start gap-3">
                                             <span class="text-subtle-border mt-0.5">—</span>
                                             <span>${p}</span>
                                         </li>
                                     `).join('') : `<li>${ex.progression}</li>`}
                                 </ul>
                             </div>
                         ` : ''}
                     </div>
                 ` : ''}
                </div>
        </div>
        `;
    },

    restoreCheckboxState: (dayKey) => {
        // Since we are iterating through sections now, we need to find all inputs
        const inputs = document.querySelectorAll('input[type="checkbox"]');
        inputs.forEach(input => {
            // The ID is check-EXERCISE_ID
            // We need to map that back or just use the ID from the DOM
            const domId = input.id.replace('check-', '');
            // Use the ID to find the key
            const key = `zim_log_${new Date().toLocaleDateString()}_${dayKey}_${domId}_done`;
            if (localStorage.getItem(key)) {
                input.checked = true;
            }
        });
    },

    toggleCheck: (dayKey, exId) => {
        // exId comes from the DOM call arguments (which we injected as safeId)
        // Note: safeId is just ex.id which should be unique.
        const key = `zim_log_${new Date().toLocaleDateString()}_${dayKey}_${exId}_done`;
        const input = document.getElementById(`check-${exId}`);
        if (input.checked) {
            localStorage.setItem(key, 'true');
        } else {
            localStorage.removeItem(key);
        }
    },

    startTimer: (btn, duration) => {
        if (btn.classList.contains('timer-active')) return;

        // Reset any other active timers
        document.querySelectorAll('.timer-active').forEach(b => {
            // We can't easily cancel the interval from here given how it's written in closures.
            // Ideally we'd have a global timer state. 
            // For now, let's just allow multiple? Or maybe not.
            // Style-wise, let's just proceed.
        });

        // Reset styling and text for timer
        let timeLeft = duration;

        btn.classList.add('timer-active', 'bg-subtle-fill', 'text-accent', 'border-accent/30');
        btn.classList.remove('text-ink-secondary', 'hover:bg-subtle-border', 'border-subtle-border');

        const display = btn.querySelector('.countdown-display');

        const tick = () => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                display.innerText = app.t('restComplete');
                document.getElementById('timer-beep').play().catch(e => console.log('Audio blocked', e));

                // Finished State
                btn.classList.remove('animate-soft-pulse');

                setTimeout(() => {
                    // Reset styling
                    btn.classList.remove('timer-active', 'text-accent', 'border-accent/30');
                    btn.classList.add('text-ink-secondary', 'border-subtle-border');
                }, 3000);
            } else {
                display.innerText = `${timeLeft}s`;
                timeLeft--;
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', app.init);
window.app = app;
