# ZimPhysique Training App

This application manages and displays workout plans. It uses **Vite**, **Tailwind CSS v4**, and **PWA** technologies with a JSON-based data structure.

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
*   **PWA**: Offline support via `vite-plugin-pwa`.
*   **Vanilla JS**: Core logic (`app.js`) without heavy UI frameworks.

## 📂 Data Structure & Git Versioning

Workout data is stored in the `data/` directory. The app **automatically detects** these files. There is no central manifest file.

### How it Works
The app scans `data/*.json`. It maps each filename directly to a training plan for that day.

**Filename Format**: `[day_key].json`

Examples:
*   `monday.json` -> Day: Monday
*   `daily.json` -> **Special**: "Daily Posture Correction" routine (always pinned to top)

### Version Updates via Git
Version tracking is entirely handled through Git. Rather than creating new files with version suffixes (e.g. `monday_v2.json`), modifications are made directly to the primary day-specific files. Git history preserves past versions, and only the latest state is displayed in the application.

### JSON Format
Each file should follow this structure:

```json
{
  "id": "module_a1_upper_chest_mid_delt",
  "title": "Upper Body Strength",
  "sections": {
    "warmup": [ ... ],   // Array of exercises
    "strength": [ ... ],
    "stretch": [ ... ]
  }
}
```

## 🎨 Customization

*   **Colors & Fonts**: Defined in `style.css` using Tailwind v4's `@theme` directive.
*   **Logic**: Main application logic is in `app.js`.
