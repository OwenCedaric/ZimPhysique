import 'remixicon/fonts/remixicon.css';
import { translations } from './locales.js';
import { bookView } from './book/bookView.js';

// Make app global for inline onclick handlers in HTML
const app = {
    state: {
        currentView: 'home', // 'home', 'workout', 'theory', 'stage'
        activeDay: null, // 'monday', 'wednesday', 'friday', 'saturday', 'sunday'
        todayDayIndex: new Date().getDay(), // 0 = Sunday, 1 = Monday, etc.
        expandedCards: {}, // Stores state of expanded cards per day
        manifest: null, // Loaded from data/manifest.json
        workoutCache: {}, // Cache for loaded workout plans
        overviewData: null, // Loaded from data/overview.yaml
        showMasterPlanModal: false, // Whether master plan modal is open
        allExpanded: false, // Whether all exercise cards are expanded
        activeGoogleTalkIndex: 0, // Currently active Talks at Google chapter index (0-4)
        theme: localStorage.getItem('zim_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
        activeWorkoutTab: 'training', // 'training', 'recovery', 'strategy'
        language: localStorage.getItem('zim_lang') || localStorage.getItem('zim_book_lang') || 'zh', // 'zh', 'en'
        bookLanguage: localStorage.getItem('zim_lang') || localStorage.getItem('zim_book_lang') || 'zh',
        activeDomainId: null, // e.g. 'domain-biomechanics', 'domain-metabolism', etc.
        activeStageId: null, // Backward compatibility
        activeChapterId: null, // Backward compatibility
        actionTab: 'all', // 'all', 'workshop', 'routes' (Domain 03 dual-engine)
        exerciseFilter: 'all', // 'all', 'legs', 'back', 'shoulders', 'chest', 'arms', 'abs'
        exerciseSearchQuery: '',
        somatotypeTab: 'all', // 'all', 'ecto', 'meso', 'endo'
        selectedImageModal: null, // { src, title }
        showGoogleTalkEmbed: false, // Whether inline YouTube player is visible
        lbmCalc: {
            unit: localStorage.getItem('zim_calc_unit') || 'kg',
            weight: (localStorage.getItem('zim_calc_unit') === 'lbs') ? 154 : 70,
            bf: 18
        }
    },

    translations: translations,

    t: (key) => {
        const lang = app.state.language || 'zh';
        const dict = (app.translations && app.translations[lang]) ? app.translations[lang] : ((app.translations && app.translations.zh) ? app.translations.zh : app.translations);
        const fallback = (app.translations && app.translations.zh) ? app.translations.zh : app.translations;
        const keys = key.split('.');
        let val = dict;
        for (const k of keys) {
            val = val ? val[k] : null;
        }
        if (!val && dict !== fallback) {
            let fVal = fallback;
            for (const k of keys) {
                fVal = fVal ? fVal[k] : null;
            }
            val = fVal;
        }
        return val || key;
    },

    toggleTheme: () => {
        const isDark = document.documentElement.classList.contains('dark');
        const nextTheme = isDark ? 'light' : 'dark';
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
        localStorage.setItem('zim_theme', nextTheme);
        app.state.theme = nextTheme;
        app.renderHeaderActions();
    },

    openGoogleTalkModal: (startSeconds = 0) => {
        app.state.showGoogleTalkModal = true;
        let modal = document.getElementById('google-talk-video-modal');
        let iframe = document.getElementById('google-talk-iframe');
        const baseUrl = 'https://www.youtube.com/embed/aJRzBLTsNMQ?autoplay=1&enablejsapi=1';
        const videoUrl = startSeconds > 0 ? `${baseUrl}&start=${startSeconds}` : baseUrl;

        // Calculate matching active chapter index based on startSeconds
        let activeIdx = 0;
        const topics = [0, 510, 1065, 1690, 2210];
        for (let i = topics.length - 1; i >= 0; i--) {
            if (startSeconds >= topics[i]) {
                activeIdx = i;
                break;
            }
        }
        app.state.activeGoogleTalkIndex = activeIdx;
        
        if (modal && iframe) {
            iframe.src = videoUrl;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            app.updateGoogleTalkChapterUI(activeIdx);
        } else {
            // If modal is not in current DOM, switch to theory and open
            if (app.state.currentView !== 'theory' && app.state.currentView !== 'book') {
                app.openTheory();
                setTimeout(() => {
                    app.openGoogleTalkModal(startSeconds);
                }, 80);
            }
        }
    },

    seekGoogleTalk: (seconds = 0, idx = null) => {
        const modal = document.getElementById('google-talk-video-modal');
        const iframe = document.getElementById('google-talk-iframe');

        if (idx !== null) {
            app.state.activeGoogleTalkIndex = idx;
        } else {
            const topics = [0, 510, 1065, 1690, 2210];
            for (let i = topics.length - 1; i >= 0; i--) {
                if (seconds >= topics[i]) {
                    app.state.activeGoogleTalkIndex = i;
                    break;
                }
            }
        }
        
        if (!modal || modal.classList.contains('hidden')) {
            app.openGoogleTalkModal(seconds);
            return;
        }
        if (iframe) {
            iframe.src = `https://www.youtube.com/embed/aJRzBLTsNMQ?autoplay=1&enablejsapi=1&start=${seconds}`;
            app.updateGoogleTalkChapterUI(app.state.activeGoogleTalkIndex);
        }
    },

    previewGoogleTalkChapter: (idx) => {
        app.updateGoogleTalkChapterUI(idx);
    },

    resetGoogleTalkChapterPreview: () => {
        app.updateGoogleTalkChapterUI(app.state.activeGoogleTalkIndex ?? 0);
    },

    updateGoogleTalkChapterUI: (targetIdx) => {
        const container = document.getElementById('google-talk-chapters-row');
        if (!container) return;
        const items = container.querySelectorAll('.google-talk-chapter-card');
        items.forEach((item, i) => {
            const isTarget = i === targetIdx;
            const fullContent = item.querySelector('.chapter-full-content');
            const simpleContent = item.querySelector('.chapter-simple-content');
            
            if (isTarget) {
                item.classList.remove('flex-1', 'bg-subtle-fill/40', 'border-subtle-border');
                item.classList.add('flex-[3.5]', 'sm:flex-[4]', 'bg-surface', 'border-accent', 'shadow-md', 'ring-1', 'ring-accent/30');
                if (fullContent) fullContent.classList.remove('hidden');
                if (simpleContent) simpleContent.classList.add('hidden');
            } else {
                item.classList.remove('flex-[3.5]', 'sm:flex-[4]', 'border-accent', 'shadow-md', 'ring-1', 'ring-accent/30');
                item.classList.add('flex-1', 'bg-subtle-fill/40', 'border-subtle-border');
                if (fullContent) fullContent.classList.add('hidden');
                if (simpleContent) simpleContent.classList.remove('hidden');
            }
        });
    },

    closeGoogleTalkModal: () => {
        app.state.showGoogleTalkModal = false;
        const modal = document.getElementById('google-talk-video-modal');
        const iframe = document.getElementById('google-talk-iframe');
        if (iframe) {
            iframe.src = ''; // Clear source to immediately stop video & audio
        }
        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';
    },

    toggleGoogleTalkEmbed: () => {
        app.openGoogleTalkModal();
    },

    renderHeaderActions: () => {
        const headerActions = document.getElementById('header-actions');
        if (!headerActions) return;

        const isDark = document.documentElement.classList.contains('dark');
        const isTheory = app.state.currentView === 'theory' || app.state.currentView === 'domain' || app.state.currentView === 'stage' || app.state.currentView === 'book' || app.state.currentView === 'chapter';
        const lang = app.state.language || 'zh';
        const isEn = lang === 'en';

        headerActions.innerHTML = `
            <!-- Switch between Workouts and Theory Guide -->
            <button onclick="${isTheory ? 'app.goHome()' : 'app.openTheory()'}" class="cursor-pointer text-xs font-mono font-medium px-3 py-1.5 rounded-full border border-subtle-border bg-subtle-fill hover:bg-subtle-border/80 text-ink transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs" title="${isTheory ? (isEn ? 'Back to Daily Workouts' : '返回每日训练') : (isEn ? 'Theory Guide' : '理论指南')}">
                <i class="${isTheory ? 'ri-dumbbell-line text-accent' : 'ri-compass-3-line text-accent'} text-sm"></i>
                <span class="hidden sm:inline">${isTheory ? (isEn ? 'Workouts' : '每日训练') : (isEn ? 'Theory' : '理论指南')}</span>
                <span class="sm:hidden">${isTheory ? (isEn ? 'Workouts' : '训练') : (isEn ? 'Theory' : '理论')}</span>
            </button>

            <!-- Theme Switcher (Borderless minimal circle) -->
            <button onclick="app.toggleTheme()" class="cursor-pointer text-ink-secondary hover:text-ink w-8 h-8 rounded-full bg-subtle-fill hover:bg-subtle-border/80 transition-all flex items-center justify-center active:scale-90" title="${app.t('themeToggle')}" aria-label="Theme toggle">
                <i class="${isDark ? 'ri-sun-line text-amber-400' : 'ri-moon-line text-ink-secondary'} text-sm"></i>
            </button>
        `;
    },

    init: async () => {
        try {
            // Setup Manifest from Filenames
            app.state.manifest = { plans: {} };

            // Eagerly load all YAML files in data directory
            const modules = import.meta.glob('./data/*.{yaml,yml}', { eager: true });

            for (const path in modules) {
                const module = modules[path];
                // path is like "./data/monday.yaml"
                // Extract filename
                const filename = path.split('/').pop(); // "monday.yaml"
                const dayKey = filename.replace(/\.(yaml|yml)$/, ''); // "monday"

                if (dayKey === 'overview') {
                    app.state.overviewData = module.default || module;
                    continue;
                }

                app.state.manifest.plans[dayKey] = {
                    filename: filename
                };

                // Cache the data immediately
                app.state.workoutCache[filename] = module.default || module;
            }

            console.log("Generated Manifest:", app.state.manifest);
            app.renderHome();

            // Listen to OS theme change when no manual user preference is set
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('zim_theme')) {
                    if (e.matches) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.classList.remove('light');
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                    }
                    app.renderHeaderActions();
                }
            });

            // Global Escape key listener to close modals
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (app.state.showGoogleTalkModal) {
                        app.closeGoogleTalkModal();
                    } else if (app.state.selectedImageModal) {
                        app.closeImageModal();
                    } else if (app.state.showMasterPlanModal) {
                        app.toggleMasterPlanModal(false);
                    }
                }
            });

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

    toggleExerciseDetails: (exId) => {
        const details = document.getElementById(`details-${exId}`);
        const icon = document.getElementById(`icon-${exId}`);
        const card = document.getElementById(`card-${exId}`);
        if (!details) return;

        const isHidden = details.classList.contains('hidden');
        if (isHidden) {
            details.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(180deg)';
            if (card) card.classList.add('border-stroke-tint/70', 'ring-1', 'ring-stroke-tint/20');
        } else {
            details.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
            if (card) card.classList.remove('border-stroke-tint/70', 'ring-1', 'ring-stroke-tint/20');
        }
    },

    toggleAllExerciseDetails: () => {
        app.state.allExpanded = !app.state.allExpanded;
        const detailsEls = document.querySelectorAll('.exercise-details');
        const iconEls = document.querySelectorAll('[id^="icon-"]');
        const btnText = document.getElementById('btn-toggle-all-text');

        detailsEls.forEach(el => {
            if (app.state.allExpanded) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        iconEls.forEach(icon => {
            icon.style.transform = app.state.allExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        if (btnText) {
            btnText.innerText = app.state.allExpanded ? app.t('collapseAll') : app.t('expandAll');
        }
    },

    updateWorkoutProgress: (dayKey) => {
        const checkboxes = document.querySelectorAll('.exercise-checkbox');
        const checked = document.querySelectorAll('.exercise-checkbox:checked');
        const total = checkboxes.length;
        const count = checked.length;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

        const progressBar = document.getElementById('workout-progress-bar');
        const progressText = document.getElementById('workout-progress-text');
        const floatBtn = document.getElementById('workout-complete-float');

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (progressText) {
            progressText.innerText = `${count}/${total}`;
        }
        if (floatBtn) {
            floatBtn.classList.toggle('hidden', percent < 100);
        }
    },

    goHome: () => {
        app.state.currentView = 'home';
        app.state.activeDay = null;
        app.state.activeChapterId = null;
        app.state.activeStageId = null;
        app.state.activeDomainId = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        app.renderHome();
    },

    openTheory: (domainOrStageId = null, actionTab = null) => {
        if (domainOrStageId) {
            const mappedDomainId = app.mapToDomainId(domainOrStageId, actionTab);
            app.state.currentView = 'domain';
            app.state.activeDomainId = mappedDomainId;
            app.state.activeStageId = mappedDomainId;
            app.state.activeChapterId = mappedDomainId;
            if (actionTab) {
                app.state.actionTab = actionTab;
            }
            app.renderDomainView(mappedDomainId);
        } else {
            app.state.currentView = 'theory';
            app.state.activeDomainId = null;
            app.state.activeStageId = null;
            app.state.activeChapterId = null;
            app.renderTheoryHome();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    openDomain: (domainId, actionTab = null) => {
        app.openTheory(domainId, actionTab);
    },

    openStage: (stageId) => {
        app.openTheory(stageId);
    },

    setActionTab: (tab) => {
        app.state.actionTab = tab;
        if (app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        }
    },

    setExerciseFilter: (filter) => {
        app.state.exerciseFilter = filter;
        if (app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        }
    },

    setSomatotypeTab: (tab) => {
        app.state.somatotypeTab = tab;
        if (app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        }
    },

    handleExerciseSearch: (query) => {
        app.state.exerciseSearchQuery = query;
        const trimmed = (query || '').trim().toLowerCase();
        const container = document.getElementById('exercise-workshop-container');
        if (!container) return;

        const sections = container.querySelectorAll('.exercise-group-section');
        let totalVisible = 0;

        sections.forEach(sec => {
            const cards = sec.querySelectorAll('.exercise-item-card');
            let sectionVisible = 0;

            cards.forEach(card => {
                const searchIndex = (card.getAttribute('data-search-index') || '').toLowerCase();
                const terms = trimmed.split(/\s+/).filter(Boolean);
                const isMatch = terms.length === 0 || terms.every(term => searchIndex.includes(term));

                if (isMatch) {
                    card.style.display = '';
                    sectionVisible++;
                    totalVisible++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide section if 0 exercises matched inside it
            if (sectionVisible === 0 && trimmed.length > 0) {
                sec.style.display = 'none';
            } else {
                sec.style.display = '';
            }
        });

        // Update counter badge
        const counter = document.getElementById('exercise-search-counter');
        if (counter) {
            const isEn = app.state.bookLanguage === 'en';
            counter.innerText = isEn ? `${totalVisible} / 50` : `${totalVisible} / 50 动作`;
        }

        // Update clear button visibility
        const clearBtn = document.getElementById('exercise-search-clear-btn');
        if (clearBtn) {
            clearBtn.style.display = trimmed.length > 0 ? 'inline-flex' : 'none';
        }

        // Empty state container
        const emptyState = document.getElementById('exercise-search-empty-state');
        if (emptyState) {
            emptyState.style.display = (totalVisible === 0 && trimmed.length > 0) ? 'block' : 'none';
            const querySpan = emptyState.querySelector('.search-query-text');
            if (querySpan) querySpan.innerText = query;
        }
    },

    clearExerciseSearch: () => {
        app.state.exerciseSearchQuery = '';
        const input = document.getElementById('exercise-search-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        app.handleExerciseSearch('');
    },

    mapToDomainId: (id, actionTab = null) => {
        if (!id) return 'domain-biomechanics';
        if (id === 'domain-action') {
            return actionTab === 'routes' ? 'domain-somatotypes' : 'domain-exercises';
        }
        if (typeof id === 'string' && id.startsWith('domain-')) return id;
        if (id.startsWith('stage-')) {
            if (id === 'stage-foundations') return 'domain-biomechanics';
            if (id === 'stage-metabolism') return 'domain-metabolism';
            if (id === 'stage-exercises') return 'domain-exercises';
            if (id === 'stage-somatotypes') return 'domain-somatotypes';
            if (id === 'stage-lifestyle') return 'domain-longevity';
        }
        if (['intro', 'ch01', 'ch02', 'ch05'].includes(id)) return 'domain-biomechanics';
        if (['ch03', 'ch04'].includes(id)) return 'domain-metabolism';
        if (['ch06'].includes(id)) return 'domain-exercises';
        if (['ch07', 'ch08', 'ch09', 'ch10'].includes(id)) return 'domain-somatotypes';
        if (['ch11', 'ch12'].includes(id)) return 'domain-longevity';
        return 'domain-biomechanics';
    },

    mapToStageId: (id) => app.mapToDomainId(id),

    openBook: (domainOrStageId = null) => {
        app.openTheory(domainOrStageId);
    },

    openChapter: (chapterId) => {
        app.openTheory(chapterId);
    },

    setActivePillar: (pillarId) => {
        app.state.activePillarId = pillarId;
        app.renderTheoryHome();
    },

    setLanguage: (lang) => {
        if (lang !== 'zh' && lang !== 'en') lang = 'zh';
        app.state.language = lang;
        app.state.bookLanguage = lang;
        localStorage.setItem('zim_lang', lang);
        localStorage.setItem('zim_book_lang', lang);
        app.renderHeaderActions();
        if ((app.state.currentView === 'domain' || app.state.currentView === 'stage' || app.state.currentView === 'chapter') && app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        } else if (app.state.currentView === 'theory' || app.state.currentView === 'book') {
            app.renderTheoryHome();
        } else if (app.state.currentView === 'workout') {
            app.renderWorkout(app.state.activeDay);
        } else {
            app.renderHome();
        }
    },

    setBookLanguage: (lang) => {
        app.setLanguage(lang);
    },

    renderTheoryHome: () => {
        const container = document.getElementById('app-container');
        app.renderHeaderActions();
        container.innerHTML = bookView.renderTheoryHomeHTML(app) + bookView.renderImageModalHTML(app) + bookView.renderGoogleTalkModalHTML(app);
    },

    renderDomainView: (domainId) => {
        const container = document.getElementById('app-container');
        app.renderHeaderActions();
        container.innerHTML = bookView.renderDomainViewHTML(app, domainId) + bookView.renderImageModalHTML(app) + bookView.renderGoogleTalkModalHTML(app);
        if (domainId === 'domain-exercises' || domainId === 'domain-action') {
            if (app.state.exerciseSearchQuery) {
                app.handleExerciseSearch(app.state.exerciseSearchQuery);
            }
        }
    },

    renderStageView: (stageId) => app.renderDomainView(app.mapToDomainId(stageId)),
    renderBookHome: () => app.renderTheoryHome(),
    renderChapterView: (stageId) => app.renderDomainView(app.mapToDomainId(stageId)),

    openImageModal: (src, title) => {
        app.state.selectedImageModal = { src, title };
        if ((app.state.currentView === 'domain' || app.state.currentView === 'stage' || app.state.currentView === 'chapter') && app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        } else {
            app.renderTheoryHome();
        }
    },

    closeImageModal: () => {
        app.state.selectedImageModal = null;
        if ((app.state.currentView === 'domain' || app.state.currentView === 'stage' || app.state.currentView === 'chapter') && app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        } else {
            app.renderTheoryHome();
        }
    },

    updateLBMCalc: (field, val) => {
        if (!app.state.lbmCalc) {
            app.state.lbmCalc = {
                unit: localStorage.getItem('zim_calc_unit') || 'kg',
                weight: (localStorage.getItem('zim_calc_unit') === 'lbs') ? 154 : 70,
                bf: 18
            };
        }

        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            app.state.lbmCalc[field] = parsed;
        }

        const isKg = (app.state.lbmCalc.unit || 'kg') === 'kg';
        const isEn = (app.state.language || app.state.bookLanguage || 'zh') === 'en';

        let weightKg, weightLbs;
        if (isKg) {
            weightKg = app.state.lbmCalc.weight || 70;
            weightLbs = parseFloat((weightKg * 2.20462).toFixed(1));
        } else {
            weightLbs = app.state.lbmCalc.weight || 154;
            weightKg = parseFloat((weightLbs / 2.20462).toFixed(1));
        }

        const bf = app.state.lbmCalc.bf || 18;
        const fatKg = (weightKg * (bf / 100)).toFixed(1);
        const fatLbs = (weightLbs * (bf / 100)).toFixed(1);
        const lbmKg = (weightKg - fatKg).toFixed(1);
        const lbmLbs = (weightLbs - fatLbs).toFixed(1);

        const waterLiters = (weightKg * 0.033).toFixed(1);
        const waterOz = Math.round(weightLbs / 2);

        const tonePro = Math.round(lbmLbs * 1.25);
        const massPro = Math.round(lbmLbs * 1.5);

        // Synchronize numeric inputs and companion sliders
        const weightInput = document.getElementById('lbm-weight-input');
        const weightSlider = document.getElementById('lbm-weight-slider');
        const weightConv = document.getElementById('lbm-weight-conversion');
        const bfInput = document.getElementById('lbm-bf-input');
        const bfSlider = document.getElementById('lbm-bf-slider');

        if (weightInput && document.activeElement !== weightInput) {
            weightInput.value = isKg ? weightKg : weightLbs;
        }
        if (weightSlider && document.activeElement !== weightSlider) {
            weightSlider.value = isKg ? weightKg : weightLbs;
        }
        if (weightConv) {
            weightConv.innerText = isKg ? `≈ ${weightLbs} lbs` : `≈ ${weightKg} kg`;
        }

        if (bfInput && document.activeElement !== bfInput) {
            bfInput.value = bf;
        }
        if (bfSlider && document.activeElement !== bfSlider) {
            bfSlider.value = bf;
        }

        // Instant DOM update for output metric cards
        const outLbm = document.getElementById('lbm-out-lbm');
        const outFat = document.getElementById('lbm-out-fat');
        const outTone = document.getElementById('lbm-out-tone');
        const outMass = document.getElementById('lbm-out-mass');
        const outWater = document.getElementById('lbm-out-water');

        if (outLbm && outFat && outTone && outMass && outWater) {
            if (isKg) {
                outLbm.innerHTML = `
                    <div class="text-base sm:text-lg font-bold font-mono text-accent whitespace-nowrap">${lbmKg} kg</div>
                    <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${lbmLbs} lbs)</div>
                `;
                outFat.innerHTML = `
                    <div class="text-base sm:text-lg font-bold font-mono text-ink whitespace-nowrap">${fatKg} kg</div>
                    <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${fatLbs} lbs)</div>
                `;
                outWater.innerHTML = `
                    <div class="text-base sm:text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 whitespace-nowrap">${waterLiters} 升</div>
                    <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${waterOz} oz)</div>
                `;
            } else {
                outLbm.innerHTML = `
                    <div class="text-base sm:text-lg font-bold font-mono text-accent whitespace-nowrap">${lbmLbs} lbs</div>
                    <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${lbmKg} kg)</div>
                `;
                outFat.innerHTML = `
                    <div class="text-base sm:text-lg font-bold font-mono text-ink whitespace-nowrap">${fatLbs} lbs</div>
                    <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${fatKg} kg)</div>
                `;
                outWater.innerHTML = `
                    <div class="text-base sm:text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 whitespace-nowrap">${waterOz} oz</div>
                    <div class="text-[11px] font-mono text-ink-secondary whitespace-nowrap">(${waterLiters} 升)</div>
                `;
            }
            outTone.innerText = `${tonePro} ${isEn ? 'g / day' : '克/天'}`;
            outMass.innerText = `${massPro} ${isEn ? 'g / day' : '克/天'}`;
        }
    },

    stepLBMVal: (field, delta) => {
        if (!app.state.lbmCalc) {
            app.state.lbmCalc = {
                unit: localStorage.getItem('zim_calc_unit') || 'kg',
                weight: (localStorage.getItem('zim_calc_unit') === 'lbs') ? 154 : 70,
                bf: 18
            };
        }
        const isKg = (app.state.lbmCalc.unit || 'kg') === 'kg';
        let current = parseFloat(app.state.lbmCalc[field]);
        if (isNaN(current)) {
            current = (field === 'weight') ? (isKg ? 70 : 154) : 18;
        }
        let next = Math.round((current + delta) * 10) / 10;
        if (field === 'weight') {
            const minW = isKg ? 30 : 66;
            const maxW = isKg ? 250 : 550;
            if (next < minW) next = minW;
            if (next > maxW) next = maxW;
            const inp = document.getElementById('lbm-weight-input');
            if (inp) inp.value = next;
        } else if (field === 'bf') {
            if (next < 3) next = 3;
            if (next > 60) next = 60;
            const inp = document.getElementById('lbm-bf-input');
            if (inp) inp.value = next;
        }
        app.updateLBMCalc(field, next);
    },

    setLBMUnit: (newUnit) => {
        if (!app.state.lbmCalc) {
            app.state.lbmCalc = { unit: 'kg', weight: 70, bf: 18 };
        }
        const currentUnit = app.state.lbmCalc.unit || 'kg';
        if (currentUnit === newUnit) return;

        if (newUnit === 'lbs') {
            app.state.lbmCalc.weight = Math.round(app.state.lbmCalc.weight * 2.20462);
            app.state.lbmCalc.unit = 'lbs';
        } else {
            app.state.lbmCalc.weight = Math.round((app.state.lbmCalc.weight / 2.20462) * 2) / 2;
            app.state.lbmCalc.unit = 'kg';
        }
        localStorage.setItem('zim_calc_unit', newUnit);

        if ((app.state.currentView === 'domain' || app.state.currentView === 'stage' || app.state.currentView === 'chapter') && app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
        }
    },

    switchWorkoutTab: (tabId) => {
        app.state.activeWorkoutTab = tabId;
        // Re-render the workout view
        app.renderWorkout(app.state.activeDay);
    },

    toggleMasterPlanModal: (show) => {
        app.state.showMasterPlanModal = typeof show === 'boolean' ? show : !app.state.showMasterPlanModal;
        const modalEl = document.getElementById('master-plan-modal');
        if (modalEl) {
            if (app.state.showMasterPlanModal) {
                modalEl.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                modalEl.classList.add('hidden');
                document.body.style.overflow = '';
            }
        } else {
            // Re-render view to include modal
            if (app.state.currentView === 'home') {
                app.renderHome();
            } else {
                app.renderWorkout();
            }
        }
    },

    renderMasterPlanModalHTML: () => {
        const overview = app.state.overviewData;
        if (!overview) return '';

        const isOpen = app.state.showMasterPlanModal;

        return `
            <div id="master-plan-modal" class="${isOpen ? '' : 'hidden'} fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" onclick="if(event.target === this) app.toggleMasterPlanModal(false)">
                <div class="bg-surface text-ink max-w-[760px] w-full max-h-[88vh] overflow-y-auto rounded-2xl border border-subtle-border shadow-2xl p-5 sm:p-8 space-y-6 select-text transition-colors duration-200" onclick="event.stopPropagation()">
                    
                    <!-- Modal Header -->
                    <div class="flex items-start justify-between border-b border-subtle-border pb-5">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/10 text-accent">
                                    ${overview.current_phase ? overview.current_phase.name : 'Phase 1'}
                                </span>
                                <span class="text-xs text-ink-secondary font-mono">${overview.program_period || ''}</span>
                            </div>
                            <h2 class="text-[22px] sm:text-[28px] font-bold font-serif text-ink tracking-tight">${overview.title || app.t('masterPlan')}</h2>
                            <p class="text-ink-secondary text-xs sm:text-sm font-normal">${overview.subtitle || ''}</p>
                        </div>
                        <button onclick="app.toggleMasterPlanModal(false)" class="cursor-pointer text-ink-secondary hover:text-ink w-8 h-8 rounded-full bg-subtle-fill hover:bg-subtle-border/80 transition-colors flex items-center justify-center active:scale-95" aria-label="Close modal">
                            <i class="ri-close-line text-lg"></i>
                        </button>
                    </div>

                    <!-- Core Goals -->
                    ${overview.current_phase && overview.current_phase.core_goals ? `
                    <div class="space-y-2.5">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-ink-secondary font-mono">${app.t('phase')}: ${overview.current_phase.name}</h4>
                        <ul class="space-y-1.5 text-xs sm:text-sm text-ink leading-relaxed">
                            ${overview.current_phase.core_goals.map(goal => `
                                <li class="flex items-start gap-2">
                                    <span class="text-accent mt-0.5">›</span>
                                    <span>${goal}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Weekly Volume Budget -->
                    ${overview.weekly_volume_targets ? `
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-ink-secondary font-mono">${app.t('weeklyVolume')}</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                            ${Object.entries(overview.weekly_volume_targets).map(([k, v]) => `
                                <div class="p-3.5 rounded-xl bg-subtle-fill/60 border border-subtle-border space-y-1">
                                    <div class="flex items-center justify-between">
                                        <span class="font-serif font-bold text-ink text-sm">${app.t(k) || k}</span>
                                        ${v.total_sets ? `<span class="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-surface text-accent">${v.total_sets} 组/周</span>` : ''}
                                        ${v.frequency ? `<span class="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-surface text-ink">${v.frequency}</span>` : ''}
                                    </div>
                                    <p class="text-xs text-ink-secondary">${v.distribution || v.focus || ''}</p>
                                    ${v.ratio ? `<p class="text-[11px] text-ink-secondary/70 italic font-mono">${v.ratio}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Weekly Split Breakdown -->
                    ${overview.weekly_schedule ? `
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-ink-secondary font-mono">${app.t('weeklySchedule')}</h4>
                        <div class="space-y-2 text-xs">
                            ${Object.entries(overview.weekly_schedule).map(([k, s]) => `
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-surface border border-subtle-border gap-1.5 sm:gap-4">
                                    <div class="flex items-center gap-2">
                                        <span class="font-bold font-mono text-ink w-12 shrink-0">${s.day_name || k}</span>
                                        <span class="text-ink font-serif font-medium">${s.title}</span>
                                    </div>
                                    <div class="flex items-center gap-2 self-start sm:self-auto text-ink-secondary">
                                        ${s.tag ? `<span class="px-2 py-0.5 rounded-md bg-subtle-fill text-[11px] font-medium text-ink">${s.tag}</span>` : ''}
                                        ${s.fatigue_target ? `<span class="text-[11px] text-ink-secondary/70 font-mono">${s.fatigue_target}</span>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

                    <!-- Calibration Rules -->
                    ${overview.calibration_rules ? `
                    <div class="space-y-2.5 pt-2 border-t border-subtle-border">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-ink-secondary font-mono">${app.t('calibrationRules')}</h4>
                        <ul class="space-y-2 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                            ${overview.calibration_rules.map(rule => `
                                <li class="flex items-start gap-2">
                                    <i class="ri-checkbox-circle-line text-accent shrink-0 mt-0.5 text-sm"></i>
                                    <span>${rule}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <!-- Close Button -->
                    <div class="pt-2 text-center">
                        <button onclick="app.toggleMasterPlanModal(false)" class="cursor-pointer px-6 py-2.5 rounded-xl bg-subtle-fill hover:bg-subtle-border/80 font-medium text-ink text-xs transition-colors active:scale-95">
                            ${app.t('close')}
                        </button>
                    </div>

                </div>
            </div>
        `;
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
        if (app.state.currentView === 'theory' || app.state.currentView === 'book') {
            app.renderTheoryHome();
            return;
        }
        if ((app.state.currentView === 'domain' || app.state.currentView === 'stage' || app.state.currentView === 'chapter') && app.state.activeDomainId) {
            app.renderDomainView(app.state.activeDomainId);
            return;
        }

        const container = document.getElementById('app-container');
        const headerActions = document.getElementById('header-actions');
        const overview = app.state.overviewData;

        // Render Header Actions
        app.renderHeaderActions();

        const todayKey = app.getTodayKey();

        // Dynamic Schedule Generation
        const weekOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        // Get all available plan keys from manifest, excluding 'daily'
        const planKeys = Object.keys(app.state.manifest.plans).filter(k => k !== 'daily');

        // Sort keys based on weekOrder
        planKeys.sort((a, b) => {
            const indexA = weekOrder.indexOf(a);
            const indexB = weekOrder.indexOf(b);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });

        // Generate days array dynamically
        const days = planKeys.map(key => {
            const planConfig = app.state.manifest.plans[key];
            const data = app.state.workoutCache[planConfig.filename];
            const title = data ? data.title : key;
            const dayName = app.t(`weekdays.${key}`) || key;

            return {
                key: key,
                dayName: dayName,
                title: title,
                label: `${dayName}: ${title}`
            };
        });

        // Pre-compute today's prominent card
        const todayPlan = app.state.manifest.plans[todayKey];
        const todayData = todayPlan ? app.state.workoutCache[todayPlan.filename] : null;
        const todaySched = overview && overview.weekly_schedule ? overview.weekly_schedule[todayKey] : null;
        const todayDayName = app.t(`weekdays.${todayKey}`) || todayKey;
        const todayFocus = todaySched ? (todaySched.focus || todaySched.target_ratio || '') : '';
        const todayCardHTML = todayData ? `
            <button onclick="app.startWorkout('${todayKey}')" class="cursor-pointer w-full text-left border-2 border-accent/80 hover:border-accent rounded-2xl p-5 relative overflow-hidden group flex items-center justify-between min-h-[96px] transition-all bg-surface hover:bg-subtle-fill/30 shadow-xs active:scale-[0.99]">
                <!-- Subtle Ambient Light Bloom -->
                <div class="absolute -right-8 -top-8 w-40 h-40 bg-accent/[0.07] dark:bg-accent/[0.12] rounded-full blur-2xl pointer-events-none group-hover:bg-accent/[0.14] transition-colors duration-500"></div>

                <div class="space-y-1 min-w-0 flex-grow pr-4 relative z-10">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">${todayDayName}</span>
                        <span class="w-1 h-1 rounded-full bg-accent/60 inline-block"></span>
                        <span class="text-[10px] font-mono text-accent/80 uppercase tracking-widest">${app.t('todayTarget')}</span>
                    </div>
                    <h3 class="text-[20px] sm:text-[22px] font-bold font-serif text-ink tracking-tight leading-snug">${todayData.title}</h3>
                    ${todayFocus ? `<p class="text-ink-secondary text-xs leading-relaxed">${todayFocus}</p>` : ''}
                </div>

                <!-- Refined Precision Status Pill (Not a play button) -->
                <div class="shrink-0 flex items-center pl-2 relative z-10">
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-accent/35 bg-accent/[0.06] group-hover:bg-accent group-hover:border-accent group-hover:shadow-[0_4px_16px_rgba(43,109,145,0.22)] dark:group-hover:shadow-[0_4px_20px_rgba(130,161,185,0.25)] transition-all duration-300">
                        <span class="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-white dark:group-hover:bg-[#0a0e13] animate-pulse shrink-0"></span>
                        <span class="text-[12px] font-medium text-accent group-hover:text-white dark:group-hover:text-[#0a0e13] transition-colors tracking-wider whitespace-nowrap">${app.t('startWorkout')}</span>
                        <svg class="w-3.5 h-3.5 text-accent group-hover:text-white dark:group-hover:text-[#0a0e13] transition-transform duration-300 group-hover:translate-x-0.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 3.5L10.5 8L6 12.5"/>
                        </svg>
                    </div>
                </div>
            </button>
        ` : '';

        const otherDays = days.filter(d => d.key !== todayKey);

        let html = `
            <div class="space-y-5 pb-12">
                <!-- Date Header -->
                <div class="text-left pt-2 pb-1">
                    <p class="text-ink-secondary text-xs uppercase tracking-widest font-mono font-medium">${new Date().toLocaleDateString(app.state.language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <h2 class="text-[26px] sm:text-[32px] leading-tight font-bold font-serif text-ink mt-1 tracking-tight">${app.t('todayTarget')}</h2>
                </div>

                <!-- Today's Workout — Prominent Entry -->
                ${todayCardHTML}

                <!-- Daily Posture Correction (Mandatory) -->
                <button onclick="app.startWorkout('daily')" class="cursor-pointer w-full text-left bg-surface border border-subtle-border hover:border-accent/40 p-4 relative overflow-hidden group rounded-2xl hover:bg-subtle-fill/40 transition-all shadow-xs flex items-center justify-between min-h-[72px] gap-3">
                    <div class="flex items-center gap-3 min-w-0 flex-grow">
                        <div class="shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <i class="ri-body-scan-line text-sm text-accent"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] font-mono font-bold uppercase tracking-widest text-accent mb-0.5">${app.t('mandatory')}</p>
                            <h3 class="text-[15px] font-bold font-serif text-ink tracking-tight leading-snug">${app.t('dailyTitle')}</h3>
                        </div>
                    </div>
                    <i class="ri-arrow-right-line text-base text-ink-secondary group-hover:text-ink group-hover:translate-x-0.5 transition-all shrink-0"></i>
                </button>

                <!-- This Week (other days) -->
                ${otherDays.length > 0 ? `
                <div class="space-y-2.5">
                    <h3 class="text-ink-secondary text-[10px] font-bold uppercase tracking-widest font-mono">${app.t('weeklySchedule')}</h3>
                    ${otherDays.map(day => {
                        const sched = overview && overview.weekly_schedule ? overview.weekly_schedule[day.key] : null;
                        const focusText = sched ? (sched.target_ratio || sched.focus || '') : '';
                        const tagText = sched && sched.tag ? sched.tag : '';
                        return `
                        <button onclick="app.startWorkout('${day.key}')" class="cursor-pointer w-full text-left bg-surface border border-subtle-border hover:border-stroke-tint/60 hover:bg-subtle-fill/40 p-4 transition-all group flex justify-between items-center rounded-xl min-h-[72px]">
                            <div class="flex-grow pr-4 min-w-0">
                                <div class="flex items-center gap-2 mb-1 flex-wrap">
                                    <span class="text-xs font-mono font-bold text-ink uppercase tracking-wider">${day.dayName}</span>
                                    ${tagText ? `<span class="px-2 py-0.5 rounded-md bg-subtle-fill text-[10px] font-medium text-ink-secondary">${tagText}</span>` : ''}
                                </div>
                                <h4 class="font-serif font-bold text-ink text-[15px] sm:text-[16px] leading-snug">${day.title}</h4>
                                ${focusText ? `<p class="text-ink-secondary text-xs mt-0.5 line-clamp-1">${focusText}</p>` : ''}
                            </div>
                            <i class="ri-arrow-right-s-line text-xl text-ink-secondary group-hover:text-ink group-hover:translate-x-0.5 transition-all shrink-0"></i>
                        </button>
                        `;
                    }).join('')}
                </div>
                ` : ''}

                <!-- Hollywood Body Theory Guide - Featured Hub Card (Scheme B: 4 Core Domains) -->
                <button onclick="app.openTheory()" class="cursor-pointer w-full text-left bg-surface border border-subtle-border hover:border-accent/60 p-4 sm:p-5 rounded-2xl relative overflow-hidden group transition-all shadow-xs hover:bg-subtle-fill/40 flex items-center justify-between gap-4">
                    <div class="space-y-1 min-w-0 flex-grow pr-2">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent">
                                ${app.state.language === 'en' ? 'STEVE ZIM THEORY ARCHITECTURE' : 'STEVE ZIM 权威理论体系'}
                            </span>
                            <span class="text-[10px] font-mono text-ink-secondary hidden sm:inline">
                                ${app.state.language === 'en' ? '4 Core Domains · Architecture' : '4 大核心领域 · 知识体系'}
                            </span>
                        </div>
                        <h3 class="text-[16px] sm:text-[18px] font-bold font-serif text-ink tracking-tight leading-snug">
                            ${app.state.language === 'en' ? 'Hollywood Physique Theory & Methodology' : '好莱坞形体雕刻理论体系'}
                        </h3>
                        <p class="text-xs text-ink-secondary leading-relaxed line-clamp-1 font-sans">
                            ${app.state.language === 'en' ? 'Biomechanics · Fuel & Metabolism · Action Workshop & Somatotypes · Longevity & Identity' : '生物力学 · 能量代谢 · 实战工坊与体型定制 · 终身维持与身份固化'}
                        </p>
                    </div>
                    <div class="shrink-0 w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white dark:group-hover:text-[#0b0f14] transition-all">
                        <i class="ri-compass-3-line text-base"></i>
                    </div>
                </button>

                <!-- Master Plan — Compact Link Row -->
                ${overview ? `
                <button onclick="app.toggleMasterPlanModal(true)" class="cursor-pointer w-full flex items-center justify-between gap-3 py-3.5 border-t border-subtle-border text-left group">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <i class="ri-compass-3-line text-accent text-base shrink-0"></i>
                        <span class="text-sm font-medium text-ink group-hover:text-accent transition-colors truncate">${overview.title || app.t('masterPlan')}</span>
                        ${overview.current_phase ? `<span class="shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/10 text-accent">${overview.current_phase.name}</span>` : ''}
                    </div>
                    <i class="ri-arrow-right-s-line text-lg text-ink-secondary group-hover:text-ink transition-colors shrink-0"></i>
                </button>
                ` : ''}
            </div>
            ${app.renderMasterPlanModalHTML()}
            ${bookView.renderGoogleTalkModalHTML(app)}
        `;

        container.innerHTML = html;
    },

    renderWorkout: () => {
        const container = document.getElementById('app-container');
        app.renderHeaderActions();

        const dayKey = app.state.activeDay;

        const planData = app.state.activePlanData;

        if (!planData) return;

        const currentTab = app.state.activeWorkoutTab || 'training';

        // Tab UI
        const tabList = [
            { id: 'training', label: '训练' },
            { id: 'recovery', label: '放松' },
            { id: 'strategy', label: '理论' }
        ];

        const renderTabsHTML = `
            <div class="sticky top-16 z-20 -mx-4 sm:-mx-6 bg-canvas/80 backdrop-blur-md border-b border-subtle-border/60 mb-6 transition-colors duration-200">
                <div class="px-4 sm:px-6 flex items-center justify-between gap-3 py-2.5">
                    <div class="flex items-center gap-0.5 p-1 bg-subtle-fill/60 border border-subtle-border/40 rounded-xl">
                        ${tabList.map(tab => `
                            <button onclick="app.switchWorkoutTab('${tab.id}')"
                                    class="cursor-pointer text-xs font-medium px-4 py-1.5 rounded-lg transition-all ${currentTab === tab.id ? 'bg-surface text-ink font-semibold shadow-2xs border border-subtle-border/30' : 'text-ink-secondary hover:text-ink'}">
                                ${tab.label}
                            </button>
                        `).join('')}
                    </div>
                    ${currentTab !== 'strategy' ? `
                    <div class="flex items-center gap-2.5 shrink-0">
                        <span id="workout-progress-text" class="font-mono text-xs font-bold text-ink-secondary tabular-nums">0/0</span>
                        <button onclick="app.toggleAllExerciseDetails()" id="btn-toggle-all-details" class="cursor-pointer text-xs font-medium text-ink-secondary hover:text-ink px-2.5 py-1.5 rounded-lg bg-subtle-fill/60 hover:bg-subtle-border/60 transition-colors flex items-center gap-1.5 border border-subtle-border/40 active:scale-95">
                            <i class="ri-expand-vertical-line text-xs"></i>
                            <span id="btn-toggle-all-text">${app.state.allExpanded ? app.t('collapseAll') : app.t('expandAll')}</span>
                        </button>
                    </div>
                    ` : ''}
                </div>
                ${currentTab !== 'strategy' ? `
                <div class="h-[2px] bg-subtle-border/30">
                    <div id="workout-progress-bar" class="h-full bg-accent transition-all duration-300" style="width: 0%"></div>
                </div>
                ` : ''}
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
                tabContentHTML = `<div class="text-ink-secondary text-sm italic py-8 border-t border-subtle-border">暂无训练数据</div>`;
            }

        } else if (currentTab === 'recovery') {
            const orderedKeys = recoveryKeys.filter(k => allKeys.includes(k));
            tabContentHTML = orderedKeys.map(key => {
                const exercises = planData.sections[key];
                let title = key === 'stretch' ? app.t('stretch') : key;
                return app.renderSection(title, exercises, dayKey);
            }).join('');

            if (!tabContentHTML) {
                tabContentHTML = `<div class="text-ink-secondary text-sm italic py-8 border-t border-subtle-border">暂无放松数据</div>`;
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
            <div class="pb-36">
                <!-- Navigation Breadcrumb & Master Plan Pill -->
                <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <button onclick="app.goHome()" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary hover:text-ink transition-colors py-1">
                        <i class="ri-arrow-left-line"></i>
                        <span>${app.t('weeklySchedule')}</span>
                    </button>
                    ${app.state.overviewData ? `
                    <button onclick="app.toggleMasterPlanModal(true)" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary hover:text-ink py-1.5 px-3 rounded-full bg-subtle-fill hover:bg-subtle-border/80 transition-colors active:scale-95">
                        <i class="ri-compass-3-line text-accent"></i>
                        <span>${app.t('masterPlan')}</span>
                    </button>
                    ` : ''}
                </div>

                <!-- Main Title & Meta -->
                <div class="mb-6">
                    <h2 class="text-[26px] sm:text-[34px] leading-tight font-bold font-serif text-ink tracking-tight">${planData.title}</h2>
                     ${planData.execution_notes ? `
                        <div class="mt-5 p-4 sm:p-5 bg-subtle-fill/60 border border-subtle-border rounded-xl">
                             <div class="font-bold flex items-center gap-2 mb-2 text-ink text-xs uppercase tracking-wider font-mono">
                                <i class="ri-information-line text-accent text-sm"></i>
                                <span>${app.t('technique') || 'Notes'}</span>
                             </div>
                             <div class="space-y-1.5 text-ink-secondary text-xs sm:text-sm leading-relaxed">
                                ${Object.entries(planData.execution_notes).map(([k, v]) => `<div><span class="font-semibold text-ink">${k.replace(/_/g, ' ')}:</span> ${v}</div>`).join('')}
                             </div>
                        </div>
                     ` : ''}
                </div>

                ${renderTabsHTML}

                <div class="min-h-[400px]">
                    ${tabContentHTML}
                </div>
                
                <!-- Terminal Coda -->
                <div class="mt-16 pt-8 border-t border-subtle-border text-center">
                    <p class="text-[11px] font-mono font-bold text-ink-secondary uppercase tracking-[0.15em]">
                        ${app.t('sessionComplete')}
                    </p>
                </div>
            </div>

            <!-- Floating Complete Button (shown at 100%) -->
            <div id="workout-complete-float" class="hidden fixed bottom-0 left-0 right-0 z-40 p-4 safe-area-bottom bg-surface/95 backdrop-blur-md border-t border-subtle-border">
                <button onclick="app.goHome()" class="cursor-pointer w-full bg-accent font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-white dark:text-[#0a0e13] text-base shadow-sm">
                    <i class="ri-checkbox-circle-fill text-lg"></i>
                    <span>${app.t('finishWorkout')}</span>
                </button>
            </div>

            ${app.renderMasterPlanModalHTML()}
        `;

        container.innerHTML = html;
        app.restoreCheckboxState(dayKey);
    },

    renderSection: (title, exercises, dayKey) => {
        if (!exercises || exercises.length === 0) return '';

        return `
            <div class="mb-14">
                <div class="flex items-center justify-between mb-5 pb-2.5 border-b border-subtle-border">
                     <h3 class="text-[20px] font-bold font-serif text-ink tracking-tight flex items-center gap-2.5">
                         <span>${title}</span>
                         <span class="text-xs font-normal text-ink-secondary font-mono px-2 py-0.5 rounded-full bg-subtle-fill border border-subtle-border/40">
                             ${exercises.length}
                         </span>
                     </h3>
                </div>
                <!-- Vertical Exercise Stream -->
                <div class="space-y-3.5">
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

        const restLabel = '休息: ';

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
        <div id="card-${safeId}" class="bg-surface border border-subtle-border rounded-xl overflow-hidden transition-all duration-200 hover:border-stroke-tint/40 shadow-xs exercise-card">
            <!-- Compact Header (Always Visible) -->
            <div onclick="app.toggleExerciseDetails('${safeId}')" class="p-3.5 sm:p-4.5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none group/header hover:bg-subtle-fill/40 transition-colors">
                <div class="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-grow">
                    <!-- Exercise Index Badge -->
                    <span class="w-6 h-6 rounded-md bg-subtle-fill text-ink-secondary font-mono text-xs font-semibold flex items-center justify-center shrink-0">
                        ${String(index + 1).padStart(2, '0')}
                    </span>
                    <!-- Exercise Info -->
                    <div class="min-w-0 flex-grow">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h4 class="font-bold text-[16px] sm:text-[17px] font-serif text-ink leading-tight truncate">${ex.name}</h4>
                            ${metaDuration ? `<span class="inline-flex items-center text-xs font-mono font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 shrink-0">${metaDuration}</span>` : ''}
                        </div>
                        <div class="flex items-center gap-2 sm:gap-3 text-xs text-ink-secondary mt-1">
                            ${ex.target ? `<span class="uppercase tracking-wider font-semibold text-[11px] truncate">${ex.target}</span>` : ''}
                            ${(ex.target && ex.tempo) ? `<span class="opacity-40">•</span>` : ''}
                            ${ex.tempo ? `<span class="font-mono opacity-70 italic text-[11px] hidden sm:inline">Tempo: ${ex.tempo}</span>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Actions: Timer + Checkbox + Chevron -->
                <div class="flex items-center gap-3 sm:gap-4 shrink-0" onclick="event.stopPropagation()">
                    ${(ex.rest && ex.rest !== "N/A") ? `
                    <button onclick="app.startTimer(this, ${restTime})" class="group cursor-pointer h-7 px-2.5 flex items-center gap-1 bg-subtle-fill hover:bg-subtle-border/80 text-ink-secondary transition-all rounded-lg active:scale-95 text-xs font-mono" title="${app.t('restTimer')} (${restText})">
                        <i class="ri-timer-line group-[.timer-active]:hidden text-xs"></i>
                        <span class="group-[.timer-active]:hidden hidden sm:inline font-medium text-[11px]">${restText}</span>
                        <span class="hidden group-[.timer-active]:inline font-mono font-bold text-accent countdown-display text-xs"></span>
                    </button>
                    ` : ''}
                    <input type="checkbox" id="check-${safeId}" class="custom-checkbox exercise-checkbox cursor-pointer" onchange="app.toggleCheck('${dayKey}', '${safeId}')">
                    <button onclick="app.toggleExerciseDetails('${safeId}')" class="w-7 h-7 flex items-center justify-center text-ink-secondary hover:text-ink transition-colors rounded-lg hover:bg-subtle-fill active:scale-95 cursor-pointer" aria-label="Toggle details">
                        <i id="icon-${safeId}" class="ri-arrow-down-s-line text-lg transition-transform duration-200"></i>
                    </button>
                </div>
            </div>

            <!-- Learning Content (Collapsible Drawer) -->
            <div id="details-${safeId}" class="exercise-details hidden border-t border-subtle-border bg-subtle-fill/15 p-4 sm:p-6 space-y-5 select-text">
                ${safe(ex.setup).length > 0 ? `
                    <div>
                        <h5 class="text-xs font-bold font-serif text-ink uppercase tracking-wider mb-2 text-ink-secondary">${app.t('setup') || 'Setup'}</h5>
                        <div class="pl-3.5 border-l-2 border-subtle-border text-sm text-ink-secondary font-mono leading-relaxed space-y-1">
                            ${ex.setup.map(s => `<div>${s}</div>`).join('')}
                        </div>
                    </div>
                ` : ''}

                ${structuredNotes ? `
                    <div class="text-sm">
                        ${structuredNotes}
                    </div>
                ` : ''}

                ${ex.muscle_feeling ? `
                    <div class="pl-3.5 border-l-[3px] border-accent bg-accent/[0.07] p-3 rounded-r-xl">
                        <div class="font-bold font-serif text-ink uppercase tracking-wider text-xs mb-1 flex items-center gap-1.5"><i class="ri-focus-3-line text-accent text-sm"></i>${app.t('muscleFeeling')}</div>
                        <p class="leading-relaxed text-sm text-ink-secondary">${ex.muscle_feeling}</p>
                    </div>
                ` : ''}

                ${safe(ex.cues).length > 0 ? `
                    <div>
                        <h5 class="text-xs font-bold font-serif text-ink uppercase tracking-wider mb-2">${app.t('technique')}</h5>
                        <ul class="space-y-1.5">
                            ${ex.cues.map(c => {
            const html = c.replace(/\*\*(.*?)\*\*/g, '<span class="text-ink font-bold">$1</span>');
            return `<li class="text-sm text-ink-secondary pl-3.5 border-l-2 border-subtle-border leading-relaxed">${html}</li>`;
        }).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${safe(ex.mistakes).length > 0 ? `
                    <div>
                        <h5 class="text-xs font-bold font-serif text-ink uppercase tracking-wider mb-2">${app.t('commonErrors')}</h5>
                        <div class="space-y-2">
                            ${ex.mistakes.map(m => `
                                <div class="pl-3.5 border-l-2 border-amber-500/60 py-0.5 text-sm">
                                    <div class="text-ink font-semibold leading-snug"><del class="text-rose-600/80 dark:text-rose-400/80 opacity-75">${m.error}</del></div>
                                    <div class="text-ink-secondary mt-0.5 leading-snug"><span class="uppercase tracking-wider text-[11px] font-bold text-accent mr-1.5">${app.t('fix')}:</span> ${m.fix}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${(ex.progression || ex.weight_selection) ? `
                    <div class="border-t border-subtle-border/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        ${ex.weight_selection ? `
                            <div>
                                <h5 class="text-xs font-bold font-serif text-ink uppercase tracking-wider mb-1.5">${app.t('weightSelection')}</h5>
                                <div class="space-y-1 text-ink-secondary leading-relaxed text-xs sm:text-sm">
                                    ${ex.weight_selection.method ? `<div><span class="font-serif font-bold text-ink mr-1.5">Method:</span> ${ex.weight_selection.method}</div>` : ''}
                                    ${ex.weight_selection.first_time_estimate ? `<div><span class="font-serif font-bold text-ink mr-1.5">Estimate:</span> ${ex.weight_selection.first_time_estimate}</div>` : ''}
                                    ${ex.weight_selection.progression ? `<div><span class="font-serif font-bold text-ink mr-1.5">Progression:</span> ${ex.weight_selection.progression}</div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        ${ex.progression ? `
                            <div>
                                <h5 class="text-xs font-bold font-serif text-ink uppercase tracking-wider mb-1.5">${app.t('progression')}</h5>
                                <ul class="space-y-1 text-ink-secondary leading-relaxed text-xs sm:text-sm">
                                    ${Array.isArray(ex.progression) ? ex.progression.map(p => `
                                        <li class="flex items-start gap-1.5">
                                            <span class="text-accent">›</span>
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
        const checkboxes = document.querySelectorAll('.exercise-checkbox');
        checkboxes.forEach(input => {
            const domId = input.id.replace('check-', '');
            const key = `zim_log_${new Date().toLocaleDateString()}_${dayKey}_${domId}_done`;
            if (localStorage.getItem(key)) {
                input.checked = true;
                const card = document.getElementById(`card-${domId}`);
                if (card) card.classList.add('opacity-60');
            }
        });
        app.updateWorkoutProgress(dayKey);
    },

    toggleCheck: (dayKey, exId) => {
        const key = `zim_log_${new Date().toLocaleDateString()}_${dayKey}_${exId}_done`;
        const input = document.getElementById(`check-${exId}`);
        const card = document.getElementById(`card-${exId}`);
        if (input && input.checked) {
            localStorage.setItem(key, 'true');
            if (card) card.classList.add('opacity-60');
        } else {
            localStorage.removeItem(key);
            if (card) card.classList.remove('opacity-60');
        }
        app.updateWorkoutProgress(dayKey);
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

        btn.classList.add('timer-active', 'bg-accent/15', 'text-accent');
        btn.classList.remove('text-ink-secondary', 'hover:bg-subtle-border/80');

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
                    btn.classList.remove('timer-active', 'bg-accent/15', 'text-accent');
                    btn.classList.add('text-ink-secondary');
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
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (app.state.selectedImageModal) {
            app.closeImageModal();
        } else if (app.state.showMasterPlanModal) {
            app.toggleMasterPlanModal(false);
        }
    }
});
window.app = app;
