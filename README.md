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

## 📂 Data Structure & Versioning

Workout data is stored in the `data/` directory. The app **automatically detects** these files. There is no central manifest file.

### How it Works
The app scans `data/*.json`. It parses filenames to determine the **Day** and **Version**.

**Filename Format**: `[day_key]_v[version_number].json`

Examples:
*   `monday_v1.json` -> Day: Monday, Version: 1
*   `upper_v2.json` -> Day: Upper, Version: 2

### Adding a New Version
To add a new workout plan or version, **simply create a new JSON file**:

1.  Create `data/monday_v2.json`.
2.  The app will automatically detect it, add it to the "Monday" group, and set it as the active version if it's the latest.

### JSON Format
Each file should follow this structure:

```json
{
  "id": "monday_v2",     // Unique ID for this specific file version
  "version": 2,          // Integer
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
