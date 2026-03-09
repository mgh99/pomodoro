# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

**Sin Docker** — abrir `index.html` directamente en el navegador. No se necesita servidor ni bundler.

**Con Docker:**
```bash
# Construir y levantar
docker compose up --build

# Solo levantar (si ya está construido)
docker compose up

# Detener
docker compose down
```

La app queda disponible en `http://localhost:8080`.

El `docker-compose.yml` monta `index.html` y `assets/` como volúmenes, por lo que los cambios en esos archivos se reflejan en el contenedor sin necesidad de reconstruir la imagen.

## Architecture

All JavaScript is written as **vanilla IIFE modules** (Immediately Invoked Function Expressions returning an object). Each module exposes a public API and is loaded via `<script>` tags in `index.html` in dependency order:

```
storage.js → settings.js → notifications.js → timer.js → session.js → app.js
```

**Module responsibilities:**

- `storage.js` — Low-level `localStorage` wrapper. Provides `getSettings/saveSettings` and `getStats/saveStats`. Stats reset daily by comparing `new Date().toDateString()`.
- `settings.js` — Owns the settings modal UI. Reads/writes via `Storage`. Dispatches `settings:saved` custom event when the user saves, so other modules can react without direct coupling.
- `notifications.js` — Generates beep sounds using the Web Audio API (no audio files needed). Also wraps the browser Notification API. Exposes `notify(mode)`, `showToast(message)`, and `requestPermission()`.
- `timer.js` — Pure countdown logic. Knows nothing about pomodoro modes. Exposes `reset(seconds)`, `toggle()`, `onComplete(cb)`. Updates the SVG ring progress via `stroke-dashoffset` using `CIRCUMFERENCE = 2π×90 = 565.48`.
- `session.js` — Owns the pomodoro cycle logic: tracks `cycleCount`, decides whether to go to short or long break, updates dots UI, and calls `Timer.reset()` on mode transitions. Listens for `settings:saved` to rebuild dots when cycle count changes.
- `app.js` — Entry point. Calls `Settings.init()`, `Session.init()`, wires the start/reset button click handlers, and requests notification permission.

## CSS theming

The active mode is stored as `data-mode` on `<body>` (`pomodoro` | `short` | `long`). The `--accent` CSS variable switches automatically via:

```css
body[data-mode="pomodoro"] { --accent: var(--color-pomodoro); }
body[data-mode="short"]    { --accent: var(--color-short); }
body[data-mode="long"]     { --accent: var(--color-long); }
```

All color-aware components (ring, buttons, tabs, stat values) use `var(--accent)`, so a single attribute change re-themes the whole UI.

## Key constraints

- No frameworks, no npm, no build tools — keep it as vanilla JS.
- Cross-module communication uses native `CustomEvent` dispatched on `document` (e.g., `settings:saved`), not direct calls, to keep modules decoupled.
- `Timer` must remain mode-agnostic; only `Session` interprets what a completion means.
