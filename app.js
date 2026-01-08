const app = {
    state: {
        currentView: 'home', // 'home' or 'workout'
        activeDay: null, // 'monday', 'wednesday', 'friday', 'saturday', 'sunday'
        todayDayIndex: new Date().getDay(), // 0 = Sunday, 1 = Monday, etc.
        expandedCards: {}, // Stores state of expanded cards per day
    },

    init: () => {
        app.renderHome();
    },

    toggleDetails: (dayKey, index) => {
        const content = document.getElementById(`details-${index}`);
        const icon = document.getElementById(`icon-${index}`);
        const btnText = document.getElementById(`btn-text-${index}`);

        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            icon.style.transform = 'rotate(180deg)';
            if (btnText) btnText.innerText = 'Hide Details';
        } else {
            content.classList.add('collapsed');
            icon.style.transform = 'rotate(0deg)';
            if (btnText) btnText.innerText = 'Show Details';
        }
    },

    goHome: () => {
        app.state.currentView = 'home';
        app.renderHome();
    },

    startWorkout: (dayKey) => {
        app.state.currentView = 'workout';
        app.state.activeDay = dayKey;
        app.renderWorkout(dayKey);
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
        headerActions.innerHTML = ''; // Clear header actions

        const todayKey = app.getTodayKey();
        const days = [
            { key: 'monday', label: 'Monday: Upper Body A' },
            { key: 'wednesday', label: 'Wednesday: Lower Body' },
            { key: 'friday', label: 'Friday: Upper Body B' },
            { key: 'saturday', label: 'Saturday: Weak Link A' },
            { key: 'sunday', label: 'Sunday: Posture Fix B' },
        ];

        let html = `
            <div class="space-y-6 pb-10">
                <!-- Date Header -->
                <div class="text-center py-4">
                    <p class="text-slate-500 text-sm uppercase tracking-wider font-semibold">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <h2 class="text-2xl font-bold text-slate-800 mt-1">Today's Target</h2>
                </div>

                <!-- Daily Posture Correction (Mandatory) -->
                <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="bg-accent/10 text-accent-hover text-xs px-2 py-1 rounded uppercase tracking-wider font-bold">Mandatory</span>
                            <h3 class="text-lg font-bold text-slate-800 mt-2">Daily Posture Correction</h3>
                        </div>
                    </div>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-2">Complete this 15-min routine before any workout to fix pelvic tilt and rounded shoulders.</p>
                    <button onclick="app.startWorkout('daily')" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                        <span>Start Ritual</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    <!-- Small list preview -->
                     <div class="mt-4 space-y-2 border-t border-slate-100 pt-3">
                        ${WORKOUT_DATA.daily.slice(0, 3).map(ex => `
                            <div class="flex items-center gap-2 text-xs text-slate-500">
                                <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                ${ex.name.split(' - ')[0]}
                            </div>
                        `).join('')}
                        <div class="text-xs text-slate-400 italic pl-3.5">+ ${WORKOUT_DATA.daily.length - 3} more movements</div>
                    </div>
                </div>

                <!-- Workouts List -->
                <div class="space-y-3">
                    <h3 class="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">Weekly Schedule</h3>
                    ${days.map(day => {
            const isToday = day.key === todayKey;
            return `
                        <button onclick="app.startWorkout('${day.key}')" class="w-full text-left bg-white border ${isToday ? 'border-accent ring-1 ring-accent/20 shadow-md shadow-accent/5' : 'border-slate-200 shadow-sm'} hover:border-accent/50 rounded-xl p-4 transition-all relative overflow-hidden group">
                            ${isToday ? `<div class="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">TODAY</div>` : ''}
                            <h4 class="font-bold text-slate-800 ${isToday ? 'text-accent-hover' : ''}">${day.label}</h4>
                            <p class="text-slate-500 text-xs mt-1 group-hover:text-slate-600 transition-colors">Found ${WORKOUT_DATA[day.key]?.length || 0} Exercises</p>
                        </button>
                        `
        }).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderWorkout: (dayKey) => {
        const container = document.getElementById('app-container');
        const headerActions = document.getElementById('header-actions');

        // Clear Header Actions (No toggles needed, manual expansion is per card)
        headerActions.innerHTML = '';

        const exercises = WORKOUT_DATA[dayKey] || [];
        const titleMap = {
            'daily': 'Daily Posture Correction',
            'monday': 'Mon: Upper Body A',
            'wednesday': 'Wed: Lower Body',
            'friday': 'Fri: Upper Body B',
            'saturday': 'Sat: Weak Link A',
            'sunday': 'Sun: Posture Fix B'
        };

        if (exercises.length === 0) {
            container.innerHTML = `
                <div class="h-full flex flex-col items-center justify-center text-center pt-20">
                     <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">Rest & Recover</h2>
                    <p class="text-slate-500 max-w-xs mx-auto mb-8">No specific workout scheduled for today. Focus on recovery, hydration, and the Daily Posture Correction.</p>
                    <button onclick="app.goHome()" class="text-accent font-bold hover:text-accent-hover transition-colors">Return Home</button>
                </div>
            `;
            return;
        }

        const html = `
            <div class="pb-24">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-slate-900">${titleMap[dayKey] || 'Workout Session'}</h2>
                    <div class="flex items-center gap-3 mt-2 text-sm text-slate-500">
                        <span>${exercises.length} Exercises</span>
                        <span>•</span>
                        <span>Est. 45-60 min</span>
                    </div>
                </div>

                <div class="space-y-6">
                    ${exercises.map((ex, index) => app.renderExerciseCard(ex, index, dayKey)).join('')}
                </div>
                
                <div class="mt-8 p-4 bg-slate-100 rounded-lg text-center border border-slate-200">
                    <h3 class="text-slate-800 font-bold mb-2">Session Complete?</h3>
                    <button onclick="app.goHome()" class="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-accent/20">
                        Finish Workout
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Re-apply checked states & inputs
        exercises.forEach((ex, idx) => {
            const key = `zim_log_${new Date().toLocaleDateString()}_${dayKey}_${idx}_done`;
            if (localStorage.getItem(key)) {
                document.getElementById(`check-${idx}`).checked = true;
            }
            const inputW = document.getElementById(`weight-${idx}`);
            const inputR = document.getElementById(`reps-${idx}`);
            if (inputW && localStorage.getItem(`zim_data_${dayKey}_${ex.id}_weight`)) inputW.value = localStorage.getItem(`zim_data_${dayKey}_${ex.id}_weight`);
            if (inputR && localStorage.getItem(`zim_data_${dayKey}_${ex.id}_reps`)) inputR.value = localStorage.getItem(`zim_data_${dayKey}_${ex.id}_reps`);
        });
    },

    renderExerciseCard: (ex, index, dayKey) => {
        const safe = (arr) => arr && arr.length ? arr : [];

        // Extract rest time number for timer button text default
        let restTime = 60;
        let restText = "60s";
        if (ex.rest) {
            const match = ex.rest.match(/(\d+)/);
            if (match) {
                restTime = parseInt(match[1]);
                restText = ex.rest;
            }
        }

        return `
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden exercise-card shadow-sm transition-shadow hover:shadow-md">
            <!-- Card Header (Clickable for Expand) -->
            <div class="p-4 flex gap-4 items-start cursor-pointer select-none" onclick="app.toggleDetails('${dayKey}', ${index})">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 pt-0.5">
                    ${index + 1}
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-lg text-slate-800 leading-tight">${ex.name}</h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                        ${ex.target ? `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs border border-slate-200">${ex.target}</span>` : ''}
                        ${ex.tempo ? `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs border border-slate-200">Tempo: ${ex.tempo}</span>` : ''}
                        ${ex.rest ? `<span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs border border-blue-100 font-bold flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Rest: ${ex.rest}</span>` : ''}
                    </div>
                    <div class="mt-2 text-accent font-medium text-sm flex items-center justify-between">
                        <span>${ex.sets_reps}</span>
                        <div class="flex items-center gap-1 text-slate-400 text-xs">
                            <span id="btn-text-${index}">Show Details</span>
                            <svg id="icon-${index}" class="w-4 h-4 transition-transform duration-300 transform rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
                 <div class="flex items-center h-full pt-1" onclick="event.stopPropagation()">
                     <input type="checkbox" id="check-${index}" class="custom-checkbox" onchange="app.toggleCheck('${dayKey}', ${index})">
                </div>
            </div>

            <!-- Learning Content (Collapsed by default) -->
            <div id="details-${index}" class="learning-content collapsed bg-slate-50 border-t border-slate-100 px-4">
                <div class="py-4"> <!-- Inner pad for smooth transition -->
                    <!-- Setup -->
                    ${safe(ex.setup).length > 0 ? `
                        <div class="mb-4 p-3 bg-white border border-slate-200 rounded text-xs text-slate-600 font-mono leading-relaxed shadow-sm">
                            ${ex.setup.map(s => `<div>${s}</div>`).join('')}
                        </div>
                    ` : ''}

                    <!-- Cues -->
                    ${safe(ex.cues).length > 0 ? `
                        <div class="mb-4">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technique</h4>
                            <ul class="space-y-2">
                                ${ex.cues.map(c => {
            const html = c.replace(/\*\*(.*?)\*\*/g, '<span class="text-accent-hover font-bold">$1</span>');
            return `<li class="text-sm text-slate-600 pl-3 border-l-2 border-slate-200">${html}</li>`;
        }).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <!-- Mistakes -->
                    ${safe(ex.mistakes).length > 0 ? `
                        <div>
                             <h4 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                Common Errors
                             </h4>
                             <div class="space-y-2">
                                ${ex.mistakes.map(m => `
                                    <div class="bg-red-50 border border-red-100 rounded p-2 text-sm">
                                        <div class="text-red-700 font-semibold">${m.error}</div>
                                        <div class="text-red-500 text-xs mt-0.5">Fix: ${m.fix}</div>
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
                        <label class="block text-xs text-slate-400 mb-1 font-bold">WEIGHT (KG)</label>
                        <input type="number" id="weight-${index}" class="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 text-sm font-bold focus:border-accent focus:bg-white focus:outline-none transition-colors" placeholder="0" onblur="app.saveData('${dayKey}', '${ex.id}', 'weight', this.value)">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1 font-bold">REPS</label>
                        <input type="number" id="reps-${index}" class="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-800 text-sm font-bold focus:border-accent focus:bg-white focus:outline-none transition-colors" placeholder="0" onblur="app.saveData('${dayKey}', '${ex.id}', 'reps', this.value)">
                    </div>
                </div>
                <button onclick="app.startTimer(this, ${restTime})" class="w-full py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 bg-slate-50/50">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Rest Timer (${restText})
                </button>
            </div>
        </div>
        `;
    },

    toggleCheck: (dayKey, index) => {
        const key = `zim_log_${new Date().toLocaleDateString()}_${dayKey}_${index}_done`;
        const input = document.getElementById(`check-${index}`);
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
                btn.innerHTML = 'Rest Complete';
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
