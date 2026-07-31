/**
 * Workout Rep & Set Counter
 * Timezone: America/New_York (US Eastern)
 */

const TIMEZONE = "America/New_York";

// ── DOM ──────────────────────────────────────────────────────────
const els = {
  mainTimer: document.getElementById("main-timer"),
  mainTimerValue: document.getElementById("main-timer-value"),
  screenStart: document.getElementById("screen-start"),
  screenActive: document.getElementById("screen-active"),
  screenSummary: document.getElementById("screen-summary"),
  currentDate: document.getElementById("current-date"),
  currentTime: document.getElementById("current-time"),
  btnStartWorkout: document.getElementById("btn-start-workout"),
  sessionTitle: document.getElementById("session-title"),
  phaseCard: document.getElementById("phase-card"),
  phaseLabel: document.getElementById("phase-label"),
  phaseTimer: document.getElementById("phase-timer"),
  phaseHint: document.getElementById("phase-hint"),
  btnCycle: document.getElementById("btn-cycle"),
  btnFinishExercise: document.getElementById("btn-finish-exercise"),
  btnFinishWorkout: document.getElementById("btn-finish-workout"),
  liveLogList: document.getElementById("live-log-list"),
  summaryMeta: document.getElementById("summary-meta"),
  summaryBody: document.getElementById("summary-body"),
  btnNewSession: document.getElementById("btn-new-session"),
};

// ── State ────────────────────────────────────────────────────────
/**
 * phase: "idle" | "work" | "break"
 * workouts: Array of { number, segments: Array of { type: "set"|"break", number, durationMs } }
 */
const state = {
  workoutStartedAt: null,
  mainElapsedMs: 0,
  mainTimerId: null,
  phase: "idle",
  phaseStartedAt: null,
  phaseElapsedMs: 0,
  phaseTimerId: null,
  workoutNumber: 1,
  setNumber: 1,
  workouts: [],
  currentSegments: [],
};

