# Workout Rep & Set Counter

A simple browser app to time workouts, sets, and breaks — then review a session summary.

## How to run

Open `index.html` in your browser (double-click, or drag into Chrome/Edge/Firefox).

No install or build step required.

## Flow

1. **Date** — Shows the current date and time in **America/New_York** (US Eastern).
2. **Start Workout** — Starts the session timer (small display, top-left, `MM:SS`).
3. **Workout N · Start** — Begins **Set 1** (movement timer, `MM:SS`).
4. Press the main button again → **Break** timer.
5. Press again → **Set 2**, then break, and so on.
6. **Finish** — Ends the current exercise and advances to **Workout N+1 · Start**.
7. **Finish Workout** — Ends the session and shows a summary:
   - Total time, workout count, set/break counts
   - Per-workout breakdown of every set and break duration

## Files

- `index.html` — structure
- `styles.css` — layout and theme
- `app.js` — timers and session logic
