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
                <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="bg-accent/10 text-accent-hover text-xs px-2 py-1 rounded uppercase tracking-wider font-bold">${app.t('mandatory')}</span>
                            <h3 class="text-lg font-bold text-slate-800 mt-2">${app.t('dailyTitle')}</h3>
                        </div>
                    </div>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-2">${app.t('dailyDesc')}</p>
                    <button onclick="app.startWorkout('daily')" class="cursor-pointer w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
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
                        <button onclick="app.startWorkout('${day.key}')" class="cursor-pointer w-full text-left bg-white border ${isToday ? 'border-accent ring-1 ring-accent/20 shadow-md shadow-accent/5' : 'border-slate-200 shadow-sm'} hover:border-accent/50 rounded-xl p-4 transition-all relative overflow-hidden group">
                            ${isToday ? `<div class="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">TODAY</div>` : ''}
                            <h4 class="font-bold text-slate-800 ${isToday ? 'text-accent-hover' : ''}">${day.label}</h4>
                            <p class="text-slate-500 text-xs mt-1 group-hover:text-slate-600 transition-colors">${app.t('startWorkout')}</p>
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

        const html = `
            <div class="pb-24">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-900">${planData.title}</h2>
                    <div class="flex items-center gap-3 mt-2">
                         ${renderVersionSelector()}
                    </div>
                </div>

                <div class="space-y-8">
                    ${app.renderSection(app.t('warmUp'), planData.sections.warmup, dayKey)}
                    ${app.renderSection(app.t('strength'), planData.sections.strength, dayKey)}
                    ${app.renderSection(app.t('stretch'), planData.sections.stretch, dayKey)}
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
            <div>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">${title}</h3>
                <div class="space-y-6">
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
        const safeId = ex.id.replace(/[^a-zA-Z0-9-_]/g, '');

        // Extract rest time number
        let restTime = 60;
        let restText = "60s";
        if (ex.rest) {
            const match = ex.rest.match(/(\d+)/);
            if (match) {
                restTime = parseInt(match[1]);
                restText = ex.rest;
            }
        }

        const restLabel = app.state.lang === 'cn' ? '休息: ' : 'Rest: ';

        return `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden exercise-card shadow-sm transition-shadow hover:shadow-md">
            <!-- Card Header -->
            <div class="p-4 flex gap-4 items-start cursor-pointer select-none" onclick="app.toggleDetails('${dayKey}', '${safeId}')">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 pt-0.5">
                    ${index + 1}
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-lg text-slate-800 leading-tight">${ex.name}</h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                        ${ex.target ? `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs border border-slate-200">${ex.target}</span>` : ''}
                        ${ex.tempo ? `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs border border-slate-200">Tempo: ${ex.tempo}</span>` : ''}
                        ${ex.rest ? `<span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs border border-blue-100 font-bold flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>${restLabel}${ex.rest}</span>` : ''}
                    </div>
                    <div class="mt-2 text-accent font-medium text-sm flex items-center justify-between">
                        <span>${ex.sets_reps}</span>
                        <div class="flex items-center gap-1 text-slate-400 text-xs">
                            <span id="btn-text-${safeId}">${app.t('showDetails')}</span>
                            <svg id="icon-${safeId}" class="w-4 h-4 transition-transform duration-300 transform rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
                 <div class="flex items-center h-full pt-1" onclick="event.stopPropagation()">
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
            </div>

            <!-- Logger Section -->
            <div class="p-4 border-t border-slate-100 bg-white">
                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label class="block text-xs text-slate-400 mb-1 font-bold">${app.t('weight')}</label>
                        <input type="number" id="weight-${safeId}" class="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 text-sm font-bold focus:border-accent focus:bg-white focus:outline-none transition-colors" placeholder="0" onblur="app.saveData('${dayKey}', '${ex.id}', 'weight', this.value)">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1 font-bold">${app.t('reps')}</label>
                        <input type="number" id="reps-${safeId}" class="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 text-sm font-bold focus:border-accent focus:bg-white focus:outline-none transition-colors" placeholder="0" onblur="app.saveData('${dayKey}', '${ex.id}', 'reps', this.value)">
                    </div>
                </div>
                <button onclick="app.startTimer(this, ${restTime})" class="cursor-pointer w-full py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 bg-slate-50/50">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ${app.t('restTimer')} (${restText})
                </button>
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

        // Restore Weight/Reps
        const weightInputs = document.querySelectorAll('input[id^="weight-"]');
        weightInputs.forEach(input => {
            const domId = input.id.replace('weight-', '');
            const key = `zim_data_${dayKey}_${domId}_weight`;
            const val = localStorage.getItem(key);
            if (val) input.value = val;
        });

        const repInputs = document.querySelectorAll('input[id^="reps-"]');
        repInputs.forEach(input => {
            const domId = input.id.replace('reps-', '');
            const key = `zim_data_${dayKey}_${domId}_reps`;
            const val = localStorage.getItem(key);
            if (val) input.value = val;
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

    saveData: (dayKey, exId, field, value) => {
        const key = `zim_data_${dayKey}_${exId}_${field}`;
        localStorage.setItem(key, value);
    },

    startTimer: (btn, duration) => {
        if (btn.classList.contains('timer-active')) return;

        const originalText = btn.innerHTML;
        let timeLeft = duration;

        btn.classList.add('timer-active', 'bg-accent', 'text-white', 'border-accent');
        btn.classList.remove('hover:bg-slate-50', 'hover:text-slate-700', 'text-slate-500', 'bg-slate-50/50');

        const tick = () => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                btn.innerHTML = app.t('restComplete');
                document.getElementById('timer-beep').play().catch(e => console.log('Audio blocked', e));
                setTimeout(() => {
                    btn.classList.remove('timer-active', 'bg-accent', 'text-white', 'border-accent');
                    btn.classList.add('hover:bg-slate-50', 'hover:text-slate-700', 'text-slate-500', 'bg-slate-50/50');
                    btn.innerHTML = originalText;
                }, 3000);
            } else {
                btn.innerHTML = `<span class="font-bold font-mono text-base">${timeLeft}s</span>`;
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
