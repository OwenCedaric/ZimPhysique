import 'remixicon/fonts/remixicon.css';
import { translations } from './locales.js';

// Make app global for inline onclick handlers in HTML
const app = {
    state: {
        currentView: 'home', // 'home' or 'workout'
        activeDay: null, // 'monday', 'wednesday', 'friday', 'saturday', 'sunday'
        activePlanId: null, // e.g. 'monday_v1'
        todayDayIndex: new Date().getDay(), // 0 = Sunday, 1 = Monday, etc.
        expandedCards: {}, // Stores state of expanded cards per day
        manifest: null, // Loaded from data/manifest.json
        workoutCache: {}, // Cache for loaded workout plans
        lang: 'cn' // 'cn' or 'en'
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
            // Note: In a larger app, we might lazy load, but for these small JSONs, eager is fine and simplifies logic.
            const modules = import.meta.glob('./data/*.json', { eager: true });

            for (const path in modules) {
                const module = modules[path];
                // path is like "./data/monday_v1.json"
                // Extract filename
                const filename = path.split('/').pop(); // "monday_v1.json"
                const basename = filename.replace('.json', ''); // "monday_v1"

                // Parse Day and Version
                // Assumes format: {day}_v{version}.json (e.g. monday_v1.json)
                // Note: The ID inside the JSON (e.g. "monday_v1") is also reliable

                // Let's use the file content's ID or logic to categorize
                // Convention: day is everything before the last underscore
                const parts = basename.split('_');
                const versionStr = parts.pop(); // "v1"
                const dayKey = parts.join('_'); // "monday" (or "upper_body" etc)

                if (!app.state.manifest.plans[dayKey]) {
                    app.state.manifest.plans[dayKey] = {
                        active: 0,
                        files: []
                    };
                }

                // Parse version number strictly
                // "monday_v2" -> 2. "monday_2" -> 2. "monday" -> 1 (default)
                let versionNum = 1;
                const vMatch = basename.match(/_v?(\d+)$/);
                if (vMatch) {
                    versionNum = parseInt(vMatch[1], 10);
                }

                // Store structured info
                app.state.manifest.plans[dayKey].files.push({
                    filename: filename,
                    version: versionNum
                });

                // Update active version to the max found
                if (versionNum > app.state.manifest.plans[dayKey].active) {
                    app.state.manifest.plans[dayKey].active = versionNum;
                }

                // Cache the data immediately
                app.state.workoutCache[filename] = module.default || module;
            }

            // Sort files by version descending for each plan
            for (const key in app.state.manifest.plans) {
                app.state.manifest.plans[key].files.sort((a, b) => b.version - a.version);
            }

            console.log("Generated Manifest:", app.state.manifest);
            app.renderHome();

        } catch (e) {
            console.error("Failed to load workout data automatically.", e);
            document.getElementById('app-container').innerHTML = `
                <div class="p-8 text-center text-slate-500">
                    <h2 class="text-xl font-bold text-red-500 mb-2">Error Loading Data</h2>
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

    startWorkout: async (dayKey, specificFilename = null) => {
        // Find active version
        const planConfig = app.state.manifest.plans[dayKey];
        if (!planConfig) {
            console.error("No plan found for " + dayKey);
            return;
        }

        const activeVersion = planConfig.active;

        let filename = specificFilename;
        if (!filename) {
            // Find file matching active version
            const fileObj = planConfig.files.find(f => f.version === activeVersion);
            // Fallback to the first file (highest version due to sort)
            filename = fileObj ? fileObj.filename : planConfig.files[0].filename;
        }

        if (!filename) {
            console.error("No file found for version " + activeVersion);
            return;
        }

        // Load data (already cached by init via import.meta.glob)
        const cacheKey = filename;
        if (!app.state.workoutCache[cacheKey]) {
            console.error(`Data for ${filename} not found in cache.`);
            return;
        }

        app.state.currentView = 'workout';
        app.state.activeDay = dayKey;
        app.state.activePlanConfig = planConfig; // Store for version switching
        app.state.activePlanData = app.state.workoutCache[cacheKey]; // The actual data object

        app.renderWorkout();
    },

    getTodayKey: () => {
        const map = {
            1: 'monday',
            3: 'wednesday',
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
            <button onclick="app.toggleLang()" class="cursor-pointer text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors uppercase">
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
            // Get active version info
            const planConfig = app.state.manifest.plans[key];
            const activeVersion = planConfig.active;
            const fileObj = planConfig.files.find(f => f.version === activeVersion) || planConfig.files[0];

            // Get data from cache
            const data = app.state.workoutCache[fileObj.filename];
            const title = data ? data.title : key; // Fallback to key if no title

            // Localized Day Name
            const dayName = app.t(`weekdays.${key}`) || key; // Fallback to key if not in translations

            return {
                key: key,
                label: `${dayName}: ${title}`
            };
        });

        let html = `
            <div class="space-y-6 pb-10">
                <!-- Date Header -->
                <div class="text-center py-4">
                    <p class="text-slate-500 text-sm uppercase tracking-wider font-semibold">${new Date().toLocaleDateString(app.state.lang === 'cn' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <h2 class="text-2xl font-bold text-slate-800 mt-1">${app.t('todayTarget')}</h2>
                </div>

                <!-- Daily Posture Correction (Mandatory) -->
                <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="bg-accent/10 text-accent-hover text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">${app.t('mandatory')}</span>
                            <h3 class="text-xl font-bold text-slate-800 mt-3">${app.t('dailyTitle')}</h3>
                        </div>
                    </div>
                    <p class="text-slate-500 text-sm mb-6 leading-relaxed">${app.t('dailyDesc')}</p>
                    <button onclick="app.startWorkout('daily')" class="cursor-pointer w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:shadow-xl active:scale-[0.98]">
                        <span>${app.t('startRitual')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>

                <!-- Workouts List -->
                <div class="space-y-3">
                    <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">${app.t('weeklySchedule')}</h3>
                    ${days.map(day => {
            const isToday = day.key === todayKey;

            return `
                        <button onclick="app.startWorkout('${day.key}')" class="cursor-pointer w-full text-left bg-white border ${isToday ? 'border-accent ring-1 ring-accent/20 shadow-md shadow-accent/5' : 'border-slate-100 shadow-sm'} hover:border-accent/30 rounded-2xl p-5 transition-all relative overflow-hidden group">
                            ${isToday ? `<div class="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">TODAY</div>` : ''}
                            <h4 class="font-bold text-slate-800 text-lg ${isToday ? 'text-accent-hover' : ''}">${day.label}</h4>
                            <p class="text-slate-400 text-xs mt-1 group-hover:text-slate-500 transition-colors uppercase tracking-wider font-medium">${app.t('startWorkout')}</p>
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

        // Render Version Selector logic & Language Toggle
        // We'll embed it directly in the view
        const dayKey = app.state.activeDay;
        const planConfig = app.state.activePlanConfig;

        // Add Language Toggle to headerActions on workout view too
        headerActions.innerHTML = `
             <button onclick="app.toggleLang()" class="cursor-pointer text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors uppercase">
                ${app.state.lang === 'cn' ? 'EN' : '中文'}
            </button>
        `;

        // Helper to generate version options
        const renderVersionSelector = () => {
            if (!planConfig || planConfig.files.length <= 1) {
                return `<span class="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-500">v${app.state.activePlanData.version}</span>`;
            }

            // We need to inject the select HTML with an onchange handler matching the filename
            const options = planConfig.files.map(f => {
                const isSelected = f.filename === app.state.activePlanData.id + '.json' || f.filename.includes(app.state.activePlanData.id); // Loose match on ID
                // Better match: compare loaded object
                const cached = app.state.workoutCache[f.filename];
                const selected = cached === app.state.activePlanData ? 'selected' : '';

                return `<option value="${f.filename}" ${selected}>v${f.version}</option>`;
            }).join('');

            return `
                <div class="relative inline-block">
                    <select onchange="app.startWorkout('${dayKey}', this.value)" class="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-mono py-1 pl-2 pr-6 rounded cursor-pointer outline-none focus:ring-1 focus:ring-accent/50 transition-colors">
                        ${options}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-400">
                        <svg class="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
             `;
        };

        const planData = app.state.activePlanData;

        if (!planData) return;

        // Dynamic Section Rendering
        // Prioritize standard sections, then render others
        const standardSections = ['warmup', 'strength', 'stretch'];
        const allKeys = Object.keys(planData.sections);

        // Filter out standard keys that exist
        const presentStandardKeys = standardSections.filter(k => allKeys.includes(k));
        // Get remaining keys (e.g. circuit_1, etc.)
        const otherKeys = allKeys.filter(k => !standardSections.includes(k)).sort();

        // Combine order
        const orderedKeys = [...presentStandardKeys, ...otherKeys];

        const renderSectionsHTML = orderedKeys.map(key => {
            const exercises = planData.sections[key];
            let title = key;
            // Try to use translation for standard keys
            if (standardSections.includes(key)) {
                // Map to existing translation keys if possible
                if (key === 'warmup') title = app.t('warmUp');
                else if (key === 'strength') title = planData.type === 'daily_correction' ? app.t('posture') : app.t('strength');
                else if (key === 'stretch') title = app.t('stretch');
            } else {
                // Format custom keys: circuit_1_pelvic_correction -> Circuit 1 Pelvic Correction
                // Remove underscores, Capitalize first letters
                title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                // Optional: Translate 'Circuit' if we want, but English is fine or simple mapping
                // If it starts with 'circuit', we could make it cleaner
                if (key.startsWith('circuit')) {
                    // Try to make it look a bit better? 
                    // e.g. "circuit_1_pelvic..." -> "Circuit 1: Pelvic..."
                    title = title.replace(/Circuit (\d+) (.*)/, 'Circuit $1: $2');
                }
            }
            return app.renderSection(title, exercises, dayKey);
        }).join('');

        const html = `
            <div class="pb-24">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-900">${planData.title}</h2>
                    <div class="flex items-center gap-3 mt-2">
                         ${renderVersionSelector()}
                    </div>
                     ${planData.execution_notes ? `
                        <div class="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                             <div class="font-bold flex items-center gap-2 mb-2">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>${app.t('technique') || 'Notes'}</span>
                             </div>
                             <div class="space-y-1">
                                ${Object.entries(planData.execution_notes).map(([k, v]) => `<div><span class="font-semibold opacity-75">${k.replace(/_/g, ' ')}:</span> ${v}</div>`).join('')}
                             </div>
                        </div>
                     ` : ''}
                </div>

                <div class="mb-8 flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 pb-4 no-scrollbar">
                     ${planData.strategic_importance ? `
                        <div class="snap-center flex-shrink-0 w-[85%] sm:w-[400px] h-64 flex flex-col bg-white border border-indigo-100 rounded-xl shadow-sm">
                            <div class="p-5 pb-2 flex-shrink-0">
                                <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    ${app.t('strategicImportance')}
                                </h4>
                            </div>
                            <div class="p-5 pt-0 overflow-y-auto leading-relaxed text-sm text-slate-600 no-scrollbar">
                                ${planData.strategic_importance}
                            </div>
                        </div>
                     ` : ''}
                     
                     ${planData.core_principle ? `
                        <div class="snap-center flex-shrink-0 w-[85%] sm:w-[400px] h-64 flex flex-col bg-white border border-emerald-100 rounded-xl shadow-sm">
                            <div class="p-5 pb-2 flex-shrink-0">
                                <h4 class="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    ${app.t('corePrinciple')}
                                </h4>
                            </div>
                            <div class="p-5 pt-0 overflow-y-auto leading-relaxed text-sm text-slate-600 no-scrollbar">
                                ${planData.core_principle}
                            </div>
                        </div>
                     ` : ''}

                     ${(planData.dietary_suggestions || planData.diet) ? `
                        <div class="snap-center flex-shrink-0 w-[85%] sm:w-[400px] h-64 flex flex-col bg-white border border-orange-100 rounded-xl shadow-sm">
                            <div class="p-5 pb-2 flex-shrink-0">
                                <h4 class="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                    ${app.t('dietarySuggestions')}
                                </h4>
                            </div>
                            <div class="p-5 pt-0 overflow-y-auto leading-relaxed text-sm text-slate-600 no-scrollbar">
                                <p>${planData.dietary_suggestions || planData.diet}</p>
                            </div>
                        </div>
                     ` : ''}

                     ${planData.nutrition_timing ? `
                        <div class="snap-center flex-shrink-0 w-[85%] sm:w-[400px] h-64 flex flex-col bg-white border border-rose-100 rounded-xl shadow-sm">
                            <div class="p-5 pb-2 flex-shrink-0">
                                <h4 class="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                    ${app.t('nutritionTiming')}
                                </h4>
                            </div>
                            <div class="p-5 pt-0 overflow-y-auto no-scrollbar">
                                <ul class="text-sm text-slate-600 leading-relaxed space-y-2">
                                    ${Object.entries(planData.nutrition_timing).map(([k, v]) => {
            const label = k === 'pre_workout' ? 'Pre' :
                k === 'intra_workout' ? 'Intra' :
                    k === 'post_workout' ? 'Post' :
                        k === 'evening' ? 'Eve' : k;

            let content = '';
            if (typeof v === 'string') {
                content = v;
            } else if (v && typeof v === 'object') {
                content = `
                        <div class="flex flex-col">
                            <span class="font-medium text-slate-700">${v.composition || ''}</span>
                            <span class="text-xs text-slate-400 mt-0.5">${v.timing || ''}</span>
                        </div>
                    `;
            }

            return `
                <li class="flex gap-3 items-start p-2 bg-rose-50/30 rounded-lg border border-rose-100/50">
                    <span class="font-bold text-rose-500 text-xs mt-1 uppercase tracking-wider min-w-[3em] text-right">${label}</span>
                    <div class="text-sm text-slate-600 leading-snug flex-grow">
                        ${content}
                    </div>
                </li>
                `;
        }).join('')}
                                </ul>
                            </div>
                        </div>
                     ` : ''}

                     ${(() => {
                const metadataField = (title, data, colorClass, iconColorClass) => {
                    if (!data) return '';
                    const formatKey = (k) => k.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                    const renderValue = (v) => {
                        if (typeof v === 'string') return v;
                        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                            return `<ul class="list-disc pl-4 space-y-1 mt-1">${Object.entries(v).map(([subK, subV]) =>
                                `<li><span class="font-medium text-slate-700">${formatKey(subK)}:</span> <span class="text-slate-600">${typeof subV === 'string' ? subV : JSON.stringify(subV)}</span></li>`
                            ).join('')}</ul>`;
                        }
                        if (Array.isArray(v)) {
                            return `<ul class="list-disc pl-4 space-y-1 mt-1">${v.map(item => `<li>${item}</li>`).join('')}</ul>`;
                        }
                        return JSON.stringify(v);
                    };

                    return `
                    <div class="snap-center flex-shrink-0 w-[85%] sm:w-[400px] h-64 flex flex-col bg-white border border-${colorClass}-100 rounded-xl shadow-sm">
                        <div class="p-5 pb-2 flex-shrink-0">
                            <h4 class="text-xs font-bold text-${iconColorClass}-500 uppercase tracking-wider flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-${iconColorClass}-500"></span>
                                ${title}
                            </h4>
                        </div>
                        <div class="p-5 pt-0 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-3 no-scrollbar">
                            <ul class="space-y-3">
                                ${Object.entries(data).map(([k, v]) => `
                                    <li>
                                        <div class="font-semibold text-${iconColorClass}-800/80 mb-1">${formatKey(k)}</div>
                                        <div class="text-slate-600 leading-snug">${renderValue(v)}</div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    `;
                };

                return `
                            ${metadataField(app.t('postWorkoutNotes'), planData.post_workout_notes, 'indigo', 'indigo')}
                            ${metadataField(app.t('recoveryOptimization'), planData.recovery_optimization, 'teal', 'teal')}
                        `;
            })()}
                </div>

                <div class="space-y-8">
                    ${renderSectionsHTML}
                </div>
                
                <div class="mt-8 p-4 bg-slate-100 rounded-lg text-center border border-slate-200">
                    <h3 class="text-slate-800 font-bold mb-2">${app.t('sessionComplete')}</h3>
                    <button onclick="app.goHome()" class="cursor-pointer bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-accent/20">
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
            <div class="mb-10">
                <div class="flex items-center gap-4 mb-6">
                     <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">${title}</h3>
                     <div class="h-px bg-slate-100 flex-grow"></div>
                </div>
                <div class="space-y-8">
                    ${exercises.map((ex, index) => app.renderExerciseCard(ex, index, dayKey, title)).join('')}
                </div>
            </div>
        `;
    },

    renderExerciseCard: (ex, index, dayKey, sectionTitle) => {
        const safe = (arr) => arr && arr.length ? arr : [];
        // Unique key for DOM IDs needs to be composite to avoid collisions between sections if indices reset
        // Actually, let's use the exercise ID if available, or a reliable hash. 
        // using index is risky if we have split arrays. 
        // Let's use ex.id as the primary key suffix for DOM elements. 
        // Ensure ex.id is safe string.
        // If ex.id is missing (daily_v1 might not have strict IDs?), generate one?
        // daily_v1 does not have IDs for exercises! "name": "...", "duration": "..."
        // So we MUST generate a safe ID. Using sectionTitle + Index is better in that case.

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
            // Parse 【Title】Content
            // Splitting by 【
            const parts = ex.technique_notes.split(/【/);
            // parts[0] might be empty or intro text.
            structuredNotes = parts.map((part, i) => {
                if (!part.trim()) return '';
                if (part.includes('】')) {
                    const [title, content] = part.split('】');
                    return `
                        <div class="mb-3 last:mb-0">
                            <span class="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">${title}</span>
                            <span class="text-slate-600 text-sm block mt-1 leading-relaxed">${content}</span>
                        </div>
                     `;
                } else {
                    // Plain text without brackets (e.g. at start)
                    return `<div class="mb-2 text-slate-600 text-sm">${part}</div>`;
                }
            }).join('');
        }

        return `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden exercise-card shadow-sm transition-all">
            <!-- Card Header -->
            <div class="p-5 flex gap-5 items-start cursor-pointer select-none" onclick="app.toggleDetails('${dayKey}', '${safeId}')">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50/80 border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 pt-0.5">
                    ${index + 1}
                </div>
                <div class="flex-grow pt-1">
                    <h3 class="font-bold text-xl text-slate-800 leading-snug">${ex.name}</h3>
                    <div class="flex flex-wrap gap-2 mt-3">
                        ${ex.target ? `<span class="px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs border border-slate-100 font-medium">${ex.target}</span>` : ''}
                        ${ex.tempo ? `<span class="px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs border border-slate-100 font-medium">Tempo: ${ex.tempo}</span>` : ''}
                        ${(ex.rest && ex.rest !== "N/A") ? `<span class="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs border border-indigo-100 font-bold flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>${restText}</span>` : ''}
                    </div>
                    <div class="mt-3 text-accent font-medium text-sm flex items-center justify-between">
                        <span>${metaDuration}</span>
                        <div class="flex items-center gap-1 text-slate-400 text-xs whitespace-nowrap transition-colors hover:text-slate-600">
                            <span id="btn-text-${safeId}">${app.t('showDetails')}</span>
                            <svg id="icon-${safeId}" class="w-4 h-4 transition-transform duration-300 transform rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
                 <div class="flex items-center h-full pt-2 pl-2" onclick="event.stopPropagation()">
                     <input type="checkbox" id="check-${safeId}" class="custom-checkbox" onchange="app.toggleCheck('${dayKey}', '${safeId}')">
                </div>
            </div>

            <!-- Learning Content -->
            <div id="details-${safeId}" class="learning-content collapsed bg-slate-50 border-t border-slate-100 px-4">
                <div class="py-4"> 
                    ${safe(ex.setup).length > 0 ? `
                        <div class="mb-4 p-3 bg-white border border-slate-200 rounded text-xs text-slate-600 font-mono leading-relaxed shadow-sm">
                            ${ex.setup.map(s => `<div>${s}</div>`).join('')}
                        </div>
                    ` : ''}
                    
                    ${structuredNotes ? `
                        <div class="mb-4 border-l-2 border-accent/20 pl-3">
                            ${structuredNotes}
                        </div>
                    ` : ''}

                    ${ex.muscle_feeling ? `
                        <div class="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded text-sm text-slate-700">
                             <div class="flex items-center gap-2 mb-1">
                                <svg class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <span class="font-bold text-blue-900 text-xs uppercase tracking-wider">${app.t('muscleFeeling')}</span>
                             </div>
                             <p class="leading-relaxed pl-6 text-slate-600">${ex.muscle_feeling}</p>
                        </div>
                    ` : ''}

                    ${safe(ex.cues).length > 0 ? `
                        <div class="mb-4">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">${app.t('technique')}</h4>
                            <ul class="space-y-2">
                                ${ex.cues.map(c => {
            const html = c.replace(/\*\*(.*?)\*\*/g, '<span class="text-accent-hover font-bold">$1</span>');
            return `<li class="text-sm text-slate-600 pl-3 border-l-2 border-slate-200">${html}</li>`;
        }).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${safe(ex.mistakes).length > 0 ? `
                        <div>
                             <h4 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">${app.t('commonErrors')}</h4>
                             <div class="space-y-2">
                                ${ex.mistakes.map(m => `
                                    <div class="bg-red-50 border border-red-100 rounded p-2 text-sm">
                                        <div class="text-red-700 font-semibold">${m.error}</div>
                                        <div class="text-red-500 text-xs mt-0.5">${app.t('fix')}: ${m.fix}</div>
                                    </div>
                                `).join('')}
                             </div>
                        </div>
                    ` : ''}
                </div>
                
                 ${(ex.progression || ex.weight_selection) ? `
                     <div class="border-t border-slate-100 pt-4 pb-2 grid grid-cols-1 gap-4">
                         ${ex.weight_selection ? `
                             <div>
                                 <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">${app.t('weightSelection')}</h4>
                                 <div class="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
                                     ${ex.weight_selection.method ? `<div><span class="font-semibold text-slate-700">Method:</span> <span class="text-slate-500">${ex.weight_selection.method}</span></div>` : ''}
                                     ${ex.weight_selection.first_time_estimate ? `<div><span class="font-semibold text-slate-700">Estimate:</span> <span class="text-slate-500">${ex.weight_selection.first_time_estimate}</span></div>` : ''}
                                     ${ex.weight_selection.progression ? `<div><span class="font-semibold text-slate-700">Progression:</span> <span class="text-slate-500">${ex.weight_selection.progression}</span></div>` : ''}
                                 </div>
                             </div>
                         ` : ''}
                         ${ex.progression ? `
                             <div>
                                 <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">${app.t('progression')}</h4>
                                 <ul class="space-y-1">
                                     ${Array.isArray(ex.progression) ? ex.progression.map(p => `
                                         <li class="text-xs text-slate-500 flex items-start gap-2">
                                             <span class="text-slate-300 mt-0.5">•</span>
                                             <span>${p}</span>
                                         </li>
                                     `).join('') : `<li class="text-xs text-slate-500">${ex.progression}</li>`}
                                 </ul>
                             </div>
                         ` : ''}
                     </div>
                 ` : ''}
                </div>

            <!-- Logger Section (Rest Timer Only) -->
            <div class="px-5 pb-5 pt-2 bg-white">
                ${(ex.rest && ex.rest !== "N/A") ? `
                <div class="flex justify-end">
                    <button onclick="app.startTimer(this, ${restTime})" class="group cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
                        <span class="flex items-center gap-2 group-[.timer-active]:hidden">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>${app.t('restTimer')}</span>
                            <span class="opacity-75 text-xs">(${restText})</span>
                        </span>
                        <span class="hidden group-[.timer-active]:flex items-center gap-2 text-indigo-600">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span class="countdown-display font-mono font-bold"></span>
                        </span>
                    </button>
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

        // let originalContent = btn.innerHTML; // Using CSS toggle now
        let timeLeft = duration;

        btn.classList.add('timer-active', 'bg-indigo-50', 'text-indigo-600');
        btn.classList.remove('bg-slate-50', 'text-slate-500', 'hover:bg-slate-100', 'hover:text-slate-700');

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
                    btn.classList.remove('timer-active', 'bg-indigo-50', 'text-indigo-600');
                    btn.classList.add('bg-slate-50', 'text-slate-500');
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