// ── Time helpers ─────────────────────────────────────────────────
function formatMs(ms) {
  const totalSec = Math.floor(Math.max(0, ms) / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function nowInZoneParts() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return parts;
}

function updateClock() {
  const p = nowInZoneParts();
  els.currentDate.textContent = `${p.weekday}, ${p.month} ${p.day}, ${p.year}`;
  els.currentTime.textContent = `${p.hour}:${p.minute}:${p.second} ${p.dayPeriod}`;
}

// ── Timers ───────────────────────────────────────────────────────
function startMainTimer() {
  state.workoutStartedAt = Date.now();
  state.mainElapsedMs = 0;
  els.mainTimer.classList.remove("hidden");
  els.mainTimerValue.textContent = "00:00";

  clearInterval(state.mainTimerId);
  state.mainTimerId = setInterval(() => {
    state.mainElapsedMs = Date.now() - state.workoutStartedAt;
    els.mainTimerValue.textContent = formatMs(state.mainElapsedMs);
  }, 250);
}

function stopMainTimer() {
  clearInterval(state.mainTimerId);
  state.mainTimerId = null;
  if (state.workoutStartedAt) {
    state.mainElapsedMs = Date.now() - state.workoutStartedAt;
  }
  els.mainTimerValue.textContent = formatMs(state.mainElapsedMs);
}

function startPhaseTimer() {
  state.phaseStartedAt = Date.now();
  state.phaseElapsedMs = 0;
  els.phaseTimer.textContent = "00:00";

  clearInterval(state.phaseTimerId);
  state.phaseTimerId = setInterval(() => {
    state.phaseElapsedMs = Date.now() - state.phaseStartedAt;
    els.phaseTimer.textContent = formatMs(state.phaseElapsedMs);
  }, 250);
}

function stopPhaseTimer() {
  clearInterval(state.phaseTimerId);
  state.phaseTimerId = null;
  if (state.phaseStartedAt) {
    state.phaseElapsedMs = Date.now() - state.phaseStartedAt;
  }
  els.phaseTimer.textContent = formatMs(state.phaseElapsedMs);
  return state.phaseElapsedMs;
}

// ── UI updates ───────────────────────────────────────────────────
function updateCycleButton() {
  const n = state.workoutNumber;
  const btn = els.btnCycle;

  if (state.phase === "idle") {
    btn.textContent = `Workout ${n} · Start`;
    btn.classList.remove("is-break-mode");
  } else if (state.phase === "work") {
    btn.textContent = `Set ${state.setNumber}`;
    btn.classList.remove("is-break-mode");
  } else {
    btn.textContent = "Break";
    btn.classList.add("is-break-mode");
  }
}

function updatePhaseCard() {
  const card = els.phaseCard;
  card.classList.remove("is-work", "is-break");

  if (state.phase === "idle") {
    els.phaseLabel.textContent = "Ready";
    els.phaseTimer.textContent = "00:00";
    els.phaseHint.textContent = `Press Start to begin Workout ${state.workoutNumber}`;
  } else if (state.phase === "work") {
    card.classList.add("is-work");
    els.phaseLabel.textContent = `Set ${state.setNumber}`;
    els.phaseHint.textContent = "Movement time · press again for break";
  } else {
    card.classList.add("is-break");
    els.phaseLabel.textContent = "Break";
    els.phaseHint.textContent = "Rest time · press again for next set";
  }
}

function renderLiveLog() {
  const list = els.liveLogList;
  list.innerHTML = "";

  if (state.currentSegments.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No sets or breaks recorded yet.";
    list.appendChild(p);
    return;
  }

  for (const seg of state.currentSegments) {
    const li = document.createElement("li");
    const kind = document.createElement("span");
    kind.className = `kind ${seg.type}`;
    kind.textContent =
      seg.type === "set" ? `Set ${seg.number}` : `Break ${seg.number}`;
    const dur = document.createElement("span");
    dur.className = "dur";
    dur.textContent = formatMs(seg.durationMs);
    li.append(kind, dur);
    list.appendChild(li);
  }
}

function showScreen(name) {
  els.screenStart.classList.toggle("hidden", name !== "start");
  els.screenActive.classList.toggle("hidden", name !== "active");
  els.screenSummary.classList.toggle("hidden", name !== "summary");
}

// ── Session logic ────────────────────────────────────────────────
function commitPhaseIfRunning() {
  if (state.phase === "idle") return;

  const durationMs = stopPhaseTimer();

  if (state.phase === "work") {
    state.currentSegments.push({
      type: "set",
      number: state.setNumber,
      durationMs,
    });
  } else if (state.phase === "break") {
    // Break number matches the set that just finished
    state.currentSegments.push({
      type: "break",
      number: state.setNumber,
      durationMs,
    });
  }

  renderLiveLog();
}

function onStartWorkout() {
  state.workoutNumber = 1;
  state.setNumber = 1;
  state.phase = "idle";
  state.workouts = [];
  state.currentSegments = [];
  state.mainElapsedMs = 0;

  startMainTimer();
  showScreen("active");
  els.sessionTitle.textContent = `Workout ${state.workoutNumber}`;
  updateCycleButton();
  updatePhaseCard();
  renderLiveLog();
}

function onCyclePress() {
  if (state.phase === "idle") {
    // Start Set 1
    state.phase = "work";
    state.setNumber = 1;
    startPhaseTimer();
    updateCycleButton();
    updatePhaseCard();
    return;
  }

  if (state.phase === "work") {
    // End set → start break
    const durationMs = stopPhaseTimer();
    state.currentSegments.push({
      type: "set",
      number: state.setNumber,
      durationMs,
    });
    renderLiveLog();

    state.phase = "break";
    startPhaseTimer();
    updateCycleButton();
    updatePhaseCard();
    return;
  }

  if (state.phase === "break") {
    // End break → next set
    const durationMs = stopPhaseTimer();
    state.currentSegments.push({
      type: "break",
      number: state.setNumber,
      durationMs,
    });
    renderLiveLog();

    state.setNumber += 1;
    state.phase = "work";
    startPhaseTimer();
    updateCycleButton();
    updatePhaseCard();
  }
}

function saveCurrentWorkout() {
  commitPhaseIfRunning();
  state.workouts.push({
    number: state.workoutNumber,
    segments: [...state.currentSegments],
  });
  state.currentSegments = [];
  state.phase = "idle";
  state.setNumber = 1;
  state.phaseElapsedMs = 0;
  els.phaseTimer.textContent = "00:00";
}

function onFinishExercise() {
  // Finish current exercise (Workout N), move to next
  saveCurrentWorkout();
  state.workoutNumber += 1;
  els.sessionTitle.textContent = `Workout ${state.workoutNumber}`;
  updateCycleButton();
  updatePhaseCard();
  renderLiveLog();
}

function onFinishWorkout() {
  // End entire session and show summary
  saveCurrentWorkout();
  // Drop empty trailing workouts (e.g. user finished exercise then finished workout with no sets)
  state.workouts = state.workouts.filter((w) => w.segments.length > 0);
  stopMainTimer();
  renderSummary();
  showScreen("summary");
  els.mainTimer.classList.add("hidden");
}

function renderSummary() {
  const totalMs = state.mainElapsedMs;
  const workoutCount = state.workouts.length;
  let totalSets = 0;
  let totalBreaks = 0;

  for (const w of state.workouts) {
    for (const s of w.segments) {
      if (s.type === "set") totalSets += 1;
      else totalBreaks += 1;
    }
  }

  els.summaryMeta.innerHTML = `
    <div class="stat-card">
      <p class="label">Total time</p>
      <p class="value">${formatMs(totalMs)}</p>
    </div>
    <div class="stat-card">
      <p class="label">Workouts</p>
      <p class="value">${workoutCount}</p>
    </div>
    <div class="stat-card">
      <p class="label">Total sets</p>
      <p class="value">${totalSets}</p>
    </div>
    <div class="stat-card">
      <p class="label">Total breaks</p>
      <p class="value">${totalBreaks}</p>
    </div>
  `;

  els.summaryBody.innerHTML = "";

  if (state.workouts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.style.color = "var(--text-muted)";
    empty.textContent = "No sets were recorded this session.";
    els.summaryBody.appendChild(empty);
    return;
  }

  for (const workout of state.workouts) {
    const block = document.createElement("div");
    block.className = "workout-block";

    const title = document.createElement("h2");
    title.textContent = `Workout ${workout.number}`;
    block.appendChild(title);

    if (workout.segments.length === 0) {
      const note = document.createElement("p");
      note.className = "empty-note";
      note.textContent = "No sets or breaks.";
      block.appendChild(note);
    } else {
      let setTime = 0;
      let breakTime = 0;

      for (const seg of workout.segments) {
        const row = document.createElement("div");
        row.className = "row";
        const name = document.createElement("span");
        name.className = `name ${seg.type}`;
        name.textContent =
          seg.type === "set" ? `Set ${seg.number}` : `Break after Set ${seg.number}`;
        const time = document.createElement("span");
        time.className = "time";
        time.textContent = formatMs(seg.durationMs);
        row.append(name, time);
        block.appendChild(row);

        if (seg.type === "set") setTime += seg.durationMs;
        else breakTime += seg.durationMs;
      }

      const totals = document.createElement("div");
      totals.className = "totals";
      totals.innerHTML = `
        <span>Work time: <strong style="color:var(--accent)">${formatMs(setTime)}</strong></span>
        <span>Break time: <strong style="color:var(--break)">${formatMs(breakTime)}</strong></span>
      `;
      block.appendChild(totals);
    }

    els.summaryBody.appendChild(block);
  }
}

function resetSession() {
  clearInterval(state.mainTimerId);
  clearInterval(state.phaseTimerId);
  state.mainTimerId = null;
  state.phaseTimerId = null;
  state.workoutStartedAt = null;
  state.phaseStartedAt = null;
  state.mainElapsedMs = 0;
  state.phaseElapsedMs = 0;
  state.phase = "idle";
  state.workoutNumber = 1;
  state.setNumber = 1;
  state.workouts = [];
  state.currentSegments = [];

  els.mainTimer.classList.add("hidden");
  els.mainTimerValue.textContent = "00:00";
  els.btnCycle.classList.remove("is-break-mode");
  showScreen("start");
  updateClock();
}

// ── Events ───────────────────────────────────────────────────────
els.btnStartWorkout.addEventListener("click", onStartWorkout);
els.btnCycle.addEventListener("click", onCyclePress);
els.btnFinishExercise.addEventListener("click", onFinishExercise);
els.btnFinishWorkout.addEventListener("click", onFinishWorkout);
els.btnNewSession.addEventListener("click", resetSession);

// ── Init ─────────────────────────────────────────────────────────
updateClock();
setInterval(updateClock, 1000);
showScreen("start");
