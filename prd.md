**Project Name:** ZimPhysique Training Tracker
**Platform:** Mobile Web (Single File HTML)
**Core Philosophy:** Precision hypertrophy training based on Steve Zim's methodology, emphasizing Time Under Tension (TUT) and biomechanical correction.

**1. Technical Stack**
*   **Structure:** Single `index.html` file containing HTML, CSS, and JavaScript. No external build processes allowed.
*   **Styling:** Tailwind CSS (via CDN).
*   **Icons:** Heroicons (SVG strings) or simple Unicode characters (no emojis).
*   **Storage:** Browser LocalStorage for persistence (weights, reps, settings).

**2. UI/UX Design (Mobile First)**
*   **Theme:** Dark Mode (Background: Slate-900 or Zinc-950). Text needs high contrast.
*   **Layout:** Vertical scrolling, large touch targets (minimum 44px height for buttons).
*   **Typography:** Sans-serif (Inter or System UI). Large headings for visibility during exercise.

**3. Core Features**

**A. Dashboard (Home View)**
*   **Date Logic:** Display current date and day of the week.
*   **Dynamic Recommendation:** Automatically highlight the specific workout routine for the current day of the week (e.g., on Monday, show "Monday: Upper Body A").
*   **Mandatory Section:** Always display the "Daily Posture Correction" routine at the top with a distinct visual style (e.g., a warning border).
*   **Navigation:** Simple list of all available routines (Monday, Wednesday, Friday, Weekend, Recovery).

**B. Workout Session View**
*   **Header:** Routine title and total estimated time.
*   **Mode Toggle (Critical Feature):**
    *   **Learning Mode (Default):** For beginners. Displays detailed "Technical Cues" and "Common Mistakes" extracted from the text plan. Critical keywords in the text should be highlighted (bold or colored).
    *   **Pro Mode:** Hides all text descriptions. Only displays the exercise list, sets/reps logging inputs, and checkmarks.
*   **Exercise Card Component:**
    *   **Title:** Exercise Name.
    *   **Meta Data:** Sets, Reps, Tempo (e.g., 3-1-2).
    *   **Instruction Block (Visible in Learning Mode):**
        *   *Technique:* The "how-to" and biomechanics cues.
        *   *Warning:* The "common mistakes" and safety limits.
    *   **Logging Block:**
        *   Input field for Weight (kg).
        *   Input field for Reps achieved.
        *   "Save" logic: Saves to LocalStorage.
        *   "Last Session": Displays the weight/reps from the previous history if available.
    *   **Rest Timer:** A button to trigger a countdown (default 60s or 90s based on the plan).

**C. Data Logic (ETL Requirements)**
*   You must parse the provided "Workout Plan" text to populate the app.
*   **Mapping Rules:**
    *   Text under "Zim Technical Points" -> Maps to `cues/tips`.
    *   Text under "Common Errors" -> Maps to `mistakes`.
    *   Text under "Tempo" -> Maps to `tempo`.
    *   Structure the data by Days (Daily, Mon, Wed, Fri, Sat/Sun).

**4. User Flow**
1.  User opens App.
2.  App checks `new Date()` to determine the day.
3.  User clicks "Start [Today's Routine]".
4.  User toggles "Learning Mode" ON to read specific cue for the first exercise (e.g., "Do not lock elbows").
5.  User performs set, enters weight, checks box.
6.  User clicks Rest Timer.
7.  User finishes workout; data is saved locally.
