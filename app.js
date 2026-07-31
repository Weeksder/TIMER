/**
 * Workout Rep & Set Counter
 */

const STORAGE_KEY = "workout-counter-sessions";
const TZ_STORAGE_KEY = "workout-counter-timezone";
const SHOW_NOTES_KEY = "workout-counter-show-session-notes";
const SHOW_START_TIME_KEY = "workout-counter-show-start-time";
const MAX_BREAK_SEC_KEY = "workout-counter-max-break-sec";
const MAX_SET_SEC_KEY = "workout-counter-max-set-sec";
const MOVEMENT_NAMES_KEY = "workout-counter-movement-names";
const EXPORT_FORMAT = "workout-counter-backup";
const EXPORT_VERSION = 1;

const TIMEZONES = [
  { id: "Pacific/Midway", region: "United States (Midway)", city: "Midway", lon: -177 },
  { id: "Pacific/Honolulu", region: "United States (Hawaii)", city: "Honolulu", lon: -157.8 },
  { id: "America/Anchorage", region: "United States (Alaska)", city: "Anchorage", lon: -149.9 },
  { id: "America/Los_Angeles", region: "United States (Pacific)", city: "Los Angeles", lon: -118.2 },
  { id: "America/Denver", region: "United States (Mountain)", city: "Denver", lon: -104.9 },
  { id: "America/Chicago", region: "United States (Central)", city: "Chicago", lon: -87.6 },
  { id: "America/New_York", region: "United States (Eastern)", city: "New York", lon: -74 },
  { id: "America/Halifax", region: "Canada (Atlantic)", city: "Halifax", lon: -63.6 },
  { id: "America/Sao_Paulo", region: "Brazil", city: "São Paulo", lon: -46.6 },
  { id: "Atlantic/South_Georgia", region: "South Georgia", city: "Grytviken", lon: -36.5 },
  { id: "Atlantic/Azores", region: "Portugal (Azores)", city: "Ponta Delgada", lon: -25.7 },
  { id: "Europe/London", region: "United Kingdom", city: "London", lon: -0.1 },
  { id: "Europe/Paris", region: "France (Central Europe)", city: "Paris", lon: 2.3 },
  { id: "Europe/Helsinki", region: "Finland (Eastern Europe)", city: "Helsinki", lon: 24.9 },
  { id: "Europe/Moscow", region: "Russia (Moscow)", city: "Moscow", lon: 37.6 },
  { id: "Asia/Dubai", region: "United Arab Emirates", city: "Dubai", lon: 55.3 },
  { id: "Asia/Karachi", region: "Pakistan", city: "Karachi", lon: 67 },
  { id: "Asia/Dhaka", region: "Bangladesh", city: "Dhaka", lon: 90.4 },
  { id: "Asia/Bangkok", region: "Thailand", city: "Bangkok", lon: 100.5 },
  { id: "Asia/Shanghai", region: "China", city: "Shanghai", lon: 121.5 },
  { id: "Asia/Tokyo", region: "Japan", city: "Tokyo", lon: 139.7 },
  { id: "Australia/Sydney", region: "Australia (Eastern)", city: "Sydney", lon: 151.2 },
  { id: "Pacific/Noumea", region: "New Caledonia", city: "Nouméa", lon: 166.4 },
  { id: "Pacific/Auckland", region: "New Zealand", city: "Auckland", lon: 174.8 },
  { id: "Pacific/Tongatapu", region: "Tonga", city: "Nukuʻalofa", lon: 175 },
  { id: "Pacific/Kiritimati", region: "Kiribati (Line Islands)", city: "Kiritimati", lon: 180 },
];

// ── DOM ──────────────────────────────────────────────────────────
const els = {
  mainTimer: document.getElementById("main-timer"),
  mainTimerValue: document.getElementById("main-timer-value"),
  sessionStartBlock: document.getElementById("session-start-block"),
  sessionStartValue: document.getElementById("session-start-value"),
  countdownOverlay: document.getElementById("countdown-overlay"),
  countdownNumber: document.getElementById("countdown-number"),
  countdownSub: document.getElementById("countdown-sub"),
  pauseOverlay: document.getElementById("pause-overlay"),
  btnResumeOverlay: document.getElementById("btn-resume-overlay"),
  screenStart: document.getElementById("screen-start"),
  screenActive: document.getElementById("screen-active"),
  screenSummary: document.getElementById("screen-summary"),
  dateLabel: document.getElementById("date-label"),
  currentDate: document.getElementById("current-date"),
  currentTime: document.getElementById("current-time"),
  btnGlobeTz: document.getElementById("btn-globe-tz"),
  btnStartWorkout: document.getElementById("btn-start-workout"),
  sessionTitle: document.getElementById("session-title"),
  sessionMovement: document.getElementById("session-movement"),
  phaseCard: document.getElementById("phase-card"),
  phaseLabel: document.getElementById("phase-label"),
  phaseTimer: document.getElementById("phase-timer"),
  btnCycle: document.getElementById("btn-cycle"),
  liveLog: document.getElementById("live-log"),
  btnPauseSession: document.getElementById("btn-pause-session"),
  btnFinishExercise: document.getElementById("btn-finish-exercise"),
  btnFinishWorkout: document.getElementById("btn-finish-workout"),
  btnEditCurrent: document.getElementById("btn-edit-current"),
  liveLogList: document.getElementById("live-log-list"),
  finishedList: document.getElementById("finished-workouts-list"),
  finishedEmpty: document.getElementById("finished-workouts-empty"),
  finishedWorkouts: document.getElementById("finished-workouts"),
  btnSessionWorkoutsToggle: document.getElementById("btn-session-workouts-toggle"),
  sessionWorkoutsPanel: document.getElementById("session-workouts-panel"),
  sessionWorkoutsToggleLabel: document.getElementById("session-workouts-toggle-label"),
  sessionPauseNote: document.getElementById("session-pause-note"),
  summaryMeta: document.getElementById("summary-meta"),
  summaryBody: document.getElementById("summary-body"),
  summaryDateLabel: document.getElementById("summary-date-label"),
  btnResumeSession: document.getElementById("btn-resume-session"),
  btnNewSession: document.getElementById("btn-new-session"),
  historyList: document.getElementById("history-list"),
  historyEmpty: document.getElementById("history-empty"),
  btnDeleteMode: document.getElementById("btn-delete-mode"),
  btnSelectAll: document.getElementById("btn-select-all"),
  btnDeleteSelected: document.getElementById("btn-delete-selected"),
  btnCancelSelect: document.getElementById("btn-cancel-select"),
  historyFooterDefault: document.getElementById("history-footer-default"),
  historyFooterSelect: document.getElementById("history-footer-select"),
  historySub: document.querySelector(".sessions-drawer .history-sub"),
  btnSessionsTab: document.getElementById("btn-sessions-tab"),
  sessionsDrawer: document.getElementById("sessions-drawer"),
  sessionsBackdrop: document.getElementById("sessions-backdrop"),
  btnSessionsClose: document.getElementById("btn-sessions-close"),
  btnSettings: document.getElementById("btn-settings"),
  settingsModal: document.getElementById("settings-modal"),
  btnOpenTzPicker: document.getElementById("btn-open-tz-picker"),
  settingsTzRegion: document.getElementById("settings-tz-region"),
  settingsTzId: document.getElementById("settings-tz-id"),
  settingsTzOffset: document.getElementById("settings-tz-offset"),
  settingsClientInfo: document.getElementById("settings-client-info"),
  toggleSessionNotes: document.getElementById("toggle-session-notes"),
  toggleStartTime: document.getElementById("toggle-start-time"),
  inputMaxBreakMin: document.getElementById("input-max-break-min"),
  inputMaxBreakSec: document.getElementById("input-max-break-sec"),
  inputMaxSetMin: document.getElementById("input-max-set-min"),
  inputMaxSetSec: document.getElementById("input-max-set-sec"),
  btnExportSessions: document.getElementById("btn-export-sessions"),
  btnImportSessions: document.getElementById("btn-import-sessions"),
  btnExportSessionsSide: document.getElementById("btn-export-sessions-side"),
  btnImportSessionsSide: document.getElementById("btn-import-sessions-side"),
  importFileInput: document.getElementById("import-file-input"),
  backupStatus: document.getElementById("backup-status"),
  tzPickerModal: document.getElementById("tz-picker-modal"),
  tzPrev: document.getElementById("tz-prev"),
  tzNext: document.getElementById("tz-next"),
  tzMap: document.getElementById("tz-map"),
  tzBand: document.getElementById("tz-band"),
  tzTooltip: document.getElementById("tz-tooltip"),
  tzTooltipName: document.getElementById("tz-tooltip-name"),
  tzTooltipTime: document.getElementById("tz-tooltip-time"),
  tzPickerRegion: document.getElementById("tz-picker-region"),
  tzPickerId: document.getElementById("tz-picker-id"),
  tzPickerOffset: document.getElementById("tz-picker-offset"),
  tzPickerTime: document.getElementById("tz-picker-time"),
  tzConfirm: document.getElementById("tz-confirm"),
  nameWorkoutModal: document.getElementById("name-workout-modal"),
  nameWorkoutTitle: document.getElementById("name-workout-title"),
  nameWorkoutHelp: document.getElementById("name-workout-help"),
  btnNameHelp: document.getElementById("btn-name-help"),
  inputWorkoutName: document.getElementById("input-workout-name"),
  nameSuggestList: document.getElementById("name-suggest-list"),
  btnNameConfirm: document.getElementById("btn-name-confirm"),
  editWorkoutModal: document.getElementById("edit-workout-modal"),
  editWorkoutTitle: document.getElementById("edit-workout-title"),
  inputEditName: document.getElementById("input-edit-name"),
  btnEditSaveName: document.getElementById("btn-edit-save-name"),
  btnEditContinue: document.getElementById("btn-edit-continue"),
  btnEditRestart: document.getElementById("btn-edit-restart"),
  btnEditRemove: document.getElementById("btn-edit-remove"),
};

// ── State ────────────────────────────────────────────────────────
function loadShowSessionNotes() {
  try {
    return localStorage.getItem(SHOW_NOTES_KEY) === "1";
  } catch {
    return false;
  }
}

function loadShowStartTime() {
  try {
    // Default on
    const v = localStorage.getItem(SHOW_START_TIME_KEY);
    if (v === null) return true;
    return v === "1";
  } catch {
    return true;
  }
}

/** Max break length in seconds; 0 = no limit. Default 90s (1:30). */
function loadMaxBreakSec() {
  try {
    const v = localStorage.getItem(MAX_BREAK_SEC_KEY);
    if (v === null) return 90;
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : 90;
  } catch {
    return 90;
  }
}

/** Max set length in seconds before “still going?” prompt. Default 120s (2:00). 0 = off. */
function loadMaxSetSec() {
  try {
    const v = localStorage.getItem(MAX_SET_SEC_KEY);
    if (v === null) return 120;
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : 120;
  } catch {
    return 120;
  }
}

function loadSavedTimezone() {
  try {
    const saved = localStorage.getItem(TZ_STORAGE_KEY);
    if (saved && TIMEZONES.some((z) => z.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return "America/New_York";
}

/**
 * workouts[] items:
 * { id, number, name, segments, status, setNumber, phase, resumePartial }
 * resumePartial: { phase: 'work'|'break', setNumber, baseMs } | null
 */
const state = {
  timezone: loadSavedTimezone(),
  showSessionNotes: loadShowSessionNotes(),
  showStartTime: loadShowStartTime(),
  maxBreakSec: loadMaxBreakSec(),
  maxSetSec: loadMaxSetSec(),
  setLongPromptOpen: false,
  setLongPromptAcked: false,
  pickerIndex: 0,
  workoutStartedAt: null, // wall-clock Date.now() when session began (for Start display)
  mainElapsedMs: 0,
  mainTimerId: null,
  mainRunningSince: null, // Date.now() when main interval started (for pause/resume)
  sessionPaused: false,
  phase: "idle",
  phaseStartedAt: null,
  phaseElapsedMs: 0,
  phaseTimerId: null,
  phaseBaseMs: 0, // accumulated when resuming/merging a set
  mergeIntoLastSegment: false, // when finishing work, add to last set segment
  workouts: [],
  activeWorkoutId: null,
  setNumber: 1,
  nameModalMode: null, // 'start' | 'next'
  editingWorkoutId: null,
  expandedWorkoutIds: new Set(),
  sessionSelectMode: false,
  selectedSessionIds: new Set(),
  countdownTimerId: null,
  canResumeSession: false,
  /** True after finishing a movement until the next one is named (or session ends) */
  awaitingNextMovement: false,
  sessionWorkoutsOpen: false,
};

function getTimezone() {
  return state.timezone;
}

function uid() {
  return `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getActiveWorkout() {
  return state.workouts.find((w) => w.id === state.activeWorkoutId) || null;
}

function nextWorkoutNumber() {
  if (!state.workouts.length) return 1;
  return Math.max(...state.workouts.map((w) => w.number)) + 1;
}

// ── Browser detection ────────────────────────────────────────────
function detectClientEnvironment() {
  const ua = navigator.userAgent || "";
  const uaData = navigator.userAgentData || null;
  let browser = "Unknown browser";
  let browserVersion = "";
  let engine = "";
  let os = "Unknown OS";
  let deviceType = "desktop";

  if (/Edg\//.test(ua)) {
    browser = "Microsoft Edge";
    browserVersion = (ua.match(/Edg\/([\d.]+)/) || [])[1] || "";
    engine = "Chromium (Blink)";
  } else if (/OPR\/|Opera\//.test(ua)) {
    browser = "Opera";
    browserVersion = (ua.match(/(?:OPR|Opera)\/([\d.]+)/) || [])[1] || "";
    engine = "Chromium (Blink)";
  } else if (/Firefox\//.test(ua)) {
    browser = "Firefox";
    browserVersion = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || "";
    engine = "Gecko";
  } else if (/SamsungBrowser\//.test(ua)) {
    browser = "Samsung Internet";
    browserVersion = (ua.match(/SamsungBrowser\/([\d.]+)/) || [])[1] || "";
    engine = "Chromium (Blink)";
  } else if (/CriOS\//.test(ua)) {
    browser = "Chrome (iOS)";
    browserVersion = (ua.match(/CriOS\/([\d.]+)/) || [])[1] || "";
    engine = "WebKit";
  } else if (/FxiOS\//.test(ua)) {
    browser = "Firefox (iOS)";
    browserVersion = (ua.match(/FxiOS\/([\d.]+)/) || [])[1] || "";
    engine = "WebKit";
  } else if (/Chrome\//.test(ua) && !/Chromium\//.test(ua)) {
    browser = "Google Chrome";
    browserVersion = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || "";
    engine = "Chromium (Blink)";
  } else if (/Safari\//.test(ua) && /Version\//.test(ua)) {
    browser = "Safari";
    browserVersion = (ua.match(/Version\/([\d.]+)/) || [])[1] || "";
    engine = "WebKit";
  } else if (uaData?.brands?.length) {
    const brand =
      uaData.brands.find((b) => !/Not.?A.?Brand/i.test(b.brand)) || uaData.brands[0];
    browser = brand.brand;
    browserVersion = brand.version || "";
  }

  if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X ([\d_]+)/.test(ua)) {
    const ver = (ua.match(/Mac OS X ([\d_]+)/) || [])[1]?.replace(/_/g, ".") || "";
    os = ver ? `macOS ${ver}` : "macOS";
  } else if (/Android ([\d.]+)/.test(ua)) os = `Android ${(ua.match(/Android ([\d.]+)/) || [])[1]}`;
  else if (/iPhone|iPad|iPod/.test(ua)) {
    const ver = (ua.match(/OS ([\d_]+)/) || [])[1]?.replace(/_/g, ".") || "";
    os = ver ? `iOS ${ver}` : "iOS";
  } else if (/CrOS/.test(ua)) os = "Chrome OS";
  else if (/Linux/.test(ua)) os = "Linux";

  const isTouch = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
  if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) deviceType = "tablet";
  else if (/Mobi|iPhone|iPod|Android.*Mobile/i.test(ua)) deviceType = "mobile";
  else if (isTouch && Math.min(screen.width, screen.height) < 900) deviceType = "mobile";
  if (uaData?.mobile === true) deviceType = "mobile";

  const label = [browser, browserVersion].filter(Boolean).join(" ");
  const platformLabel = `${deviceType === "mobile" ? "Mobile" : deviceType === "tablet" ? "Tablet" : "PC"} · ${os}`;

  return {
    browser,
    browserVersion,
    browserLabel: label || "Unknown browser",
    engine,
    os,
    deviceType,
    platformLabel,
    language: navigator.language || "",
    languages: Array.isArray(navigator.languages) ? [...navigator.languages] : [],
    timezoneAtCapture: getTimezone(),
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    screen: {
      width: window.screen?.width || null,
      height: window.screen?.height || null,
      pixelRatio: window.devicePixelRatio || 1,
    },
    userAgent: ua,
    capturedAt: new Date().toISOString(),
  };
}

function formatClientSummary(client) {
  if (!client) return "Unknown client";
  return [client.browserLabel || client.browser, client.platformLabel || client.os]
    .filter(Boolean)
    .join(" · ");
}

function findTzIndex(id) {
  const i = TIMEZONES.findIndex((z) => z.id === id);
  return i >= 0 ? i : TIMEZONES.findIndex((z) => z.id === "America/New_York");
}

function getTzMeta(id = getTimezone()) {
  return TIMEZONES.find((z) => z.id === id) || TIMEZONES[findTzIndex("America/New_York")];
}

// ── Time helpers ─────────────────────────────────────────────────
function formatMs(ms) {
  const totalSec = Math.floor(Math.max(0, ms) / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function nowInZoneParts(timeZone = getTimezone()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return Object.fromEntries(formatter.formatToParts(new Date()).map((p) => [p.type, p.value]));
}

function formatLocalTimeShort(timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

function formatUtcOffsetClean(timeZone) {
  const d = new Date();
  let name = "";
  try {
    name =
      new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName")?.value || "";
  } catch {
    name = "";
  }
  let m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) {
    try {
      name =
        new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
          .formatToParts(d)
          .find((p) => p.type === "timeZoneName")?.value || "";
      m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    } catch {
      m = null;
    }
  }
  if (!m) return "UTC";
  const sign = m[1] === "-" ? "\u2212" : "+";
  const hours = String(parseInt(m[2], 10));
  const mins = m[3] && m[3] !== "00" ? `:${m[3]}` : "";
  return `UTC${sign}${hours}${mins}`;
}

function getZonedParts(date, options) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: getTimezone(), ...options })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
}

/** e.g. 5:47pm */
function formatTimeAmpm(ts) {
  if (!ts) return "—";
  const p = getZonedParts(new Date(ts), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const hour = String(parseInt(p.hour, 10));
  const period = (p.dayPeriod || "").toLowerCase().replace(/\s/g, "");
  return `${hour}:${p.minute}${period}`;
}

/** Calendar day key in selected timezone: YYYY-MM-DD */
function dayKeyInZone(ts) {
  const p = getZonedParts(new Date(ts), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return `${p.year}-${p.month}-${p.day}`;
}

function getSessionYear(ts) {
  return getZonedParts(new Date(ts), { year: "numeric" }).year;
}

/** Today / Yesterday / Fri, Jul 30 (no year) */
function formatSessionDayTitle(ts) {
  if (!ts) return "Session";
  const key = dayKeyInZone(ts);
  const now = Date.now();
  if (key === dayKeyInZone(now)) return "Today";
  if (key === dayKeyInZone(now - 24 * 60 * 60 * 1000)) return "Yesterday";
  const p = getZonedParts(new Date(ts), {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${p.weekday}, ${p.month} ${p.day}`;
}

function getSessionStartedAt(session) {
  if (session?.startedAt) return session.startedAt;
  if (session?.finishedAt && session.totalMs) {
    return session.finishedAt - session.totalMs;
  }
  return session?.finishedAt || null;
}

/** Legacy full label kept for export / older data */
function formatSessionDateLabel(date = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: getTimezone(),
    weekday: "long",
  }).format(date);
  const parts = getZonedParts(date, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return `${weekday} ${parts.month}/${parts.day}/${parts.year}`;
}

function lonToPercent(lon) {
  let x = ((lon + 180) / 360) * 100;
  if (x < 0) x += 100;
  if (x > 100) x -= 100;
  return x;
}

function updateClock() {
  const p = nowInZoneParts();
  if (els.dateLabel) els.dateLabel.textContent = "Today";
  els.currentDate.textContent = `${p.weekday}, ${p.month} ${p.day}, ${p.year}`;
  els.currentTime.textContent = `${p.hour}:${p.minute}:${p.second} ${p.dayPeriod}`;
  if (!els.settingsModal.classList.contains("hidden")) refreshSettingsTzDisplay();
  if (!els.tzPickerModal.classList.contains("hidden")) refreshPickerPreview();
}

function workoutColorIndex(n) {
  return ((n - 1) % 6) + 1;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Modals ───────────────────────────────────────────────────────
function anyModalOpen() {
  return (
    !els.settingsModal.classList.contains("hidden") ||
    !els.tzPickerModal.classList.contains("hidden") ||
    !els.nameWorkoutModal.classList.contains("hidden") ||
    !els.editWorkoutModal.classList.contains("hidden")
  );
}

function openModal(el) {
  el.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal(el) {
  el.classList.add("hidden");
  if (!anyModalOpen()) document.body.classList.remove("modal-open");
}

// ── Sessions drawer ──────────────────────────────────────────────
function openSessionsDrawer() {
  els.sessionsDrawer.classList.add("is-open");
  els.sessionsDrawer.setAttribute("aria-hidden", "false");
  els.sessionsBackdrop.classList.remove("hidden");
  els.btnSessionsTab.classList.add("is-open");
  els.btnSessionsTab.setAttribute("aria-expanded", "true");
}

function closeSessionsDrawer() {
  els.sessionsDrawer.classList.remove("is-open");
  els.sessionsDrawer.setAttribute("aria-hidden", "true");
  els.sessionsBackdrop.classList.add("hidden");
  els.btnSessionsTab.classList.remove("is-open");
  els.btnSessionsTab.setAttribute("aria-expanded", "false");
  if (state.sessionSelectMode) exitSessionSelectMode();
}

function toggleSessionsDrawer() {
  if (els.sessionsDrawer.classList.contains("is-open")) closeSessionsDrawer();
  else openSessionsDrawer();
}

// ── Settings accordion ───────────────────────────────────────────
function setupAccordion() {
  document.querySelectorAll(".accordion-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      const wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".accordion-item.is-open").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function refreshSettingsTzDisplay() {
  const meta = getTzMeta();
  els.settingsTzRegion.textContent = meta.region;
  els.settingsTzId.textContent = meta.id;
  els.settingsTzOffset.textContent = formatUtcOffsetClean(meta.id);
}

function refreshSettingsClientInfo() {
  if (!els.settingsClientInfo) return;
  const c = detectClientEnvironment();
  els.settingsClientInfo.innerHTML = `
    <strong>${escapeHtml(c.browserLabel)}</strong><br />
    <span class="muted">${escapeHtml(c.platformLabel)}${c.engine ? ` · ${escapeHtml(c.engine)}` : ""}</span>
  `;
}

function secToMinSec(total) {
  const t = total || 0;
  return { mins: Math.floor(t / 60), secs: t % 60 };
}

function syncMaxBreakInputs() {
  const { mins, secs } = secToMinSec(state.maxBreakSec);
  if (els.inputMaxBreakMin) els.inputMaxBreakMin.value = String(mins);
  if (els.inputMaxBreakSec) els.inputMaxBreakSec.value = String(secs);
}

function syncMaxSetInputs() {
  const { mins, secs } = secToMinSec(state.maxSetSec);
  if (els.inputMaxSetMin) els.inputMaxSetMin.value = String(mins);
  if (els.inputMaxSetSec) els.inputMaxSetSec.value = String(secs);
}

function readLimitFromInputs(minEl, secEl) {
  const mins = Math.max(0, Math.min(59, parseInt(minEl?.value, 10) || 0));
  const secs = Math.max(0, Math.min(59, parseInt(secEl?.value, 10) || 0));
  return mins * 60 + secs;
}

function readMaxBreakFromInputs() {
  return readLimitFromInputs(els.inputMaxBreakMin, els.inputMaxBreakSec);
}

function readMaxSetFromInputs() {
  return readLimitFromInputs(els.inputMaxSetMin, els.inputMaxSetSec);
}

function saveMaxBreakSec(sec) {
  state.maxBreakSec = Math.max(0, sec | 0);
  try {
    localStorage.setItem(MAX_BREAK_SEC_KEY, String(state.maxBreakSec));
  } catch {
    /* ignore */
  }
  syncMaxBreakInputs();
  if (state.phase === "break") updateBreakOverUI(state.phaseElapsedMs || 0);
}

function saveMaxSetSec(sec) {
  state.maxSetSec = Math.max(0, sec | 0);
  try {
    localStorage.setItem(MAX_SET_SEC_KEY, String(state.maxSetSec));
  } catch {
    /* ignore */
  }
  syncMaxSetInputs();
}

function isSetOverLimit(durationMs, maxSec = state.maxSetSec) {
  if (!maxSec || maxSec <= 0) return false;
  return durationMs > maxSec * 1000;
}

/**
 * Ask if user is still working a long set.
 * Yes → keep going (no more prompts this set)
 * No → choose End set or Keep going
 */
function maybePromptLongSet(elapsedMs) {
  if (state.sessionPaused || state.phase !== "work") return;
  if (state.setLongPromptAcked || state.setLongPromptOpen) return;
  if (!isSetOverLimit(elapsedMs)) return;

  state.setLongPromptOpen = true;
  // Freeze timers while dialogs are up
  const wasPaused = state.sessionPaused;
  if (!wasPaused) {
    freezeMainElapsed();
    freezePhaseElapsed();
    clearInterval(state.mainTimerId);
    state.mainTimerId = null;
    clearInterval(state.phaseTimerId);
    state.phaseTimerId = null;
    state.phaseStartedAt = null;
    state.mainRunningSince = null;
  }

  const stillGoing = window.confirm(
    "Are you still going?\n\nOK = Yes, keep going\nCancel = No"
  );

  if (stillGoing) {
    state.setLongPromptAcked = true;
    state.setLongPromptOpen = false;
    if (!wasPaused) {
      startMainTimer({ reset: false });
      startPhaseTimer({
        baseMs: state.phaseElapsedMs || state.phaseBaseMs || 0,
        resetSetPrompt: false,
      });
    }
    return;
  }

  const endSet = window.confirm(
    "Keep going or end this set?\n\nOK = End the set (start break)\nCancel = Keep going"
  );
  state.setLongPromptOpen = false;

  if (endSet) {
    state.setLongPromptAcked = true;
    if (!wasPaused) {
      startMainTimer({ reset: false });
    }
    // End work phase → break (same as tapping the set button)
    endCurrentSetToBreak();
    return;
  }

  // Keep going
  state.setLongPromptAcked = true;
  if (!wasPaused) {
    startMainTimer({ reset: false });
    startPhaseTimer({
      baseMs: state.phaseElapsedMs || state.phaseBaseMs || 0,
      resetSetPrompt: false,
    });
  }
}

function endCurrentSetToBreak() {
  const active = getActiveWorkout();
  if (!active || state.phase !== "work") return;
  const durationMs = stopPhaseTimer();
  if (state.mergeIntoLastSegment) {
    const last = [...(active.segments || [])].reverse().find((s) => s.type === "set");
    if (last && last.number === state.setNumber) {
      last.durationMs = (last.durationMs || 0) + durationMs;
    } else {
      active.segments.push({ type: "set", number: state.setNumber, durationMs });
    }
  } else {
    active.segments.push({ type: "set", number: state.setNumber, durationMs });
  }
  state.mergeIntoLastSegment = false;
  active.resumePartial = null;
  state.phaseBaseMs = 0;
  state.setLongPromptAcked = false;
  renderLiveLog();
  renderFinishedWorkouts();
  state.phase = "break";
  startPhaseTimer({ baseMs: 0 });
  syncActiveFromState();
  updateCycleButton();
  updatePhaseCard();
}

function isBreakOverLimit(durationMs, maxSec = state.maxBreakSec) {
  if (!maxSec || maxSec <= 0) return false;
  return durationMs > maxSec * 1000;
}

function updateBreakOverUI(elapsedMs) {
  if (!els.phaseCard) return;
  const over = state.phase === "break" && isBreakOverLimit(elapsedMs);
  els.phaseCard.classList.toggle("is-break-over", over);
}

function openSettings() {
  refreshSettingsTzDisplay();
  refreshSettingsClientInfo();
  if (els.toggleSessionNotes) els.toggleSessionNotes.checked = state.showSessionNotes;
  if (els.toggleStartTime) els.toggleStartTime.checked = state.showStartTime;
  syncMaxBreakInputs();
  syncMaxSetInputs();
  setBackupStatus("");
  // Reset accordion — none open by default
  document.querySelectorAll(".accordion-item.is-open").forEach((el) => {
    el.classList.remove("is-open");
    el.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
  });
  openModal(els.settingsModal);
}

function closeSettings() {
  closeModal(els.settingsModal);
}

// ── Timezone picker ──────────────────────────────────────────────
function openTzPicker() {
  state.pickerIndex = findTzIndex(getTimezone());
  updatePickerUI();
  openModal(els.tzPickerModal);
}

function closeTzPicker() {
  closeModal(els.tzPickerModal);
}

function shiftPicker(delta) {
  const n = TIMEZONES.length;
  state.pickerIndex = (state.pickerIndex + delta + n) % n;
  updatePickerUI();
}

function updatePickerUI() {
  const zone = TIMEZONES[state.pickerIndex];
  const pct = lonToPercent(zone.lon);
  const bandWidth = 5.5;
  let left = pct - bandWidth / 2;
  if (left < 0) left = 0;
  if (left + bandWidth > 100) left = 100 - bandWidth;
  els.tzBand.style.left = `${left}%`;
  els.tzBand.style.width = `${bandWidth}%`;
  const tipLeft = Math.min(Math.max(pct, 8), 92);
  els.tzTooltip.style.left = `${tipLeft}%`;
  els.tzTooltipName.textContent = zone.city;
  els.tzTooltipTime.textContent = formatLocalTimeShort(zone.id);
  refreshPickerPreview();
}

function refreshPickerPreview() {
  const zone = TIMEZONES[state.pickerIndex];
  if (!zone) return;
  els.tzPickerRegion.textContent = zone.region;
  els.tzPickerId.textContent = zone.id;
  els.tzPickerOffset.textContent = formatUtcOffsetClean(zone.id);
  els.tzPickerTime.textContent = formatLocalTimeShort(zone.id);
  els.tzTooltipTime.textContent = formatLocalTimeShort(zone.id);
}

function confirmTimezone() {
  const zone = TIMEZONES[state.pickerIndex];
  state.timezone = zone.id;
  try {
    localStorage.setItem(TZ_STORAGE_KEY, zone.id);
  } catch {
    /* ignore */
  }
  updateClock();
  refreshSettingsTzDisplay();
  updateSessionStartDisplay();
  closeTzPicker();
  // Only reopen settings if user opened the picker from settings (settings still open under)
  // Do not force-open settings when using the globe shortcut.
}

// ── Session notes toggle ─────────────────────────────────────────
function setShowSessionNotes(on) {
  state.showSessionNotes = Boolean(on);
  try {
    localStorage.setItem(SHOW_NOTES_KEY, state.showSessionNotes ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (els.toggleSessionNotes) els.toggleSessionNotes.checked = state.showSessionNotes;
  renderHistory();
  if (!els.screenSummary.classList.contains("hidden")) {
    const sessions = loadSessions().sort((a, b) => b.finishedAt - a.finishedAt);
    if (sessions[0]) fillSummaryContainers(els.summaryMeta, els.summaryBody, sessions[0]);
  }
}

function setShowStartTime(on) {
  state.showStartTime = Boolean(on);
  try {
    localStorage.setItem(SHOW_START_TIME_KEY, state.showStartTime ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (els.toggleStartTime) els.toggleStartTime.checked = state.showStartTime;
  updateSessionStartDisplay();
}

function formatSessionStartClock(ts) {
  if (!ts) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: getTimezone(),
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(ts));
}

function updateSessionStartDisplay() {
  if (!els.sessionStartBlock) return;
  const show = state.showStartTime && state.workoutStartedAt && !els.mainTimer.classList.contains("hidden");
  els.sessionStartBlock.classList.toggle("hidden", !show);
  if (els.sessionStartValue) {
    els.sessionStartValue.textContent = formatSessionStartClock(state.workoutStartedAt);
  }
}

// ── History / export ─────────────────────────────────────────────
function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function computeSessionStats(workouts, totalMs) {
  let totalSets = 0;
  let totalBreaks = 0;
  for (const w of workouts) {
    for (const s of w.segments || []) {
      if (s.type === "set") totalSets += 1;
      else totalBreaks += 1;
    }
  }
  return {
    totalMs,
    workoutCount: workouts.length,
    totalSets,
    totalBreaks,
  };
}

function buildSessionRecord() {
  // Snapshot workouts for summary (include name)
  const workouts = state.workouts
    .filter((w) => (w.segments && w.segments.length > 0) || w.status === "finished")
    .map((w) => ({
      number: w.number,
      name: w.name,
      segments: [...(w.segments || [])],
    }))
    .filter((w) => w.segments.length > 0);

  const stats = computeSessionStats(workouts, state.mainElapsedMs);
  const finishedAt = Date.now();
  const startedAt = state.workoutStartedAt || finishedAt - (stats.totalMs || 0);
  const client = detectClientEnvironment();
  const tzMeta = getTzMeta();
  return {
    id: `session-${finishedAt}-${Math.random().toString(36).slice(2, 8)}`,
    dateLabel: formatSessionDateLabel(new Date(finishedAt)),
    startedAt,
    finishedAt,
    totalMs: stats.totalMs,
    workoutCount: stats.workoutCount,
    totalSets: stats.totalSets,
    totalBreaks: stats.totalBreaks,
    workouts,
    meta: {
      timezone: getTimezone(),
      timezoneRegion: tzMeta.region,
      client,
      app: "Workout Rep & Set Counter",
      appVersion: 1,
    },
  };
}

function buildMetaHTML(session) {
  return `
    <div class="stat-card stat-time"><p class="label">Total time</p><p class="value">${formatMs(session.totalMs)}</p></div>
    <div class="stat-card stat-workouts"><p class="label">Workouts</p><p class="value">${session.workoutCount}</p></div>
    <div class="stat-card stat-sets"><p class="label">Total sets</p><p class="value">${session.totalSets}</p></div>
    <div class="stat-card stat-breaks"><p class="label">Total breaks</p><p class="value">${session.totalBreaks}</p></div>
  `;
}

function segmentIsOverBreak(seg) {
  if (seg.type !== "break") return false;
  if (seg.overMax) return true;
  return isBreakOverLimit(seg.durationMs || 0);
}

/**
 * Expandable movement list. Panel opens above the toggle (flex column-reverse)
 * so the next row stays easy to reach without scrolling down.
 */
function renderExpandableWorkouts(container, workouts, { expandUp = true } = {}) {
  container.innerHTML = "";
  container.classList.add("movements-list");
  if (expandUp) container.classList.add("expand-up");

  if (!workouts || workouts.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-note";
    p.textContent = "No sets were recorded this session.";
    container.appendChild(p);
    return;
  }

  for (const workout of workouts) {
    const wi = workoutColorIndex(workout.number);
    const title = workout.name
      ? escapeHtml(workout.name)
      : `Workout ${workout.number}`;
    const sets = (workout.segments || []).filter((s) => s.type === "set").length;

    const block = document.createElement("div");
    block.className = "workout-expand";
    block.dataset.workout = String(wi);

    const panel = document.createElement("div");
    panel.className = "workout-expand-panel";

    if (!workout.segments?.length) {
      panel.innerHTML = `<p class="empty-note">No sets or breaks.</p>`;
    } else {
      let setTime = 0;
      let breakTime = 0;
      for (const seg of workout.segments) {
        if (seg.type === "set") setTime += seg.durationMs;
        else breakTime += seg.durationMs;
        const over = segmentIsOverBreak(seg);
        const row = document.createElement("div");
        row.className = `row ${seg.type === "set" ? "is-set" : "is-break"}${over ? " is-over" : ""}`;
        const label =
          seg.type === "set" ? `Set ${seg.number}` : `Break after Set ${seg.number}`;
        row.innerHTML = `
          <span class="name ${seg.type}${over ? " is-over" : ""}">${label}${over ? " · over" : ""}</span>
          <span class="time">${formatMs(seg.durationMs)}</span>`;
        panel.appendChild(row);
      }
      const totals = document.createElement("div");
      totals.className = "totals";
      totals.innerHTML = `
        <span>Work time: <strong style="color:var(--set)">${formatMs(setTime)}</strong></span>
        <span>Break time: <strong style="color:var(--break)">${formatMs(breakTime)}</strong></span>`;
      panel.appendChild(totals);
    }

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "workout-expand-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = `
      <span>${title}<span style="font-weight:500;color:var(--text-muted);font-size:0.8rem"> · ${sets} set${sets === 1 ? "" : "s"}</span></span>
      <svg class="chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
      </svg>`;
    toggle.addEventListener("click", () => {
      const open = block.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // column-reverse: first child sits lower. Put toggle first so panel opens above it.
    block.append(toggle, panel);
    container.appendChild(block);
  }
}

function buildSessionNoteMetaHTML(session) {
  const client = session.meta?.client;
  const tz = session.meta?.timezone || "—";
  const region = session.meta?.timezoneRegion || "";
  if (!client && !session.meta) {
    return `<div class="session-note-meta"><strong>Session note</strong><div class="meta-row"><span>Client</span><span>Not recorded (older session)</span></div></div>`;
  }
  return `
    <div class="session-note-meta">
      <strong>Session note</strong>
      <div class="meta-row"><span>Browser</span><span>${escapeHtml(client?.browserLabel || "—")}</span></div>
      <div class="meta-row"><span>Device</span><span>${escapeHtml(client?.platformLabel || "—")}</span></div>
      <div class="meta-row"><span>Engine</span><span>${escapeHtml(client?.engine || "—")}</span></div>
      <div class="meta-row"><span>Timezone</span><span>${escapeHtml(region ? `${region} (${tz})` : tz)}</span></div>
      <div class="meta-row"><span>Language</span><span>${escapeHtml(client?.language || "—")}</span></div>
    </div>`;
}

function fillSummaryContainers(metaEl, bodyEl, session) {
  metaEl.innerHTML = buildMetaHTML(session);
  bodyEl.innerHTML = "";
  bodyEl.classList.add("summary-body", "expand-up");
  renderExpandableWorkouts(bodyEl, session.workouts, { expandUp: true });
  if (state.showSessionNotes) {
    bodyEl.insertAdjacentHTML("beforeend", buildSessionNoteMetaHTML(session));
  }
}

function updateSelectModeUI() {
  const on = state.sessionSelectMode;
  els.sessionsDrawer?.classList.toggle("is-select-mode", on);
  els.historyFooterDefault?.classList.toggle("hidden", on);
  els.historyFooterSelect?.classList.toggle("hidden", !on);
  if (els.historySub) {
    els.historySub.textContent = on
      ? "Select sessions to delete · tap a tick box"
      : "Previous sessions · tap a date to expand";
  }
  if (els.btnSelectAll) {
    const total = loadSessions().length;
    const n = state.selectedSessionIds.size;
    els.btnSelectAll.textContent = total > 0 && n === total ? "Deselect all" : "Select all";
  }
  if (els.btnDeleteSelected) {
    const n = state.selectedSessionIds.size;
    els.btnDeleteSelected.textContent = n ? `Delete (${n})` : "Delete";
    els.btnDeleteSelected.disabled = n === 0;
  }
}

function enterSessionSelectMode() {
  if (!loadSessions().length) return;
  state.sessionSelectMode = true;
  state.selectedSessionIds = new Set();
  updateSelectModeUI();
  renderHistory();
}

function exitSessionSelectMode() {
  state.sessionSelectMode = false;
  state.selectedSessionIds = new Set();
  updateSelectModeUI();
  renderHistory();
}

function toggleSessionSelected(id) {
  if (state.selectedSessionIds.has(id)) state.selectedSessionIds.delete(id);
  else state.selectedSessionIds.add(id);
  // Update DOM without full re-render when possible
  const item = els.historyList?.querySelector(`.history-item[data-id="${CSS.escape(id)}"]`);
  if (item) item.classList.toggle("is-selected", state.selectedSessionIds.has(id));
  updateSelectModeUI();
}

function selectAllSessions() {
  const sessions = loadSessions();
  if (!sessions.length) return;
  if (state.selectedSessionIds.size === sessions.length) {
    state.selectedSessionIds = new Set();
  } else {
    state.selectedSessionIds = new Set(sessions.map((s) => s.id));
  }
  renderHistory();
  updateSelectModeUI();
}

function deleteSelectedSessions() {
  const n = state.selectedSessionIds.size;
  if (!n) return;
  if (!window.confirm(`Delete ${n} selected session${n === 1 ? "" : "s"}? This cannot be undone.`)) {
    return;
  }
  const remaining = loadSessions().filter((s) => !state.selectedSessionIds.has(s.id));
  saveSessions(remaining);
  exitSessionSelectMode();
}

function renderHistory(openId = null) {
  const sessions = loadSessions();
  const list = els.historyList;
  list.querySelectorAll(".history-item, .history-year-header").forEach((el) => el.remove());
  if (sessions.length === 0) {
    els.historyEmpty.classList.remove("hidden");
    if (state.sessionSelectMode) exitSessionSelectMode();
    else updateSelectModeUI();
    return;
  }
  els.historyEmpty.classList.add("hidden");
  const ordered = [...sessions].sort((a, b) => b.finishedAt - a.finishedAt);

  // Group by year (newest year first) — year label sits above its sessions
  const byYear = new Map();
  for (const session of ordered) {
    const year = getSessionYear(session.finishedAt || getSessionStartedAt(session));
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(session);
  }

  for (const [year, yearSessions] of byYear) {
    const yearHeader = document.createElement("div");
    yearHeader.className = "history-year-header";
    yearHeader.textContent = year;
    yearHeader.setAttribute("role", "heading");
    yearHeader.setAttribute("aria-level", "3");
    list.appendChild(yearHeader);

    for (const session of yearSessions) {
      const startedAt = getSessionStartedAt(session);
      const finishedAt = session.finishedAt || startedAt;
      const dayTitle = formatSessionDayTitle(startedAt || finishedAt);
      const startTime = formatTimeAmpm(startedAt);
      const endTime = formatTimeAmpm(finishedAt);

      const item = document.createElement("div");
      item.className = "history-item";
      item.dataset.id = session.id;
      if (openId && session.id === openId && !state.sessionSelectMode) {
        item.classList.add("is-open");
      }
      if (state.selectedSessionIds.has(session.id)) item.classList.add("is-selected");

      const row = document.createElement("div");
      row.className = "history-item-row";

      const tick = document.createElement("button");
      tick.type = "button";
      tick.className = "history-select-tick";
      tick.setAttribute("aria-label", `Select ${dayTitle} ${startTime}`);
      tick.innerHTML = `
        <span class="tick-box">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.52a1 1 0 011.42-1.42l3.04 3.04 6.54-6.54a1 1 0 011.42 0z" clip-rule="evenodd"/>
          </svg>
        </span>`;
      tick.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSessionSelected(session.id);
      });

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "history-item-toggle";
      toggle.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
      const browserChip =
        state.showSessionNotes && session.meta?.client
          ? escapeHtml(formatClientSummary(session.meta.client))
          : "";
      toggle.innerHTML = `
        <span class="date-text-wrap">
          <span class="date-text">${escapeHtml(dayTitle)}</span>
          <span class="session-start-time">${escapeHtml(startTime)}</span>
          ${browserChip ? `<span class="browser-chip">${browserChip}</span>` : ""}
        </span>
        <svg class="chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>`;

      const body = document.createElement("div");
      body.className = "history-item-body";

      // Time range appears only when expanded (CSS); not in a card/box
      const range = document.createElement("p");
      range.className = "session-time-range";
      range.textContent = `${startTime} ~ ${endTime}`;

      // Movements only (each expandable for set/break detail)
      const detail = document.createElement("div");
      detail.className = "summary-body movements-only expand-up";
      renderExpandableWorkouts(detail, session.workouts || [], { expandUp: true });
      body.append(range, detail);
      if (state.showSessionNotes) {
        body.insertAdjacentHTML("beforeend", buildSessionNoteMetaHTML(session));
      }

      toggle.addEventListener("click", () => {
        if (state.sessionSelectMode) {
          toggleSessionSelected(session.id);
          return;
        }
        const wasOpen = item.classList.contains("is-open");
        list.querySelectorAll(".history-item.is-open").forEach((el) => {
          el.classList.remove("is-open");
          el.querySelector(".history-item-toggle")?.setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });

      row.append(tick, toggle);
      item.append(row, body);
      list.appendChild(item);
    }
  }
  updateSelectModeUI();
}

function addSessionToHistory(session) {
  const sessions = loadSessions();
  sessions.push(session);
  saveSessions(sessions);
  renderHistory(session.id);
}

function setBackupStatus(message, kind = "ok") {
  if (!els.backupStatus) return;
  els.backupStatus.textContent = message;
  els.backupStatus.classList.remove("is-error", "is-info");
  if (kind === "error") els.backupStatus.classList.add("is-error");
  if (kind === "info") els.backupStatus.classList.add("is-info");
}

function buildExportPayload() {
  const sessions = loadSessions();
  const client = detectClientEnvironment();
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    exportedAtLabel: formatSessionDateLabel(new Date()),
    sessionCount: sessions.length,
    app: { name: "Workout Rep & Set Counter", version: EXPORT_VERSION },
    exportMeta: {
      client,
      timezone: getTimezone(),
      timezoneRegion: getTzMeta().region,
    },
    settings: { timezone: getTimezone() },
    sessions,
  };
}

function downloadJsonFile(filename, dataObj) {
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function exportSessions() {
  const payload = buildExportPayload();
  if (payload.sessionCount === 0) {
    setBackupStatus("No sessions to export yet. End a session first.", "info");
    return;
  }
  const stamp = new Date();
  const y = stamp.getFullYear();
  const m = String(stamp.getMonth() + 1).padStart(2, "0");
  const d = String(stamp.getDate()).padStart(2, "0");
  const hh = String(stamp.getHours()).padStart(2, "0");
  const mm = String(stamp.getMinutes()).padStart(2, "0");
  try {
    downloadJsonFile(`workout-sessions-${y}${m}${d}-${hh}${mm}.json`, payload);
    setBackupStatus(
      `Exported ${payload.sessionCount} session(s) · ${payload.exportMeta.client.browserLabel}`,
      "ok"
    );
  } catch (err) {
    console.error(err);
    setBackupStatus("Export failed.", "error");
  }
}

function normalizeImportedSession(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.id || typeof raw.finishedAt !== "number") return null;
  if (!Array.isArray(raw.workouts)) return null;
  return {
    id: String(raw.id),
    dateLabel: raw.dateLabel || formatSessionDateLabel(new Date(raw.finishedAt)),
    startedAt: raw.startedAt || null,
    finishedAt: raw.finishedAt,
    totalMs: Number(raw.totalMs) || 0,
    workoutCount: Number(raw.workoutCount) || 0,
    totalSets: Number(raw.totalSets) || 0,
    totalBreaks: Number(raw.totalBreaks) || 0,
    workouts: raw.workouts,
    meta: raw.meta || null,
  };
}

function parseImportPayload(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  if (data && data.format === EXPORT_FORMAT && Array.isArray(data.sessions)) {
    return {
      sessions: data.sessions.map(normalizeImportedSession).filter(Boolean),
      settings: data.settings || null,
      exportMeta: data.exportMeta || null,
    };
  }
  if (Array.isArray(data)) {
    return {
      sessions: data.map(normalizeImportedSession).filter(Boolean),
      settings: null,
      exportMeta: null,
    };
  }
  if (data && Array.isArray(data.sessions)) {
    return {
      sessions: data.sessions.map(normalizeImportedSession).filter(Boolean),
      settings: data.settings || null,
      exportMeta: data.exportMeta || null,
    };
  }
  throw new Error("Unrecognized backup format.");
}

function importSessionsFromText(text) {
  const parsed = parseImportPayload(text);
  if (!parsed.sessions.length) throw new Error("No valid sessions found in that file.");
  const existing = loadSessions();
  const byId = new Map(existing.map((s) => [s.id, s]));
  let added = 0;
  let skipped = 0;
  for (const session of parsed.sessions) {
    if (byId.has(session.id)) {
      skipped += 1;
      continue;
    }
    byId.set(session.id, session);
    added += 1;
  }
  const merged = [...byId.values()].sort((a, b) => a.finishedAt - b.finishedAt);
  saveSessions(merged);
  if (parsed.settings?.timezone && TIMEZONES.some((z) => z.id === parsed.settings.timezone)) {
    if (window.confirm(`Also restore timezone to ${parsed.settings.timezone}?`)) {
      state.timezone = parsed.settings.timezone;
      try {
        localStorage.setItem(TZ_STORAGE_KEY, state.timezone);
      } catch {
        /* ignore */
      }
      updateClock();
      refreshSettingsTzDisplay();
    }
  }
  renderHistory();
  return { added, skipped, total: merged.length, exportMeta: parsed.exportMeta };
}

function triggerImportPicker() {
  els.importFileInput.value = "";
  els.importFileInput.click();
}

async function onImportFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const result = importSessionsFromText(text);
    const from = result.exportMeta?.client?.browserLabel
      ? ` (file from ${result.exportMeta.client.browserLabel})`
      : "";
    setBackupStatus(
      `Imported ${result.added} new · skipped ${result.skipped} duplicates · ${result.total} total${from}`,
      "ok"
    );
  } catch (err) {
    console.error(err);
    setBackupStatus(err.message || "Import failed.", "error");
  }
}

// ── Timers ───────────────────────────────────────────────────────
function startMainTimer({ reset = true } = {}) {
  if (reset) {
    state.workoutStartedAt = Date.now();
    state.mainElapsedMs = 0;
  }
  state.sessionPaused = false;
  state.mainRunningSince = Date.now();
  els.mainTimer.classList.remove("hidden");
  els.mainTimerValue.textContent = formatMs(state.mainElapsedMs);
  updateSessionStartDisplay();
  clearInterval(state.mainTimerId);
  state.mainTimerId = setInterval(() => {
    if (state.sessionPaused) return;
    const running = Date.now() - state.mainRunningSince;
    els.mainTimerValue.textContent = formatMs(state.mainElapsedMs + running);
  }, 250);
}

function freezeMainElapsed() {
  if (state.mainRunningSince && !state.sessionPaused) {
    state.mainElapsedMs += Date.now() - state.mainRunningSince;
  }
  state.mainRunningSince = null;
  els.mainTimerValue.textContent = formatMs(state.mainElapsedMs);
}

function stopMainTimer() {
  freezeMainElapsed();
  clearInterval(state.mainTimerId);
  state.mainTimerId = null;
  state.sessionPaused = false;
}

function startPhaseTimer({ baseMs = 0, resetSetPrompt = null } = {}) {
  state.phaseBaseMs = baseMs;
  state.phaseStartedAt = Date.now();
  state.phaseElapsedMs = baseMs;
  els.phaseTimer.textContent = formatMs(baseMs);
  // Only clear the long-set prompt flag for a fresh set, not when resuming after the dialog
  const doResetPrompt = resetSetPrompt === null ? baseMs === 0 && state.phase === "work" : resetSetPrompt;
  if (doResetPrompt) {
    state.setLongPromptAcked = false;
    state.setLongPromptOpen = false;
  }
  clearInterval(state.phaseTimerId);
  state.phaseTimerId = setInterval(() => {
    if (state.sessionPaused || state.setLongPromptOpen) return;
    state.phaseElapsedMs = state.phaseBaseMs + (Date.now() - state.phaseStartedAt);
    els.phaseTimer.textContent = formatMs(state.phaseElapsedMs);
    if (state.phase === "break") updateBreakOverUI(state.phaseElapsedMs);
    if (state.phase === "work") maybePromptLongSet(state.phaseElapsedMs);
  }, 250);
  if (state.phase === "break") updateBreakOverUI(state.phaseBaseMs || 0);
}

function freezePhaseElapsed() {
  if (state.phaseStartedAt && state.phase !== "idle" && !state.sessionPaused) {
    state.phaseElapsedMs = state.phaseBaseMs + (Date.now() - state.phaseStartedAt);
    state.phaseBaseMs = state.phaseElapsedMs;
    state.phaseStartedAt = null;
  }
  els.phaseTimer.textContent = formatMs(state.phaseElapsedMs || state.phaseBaseMs || 0);
  return state.phaseElapsedMs || state.phaseBaseMs || 0;
}

function stopPhaseTimer() {
  const total = freezePhaseElapsed();
  clearInterval(state.phaseTimerId);
  state.phaseTimerId = null;
  state.phaseStartedAt = null;
  return total;
}

// ── Countdown (session start only) ───────────────────────────────
function runSessionStartCountdown(onDone) {
  clearInterval(state.countdownTimerId);
  let n = 3;
  if (els.countdownOverlay) {
    els.countdownOverlay.classList.remove("hidden");
    els.countdownOverlay.setAttribute("aria-hidden", "false");
  }
  document.body.classList.add("overlay-active");
  const tick = () => {
    if (els.countdownNumber) {
      els.countdownNumber.textContent = String(n);
      // re-trigger pop animation
      els.countdownNumber.style.animation = "none";
      // force reflow
      void els.countdownNumber.offsetWidth;
      els.countdownNumber.style.animation = "";
    }
    if (els.countdownSub) {
      els.countdownSub.textContent = n > 1 ? "Starting session…" : "Go!";
    }
  };
  tick();
  state.countdownTimerId = setInterval(() => {
    n -= 1;
    if (n <= 0) {
      clearInterval(state.countdownTimerId);
      state.countdownTimerId = null;
      if (els.countdownOverlay) {
        els.countdownOverlay.classList.add("hidden");
        els.countdownOverlay.setAttribute("aria-hidden", "true");
      }
      document.body.classList.remove("overlay-active");
      onDone?.();
      return;
    }
    tick();
  }, 1000);
}

// ── Session pause / resume ───────────────────────────────────────
function showPauseOverlay() {
  if (!els.pauseOverlay) return;
  els.pauseOverlay.classList.remove("hidden");
  els.pauseOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-active");
}

function hidePauseOverlay() {
  if (!els.pauseOverlay) return;
  els.pauseOverlay.classList.add("hidden");
  els.pauseOverlay.setAttribute("aria-hidden", "true");
  // Don't clear overlay-active if countdown is showing
  if (els.countdownOverlay?.classList.contains("hidden")) {
    document.body.classList.remove("overlay-active");
  }
}

function updatePauseButton() {
  if (!els.btnPauseSession) return;
  els.btnPauseSession.classList.toggle("is-paused", state.sessionPaused);
  els.btnPauseSession.title = state.sessionPaused ? "Resume session" : "Pause session";
  els.btnPauseSession.setAttribute(
    "aria-label",
    state.sessionPaused ? "Resume session" : "Pause session"
  );
  els.sessionPauseNote?.classList.toggle("hidden", !state.sessionPaused);
  if (state.sessionPaused) showPauseOverlay();
  else hidePauseOverlay();
}

function pauseSession() {
  if (state.sessionPaused) return;
  // Freeze main + phase without committing segments (keep partial for merge)
  freezeMainElapsed();
  if (state.phase !== "idle") {
    freezePhaseElapsed();
    const active = getActiveWorkout();
    if (active) {
      active.resumePartial = {
        phase: state.phase,
        setNumber: state.setNumber,
        baseMs: state.phaseElapsedMs || state.phaseBaseMs || 0,
      };
      active.setNumber = state.setNumber;
      active.phase = state.phase;
    }
    clearInterval(state.phaseTimerId);
    state.phaseTimerId = null;
    state.phaseStartedAt = null;
  }
  clearInterval(state.mainTimerId);
  state.mainTimerId = null;
  state.sessionPaused = true;
  const active = getActiveWorkout();
  if (active && active.status === "active") active.status = "paused";
  updatePauseButton();
  refreshActiveUI();
}

function resumeSession() {
  if (!state.sessionPaused) return;
  state.sessionPaused = false;
  hidePauseOverlay();
  const active = getActiveWorkout();
  if (active && active.status === "paused") active.status = "active";
  // Resume main
  startMainTimer({ reset: false });
  // Resume phase if we were mid set/break
  if (active?.resumePartial) {
    const p = active.resumePartial;
    state.phase = p.phase;
    state.setNumber = p.setNumber;
    state.mergeIntoLastSegment = p.phase === "work";
    startPhaseTimer({ baseMs: p.baseMs || 0 });
  }
  updatePauseButton();
  refreshActiveUI();
}

function requestPauseSession() {
  if (state.sessionPaused) {
    resumeSession();
    return;
  }
  // No confirmation — pause immediately
  pauseSession();
}

// ── Active workout sync ──────────────────────────────────────────
function getLastSetNumber(workout) {
  const sets = (workout.segments || []).filter((s) => s.type === "set");
  if (!sets.length) return null;
  return sets[sets.length - 1].number;
}

function makeBreakSegment(number, durationMs) {
  const overMax = isBreakOverLimit(durationMs);
  return { type: "break", number, durationMs, overMax };
}

function commitPhaseIfRunning() {
  if (state.phase === "idle") return;
  const durationMs = stopPhaseTimer();
  const active = getActiveWorkout();
  if (!active) return;
  if (state.phase === "work") {
    if (state.mergeIntoLastSegment) {
      const last = [...(active.segments || [])].reverse().find((s) => s.type === "set");
      if (last && last.number === state.setNumber) {
        last.durationMs = (last.durationMs || 0) + durationMs;
      } else {
        active.segments.push({ type: "set", number: state.setNumber, durationMs });
      }
    } else {
      active.segments.push({ type: "set", number: state.setNumber, durationMs });
    }
  } else if (state.phase === "break") {
    if (state.mergeIntoLastSegment) {
      const last = [...(active.segments || [])]
        .reverse()
        .find((s) => s.type === "break" && s.number === state.setNumber);
      if (last) {
        last.durationMs = (last.durationMs || 0) + durationMs;
        last.overMax = isBreakOverLimit(last.durationMs);
      } else {
        active.segments.push(makeBreakSegment(state.setNumber, durationMs));
      }
    } else {
      active.segments.push(makeBreakSegment(state.setNumber, durationMs));
    }
  }
  state.phase = "idle";
  state.phaseElapsedMs = 0;
  state.phaseBaseMs = 0;
  state.mergeIntoLastSegment = false;
  if (active) {
    active.resumePartial = null;
    active.phase = "idle";
  }
  renderLiveLog();
}

function syncActiveFromState() {
  const active = getActiveWorkout();
  if (!active) return;
  active.phase = state.phase;
  active.setNumber = state.setNumber;
  active.segments = active.segments || [];
}

function loadActiveIntoState(workout, { resumeSet = false } = {}) {
  state.activeWorkoutId = workout.id;
  state.phaseElapsedMs = 0;
  state.phaseBaseMs = 0;
  state.phaseStartedAt = null;
  state.mergeIntoLastSegment = false;
  clearInterval(state.phaseTimerId);
  state.phaseTimerId = null;
  els.phaseTimer.textContent = "00:00";

  if (resumeSet) {
    // Prefer incomplete partial, else last completed set number
    if (workout.resumePartial) {
      state.phase = workout.resumePartial.phase;
      state.setNumber = workout.resumePartial.setNumber;
      state.mergeIntoLastSegment = workout.resumePartial.phase === "work";
      startPhaseTimer({ baseMs: workout.resumePartial.baseMs || 0 });
    } else {
      const lastSet = getLastSetNumber(workout);
      if (lastSet) {
        state.setNumber = lastSet;
        state.phase = "work";
        state.mergeIntoLastSegment = true;
        // Start fresh on the same set number — time merges into last set segment on finish
        startPhaseTimer({ baseMs: 0 });
      } else {
        state.phase = "idle";
        state.setNumber = 1;
      }
    }
  } else {
    state.phase = "idle";
    const lastSet = getLastSetNumber(workout);
    state.setNumber = lastSet ? lastSet + 1 : 1;
    workout.resumePartial = null;
  }

  workout.phase = state.phase;
  workout.setNumber = state.setNumber;
  workout.status = "active";
}

function pauseActiveWorkout() {
  const active = getActiveWorkout();
  if (!active) return;
  // If mid-phase, stash partial without creating a finished segment
  if (state.phase !== "idle") {
    const elapsed = stopPhaseTimer();
    active.resumePartial = {
      phase: state.phase,
      setNumber: state.setNumber,
      baseMs: elapsed,
    };
    state.phase = "idle";
    state.phaseBaseMs = 0;
    state.phaseElapsedMs = 0;
    state.mergeIntoLastSegment = false;
  }
  syncActiveFromState();
  if (active.status !== "finished") active.status = "paused";
  active.phase = "idle";
}

// ── UI updates ───────────────────────────────────────────────────
function updateCycleButton() {
  const btn = els.btnCycle;
  if (!btn) return;
  const active = getActiveWorkout();
  const name = active?.name || "";
  btn.classList.remove("is-work-mode", "is-break-mode", "is-name-next");

  // After canceling next-movement name: Start is active & highlighted for naming again
  if (state.awaitingNextMovement && !active) {
    btn.disabled = state.sessionPaused;
    btn.textContent = "Start";
    btn.classList.add("is-work-mode", "is-name-next");
    return;
  }

  const blocked = state.sessionPaused || !active || active.status === "finished";
  btn.disabled = blocked;
  // Never put movement name on the button — name is already above the timer
  if (state.phase === "idle") {
    btn.textContent = "Start";
  } else if (state.phase === "work") {
    btn.textContent = `Set ${state.setNumber}`;
    btn.classList.add("is-work-mode");
  } else {
    btn.textContent = "Break";
    btn.classList.add("is-break-mode");
  }
}

function updatePhaseCard() {
  const card = els.phaseCard;
  card.classList.remove("is-work", "is-break", "is-idle", "is-break-over");
  if (state.phase === "idle") {
    card.classList.add("is-idle");
    els.phaseLabel.textContent = "Ready";
    els.phaseTimer.textContent = "00:00";
  } else if (state.phase === "work") {
    card.classList.add("is-work");
    els.phaseLabel.textContent = `Set ${state.setNumber}`;
  } else {
    card.classList.add("is-break");
    els.phaseLabel.textContent = "Break";
    updateBreakOverUI(state.phaseElapsedMs || state.phaseBaseMs || 0);
  }
}

function updateSessionTitle() {
  const active = getActiveWorkout();
  if (!active) {
    if (state.awaitingNextMovement) {
      els.sessionTitle.textContent = "Next movement";
      els.sessionTitle.removeAttribute("data-workout");
      if (els.sessionMovement) {
        els.sessionMovement.classList.remove("hidden");
        els.sessionMovement.textContent = "Tap Continue or Start to name the next exercise";
      }
      if (els.btnFinishExercise) {
        els.btnFinishExercise.textContent = "Continue";
        els.btnFinishExercise.disabled = state.sessionPaused;
        els.btnFinishExercise.classList.add("is-continue-mode");
      }
      return;
    }
    els.sessionTitle.textContent = "Next workout";
    els.sessionTitle.removeAttribute("data-workout");
    if (els.sessionMovement) {
      els.sessionMovement.classList.remove("hidden");
      els.sessionMovement.textContent = "Name the next movement to continue";
    }
    if (els.btnFinishExercise) {
      els.btnFinishExercise.textContent = "Finish";
      els.btnFinishExercise.disabled = true;
      els.btnFinishExercise.classList.remove("is-continue-mode");
    }
    if (els.btnCycle) els.btnCycle.disabled = true;
    return;
  }
  const n = active.number;
  const name = (active.name || "").trim() || `movement ${n}`;
  // Show only the movement name (no "Workout 1" subtitle)
  els.sessionTitle.textContent = name;
  els.sessionTitle.dataset.workout = String(workoutColorIndex(n));
  if (els.sessionMovement) {
    els.sessionMovement.textContent = "";
    els.sessionMovement.classList.add("hidden");
  }
  if (els.btnFinishExercise) {
    els.btnFinishExercise.textContent = "Finish";
    els.btnFinishExercise.disabled = false;
    els.btnFinishExercise.classList.remove("is-continue-mode");
  }
  if (els.btnCycle) els.btnCycle.disabled = false;
}

function renderLiveLog() {
  const list = els.liveLogList;
  const wrap = els.liveLog;
  if (!list) return;
  list.innerHTML = "";
  const active = getActiveWorkout();
  const segments = active?.segments || [];
  // Hide until the first set/break is finished and recorded
  if (segments.length === 0) {
    wrap?.classList.add("hidden");
    return;
  }
  wrap?.classList.remove("hidden");
  for (const seg of segments) {
    const over = segmentIsOverBreak(seg);
    const li = document.createElement("li");
    li.className = `${seg.type === "set" ? "is-set" : "is-break"}${over ? " is-over" : ""}`;
    const kind = document.createElement("span");
    kind.className = `kind ${seg.type}`;
    kind.textContent =
      seg.type === "set"
        ? `Set ${seg.number}`
        : `Break ${seg.number}${over ? " · over" : ""}`;
    const dur = document.createElement("span");
    dur.className = "dur";
    dur.textContent = formatMs(seg.durationMs);
    li.append(kind, dur);
    list.appendChild(li);
  }
}

function buildWorkoutStatsHTML(workout) {
  const segments = workout.segments || [];
  if (!segments.length) {
    return `<p class="stat-empty">No sets or breaks recorded yet.</p>`;
  }
  let setTime = 0;
  let breakTime = 0;
  const rows = segments
    .map((seg) => {
      if (seg.type === "set") setTime += seg.durationMs;
      else breakTime += seg.durationMs;
      const over = segmentIsOverBreak(seg);
      const label =
        seg.type === "set"
          ? `Set ${seg.number}`
          : `Break ${seg.number}${over ? " · over" : ""}`;
      return `
        <div class="stat-row ${seg.type === "set" ? "is-set" : "is-break"}${over ? " is-over" : ""}">
          <span>${label}</span>
          <span class="time">${formatMs(seg.durationMs)}</span>
        </div>`;
    })
    .join("");
  return `
    ${rows}
    <div class="stat-totals">
      <span>Work time: <strong style="color:var(--set)">${formatMs(setTime)}</strong></span>
      <span>Break time: <strong style="color:var(--break)">${formatMs(breakTime)}</strong></span>
    </div>`;
}

function updateSessionWorkoutsDropdownUI() {
  const wrap = els.finishedWorkouts;
  const panel = els.sessionWorkoutsPanel;
  const btn = els.btnSessionWorkoutsToggle;
  if (!wrap || !panel || !btn) return;

  const n = state.workouts.length;
  if (els.sessionWorkoutsToggleLabel) {
    // No "Workouts this session" title — empty label, chevron only (optional count for a11y via aria)
    els.sessionWorkoutsToggleLabel.textContent = "";
  }
  btn.setAttribute("aria-label", n ? `Session movements (${n})` : "Session movements");
  btn.setAttribute("aria-expanded", state.sessionWorkoutsOpen ? "true" : "false");
  wrap.classList.toggle("is-open", state.sessionWorkoutsOpen);
  panel.classList.toggle("hidden", !state.sessionWorkoutsOpen);
  // Hide entire control when no movements yet
  wrap.classList.toggle("hidden", n === 0 && !state.sessionPaused);
}

function toggleSessionWorkoutsDropdown() {
  state.sessionWorkoutsOpen = !state.sessionWorkoutsOpen;
  updateSessionWorkoutsDropdownUI();
}

function renderFinishedWorkouts() {
  const list = els.finishedList;
  if (!list) return;
  list.innerHTML = "";
  const ordered = [...state.workouts].sort((a, b) => a.number - b.number);
  // Drop expanded ids that no longer exist
  const ids = new Set(ordered.map((w) => w.id));
  state.expandedWorkoutIds = new Set(
    [...state.expandedWorkoutIds].filter((id) => ids.has(id))
  );

  updateSessionWorkoutsDropdownUI();
  if (ordered.length === 0) return;

  for (const w of ordered) {
    const li = document.createElement("li");
    li.className = "fw-item";
    if (w.status === "paused") li.classList.add("is-paused");
    if (w.id === state.activeWorkoutId) li.classList.add("is-active-ref");
    if (state.expandedWorkoutIds.has(w.id)) li.classList.add("is-expanded");
    li.dataset.workout = String(workoutColorIndex(w.number));

    const head = document.createElement("button");
    head.type = "button";
    head.className = "fw-item-head";
    head.setAttribute("aria-expanded", state.expandedWorkoutIds.has(w.id) ? "true" : "false");
    // Index number beside name only — no set/break counts
    head.innerHTML = `
      <div class="fw-main">
        <span class="fw-name"><span class="fw-index">${w.number}.</span> ${escapeHtml(w.name || "movement")}</span>
      </div>
      <svg class="fw-chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
      </svg>
    `;
    head.addEventListener("click", () => {
      if (state.expandedWorkoutIds.has(w.id)) state.expandedWorkoutIds.delete(w.id);
      else state.expandedWorkoutIds.add(w.id);
      renderFinishedWorkouts();
    });

    const actions = document.createElement("div");
    actions.className = "fw-item-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "btn-edit-mini";
    edit.textContent = "Edit";
    edit.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditWorkout(w.id);
    });
    actions.appendChild(edit);

    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.alignItems = "stretch";
    head.style.flex = "1";
    head.style.minWidth = "0";
    top.append(head, actions);

    const stats = document.createElement("div");
    stats.className = "fw-item-stats";
    stats.innerHTML = buildWorkoutStatsHTML(w);

    li.append(top, stats);
    list.appendChild(li);
  }
}

function refreshActiveUI() {
  updateSessionTitle();
  updateCycleButton();
  updatePhaseCard();
  updatePauseButton();
  renderLiveLog();
  renderFinishedWorkouts();
  updateSessionStartDisplay();
}

function showScreen(name) {
  els.screenStart.classList.toggle("hidden", name !== "start");
  els.screenActive.classList.toggle("hidden", name !== "active");
  els.screenSummary.classList.toggle("hidden", name !== "summary");
}

// ── Name workout modal ───────────────────────────────────────────
function resetNameHelp() {
  if (els.nameWorkoutHelp) els.nameWorkoutHelp.classList.add("hidden");
  if (els.btnNameHelp) els.btnNameHelp.setAttribute("aria-expanded", "false");
}

function toggleNameHelp() {
  if (!els.nameWorkoutHelp || !els.btnNameHelp) return;
  els.nameWorkoutHelp.classList.toggle("hidden");
  const isOpen = !els.nameWorkoutHelp.classList.contains("hidden");
  els.btnNameHelp.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function openNameModal(mode) {
  // Prevent stacking / double-open of the same dialog
  if (
    els.nameWorkoutModal &&
    !els.nameWorkoutModal.classList.contains("hidden") &&
    state.nameModalMode === mode
  ) {
    return;
  }
  // Close other dialogs so only one modal is visible
  if (els.settingsModal && !els.settingsModal.classList.contains("hidden")) {
    closeSettings();
  }
  if (els.editWorkoutModal && !els.editWorkoutModal.classList.contains("hidden")) {
    closeEditWorkout();
  }
  if (els.tzPickerModal && !els.tzPickerModal.classList.contains("hidden")) {
    closeTzPicker();
  }

  state.nameModalMode = mode;
  if (mode === "start") {
    els.nameWorkoutTitle.textContent = "Name this movement";
  } else {
    const n = nextWorkoutNumber();
    els.nameWorkoutTitle.textContent = `Name Workout ${n}`;
  }
  els.inputWorkoutName.value = "";
  resetNameHelp();
  hideNameSuggestions();
  openModal(els.nameWorkoutModal);
  setTimeout(() => {
    if (els.nameWorkoutModal.classList.contains("hidden")) return;
    els.inputWorkoutName.focus();
    // Do not show suggestions until the user types
    hideNameSuggestions();
  }, 50);
}

function closeNameModal() {
  const mode = state.nameModalMode;
  closeModal(els.nameWorkoutModal);
  state.nameModalMode = null;
  resetNameHelp();
  hideNameSuggestions();
  // If user cancelled naming the first workout, stay on start screen
  if (mode === "start" && !state.workouts.length) {
    state.awaitingNextMovement = false;
    showScreen("start");
  }
  // Cancelled naming the next movement — keep session open; Continue / Start reopen naming
  if (mode === "next") {
    state.awaitingNextMovement = true;
    state.activeWorkoutId = null;
    state.phase = "idle";
  }
  refreshActiveUI();
}

/** Open the next-movement name dialog (from Continue or Start while waiting). */
function requestNameNextMovement() {
  if (state.sessionPaused) {
    window.alert("Resume the session before starting the next movement.");
    return;
  }
  openNameModal("next");
}

// ── Movement name history / suggestions ──────────────────────────
function normalizeMovementName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function loadMovementNames() {
  try {
    const raw = localStorage.getItem(MOVEMENT_NAMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // unique lowercase
    const set = new Set();
    const out = [];
    for (const n of parsed) {
      const norm = normalizeMovementName(n);
      if (norm && !set.has(norm)) {
        set.add(norm);
        out.push(norm);
      }
    }
    return out;
  } catch {
    return [];
  }
}

function saveMovementName(name) {
  const norm = normalizeMovementName(name);
  if (!norm) return norm;
  const names = loadMovementNames().filter((n) => n !== norm);
  names.unshift(norm); // most recent first
  try {
    localStorage.setItem(MOVEMENT_NAMES_KEY, JSON.stringify(names.slice(0, 200)));
  } catch {
    /* ignore */
  }
  return norm;
}

function removeMovementName(name) {
  const norm = normalizeMovementName(name);
  if (!norm) return false;
  const names = loadMovementNames().filter((n) => n !== norm);
  try {
    localStorage.setItem(MOVEMENT_NAMES_KEY, JSON.stringify(names));
  } catch {
    /* ignore */
  }
  return true;
}

function filterMovementSuggestions(query) {
  const q = normalizeMovementName(query);
  // No query → no suggestions (don't show history until the user types)
  if (!q) return [];
  const names = loadMovementNames();
  // Substring match anywhere (curls matches dumbbell curls, machine curls, etc.)
  const scored = names
    .map((n) => {
      const idx = n.indexOf(q);
      if (idx === -1) return null;
      // Prefer starts-with, then earlier match, then shorter name
      const score = (idx === 0 ? 0 : 100) + idx + n.length / 100;
      return { n, score };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .map((x) => x.n);
  return scored.slice(0, 10);
}

function hideNameSuggestions() {
  if (!els.nameSuggestList) return;
  els.nameSuggestList.classList.add("hidden");
  els.nameSuggestList.innerHTML = "";
}

function renderNameSuggestions(query) {
  if (!els.nameSuggestList) return;
  const q = normalizeMovementName(query);
  // Only show dropdown after the user has typed something
  if (!q) {
    hideNameSuggestions();
    return;
  }
  const matches = filterMovementSuggestions(query);
  els.nameSuggestList.innerHTML = "";
  if (!matches.length) {
    els.nameSuggestList.classList.remove("hidden");
    const li = document.createElement("li");
    li.innerHTML = `<span class="suggest-empty">No matching movements</span>`;
    els.nameSuggestList.appendChild(li);
    return;
  }
  els.nameSuggestList.classList.remove("hidden");
  for (const name of matches) {
    const li = document.createElement("li");
    li.className = "suggest-row";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "suggest-pick";
    btn.setAttribute("role", "option");
    btn.textContent = name;
    btn.addEventListener("mousedown", (e) => {
      // mousedown so it runs before input blur
      e.preventDefault();
      els.inputWorkoutName.value = name;
      hideNameSuggestions();
      els.inputWorkoutName.focus();
    });

    const del = document.createElement("button");
    del.type = "button";
    del.className = "suggest-delete";
    del.setAttribute("aria-label", `Remove saved name ${name}`);
    del.title = "Remove this name";
    del.textContent = "×";
    del.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const ok = window.confirm(
        `Remove “${name}” from saved movement names?\n\nThis only deletes the suggestion, not past session history.`
      );
      if (!ok) {
        els.inputWorkoutName.focus();
        return;
      }
      removeMovementName(name);
      // Refresh list with current query; clear input if it matched the deleted name
      if (normalizeMovementName(els.inputWorkoutName.value) === name) {
        // keep typed text; just refresh suggestions
      }
      renderNameSuggestions(els.inputWorkoutName.value);
      els.inputWorkoutName.focus();
    });

    li.append(btn, del);
    els.nameSuggestList.appendChild(li);
  }
}

function onNameInput() {
  // Force lowercase as user types (letters only case-folded; numbers/symbols kept)
  const el = els.inputWorkoutName;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const lower = el.value.toLowerCase();
  if (el.value !== lower) {
    el.value = lower;
    try {
      el.setSelectionRange(start, end);
    } catch {
      /* ignore */
    }
  }
  renderNameSuggestions(el.value);
}

function confirmNameWorkout() {
  const name = normalizeMovementName(els.inputWorkoutName.value);
  if (!name) {
    els.inputWorkoutName.focus();
    els.inputWorkoutName.placeholder = "please enter a name";
    return;
  }
  els.inputWorkoutName.value = name;
  saveMovementName(name);
  hideNameSuggestions();

  if (state.nameModalMode === "start") {
    state.workouts = [];
    state.mainElapsedMs = 0;
    state.sessionPaused = false;
    state.mergeIntoLastSegment = false;
    state.awaitingNextMovement = false;
    const w = {
      id: uid(),
      number: 1,
      name,
      segments: [],
      status: "active",
      setNumber: 1,
      phase: "idle",
      resumePartial: null,
    };
    state.workouts.push(w);
    state.activeWorkoutId = w.id;
    state.phase = "idle";
    state.setNumber = 1;
    // Confirm without going through cancel path
    state.nameModalMode = null;
    closeModal(els.nameWorkoutModal);
    resetNameHelp();
    hideNameSuggestions();
    showScreen("active");
    refreshActiveUI();
    // 3-2-1 only at the beginning of a session
    runSessionStartCountdown(() => {
      startMainTimer({ reset: true });
      refreshActiveUI();
    });
    return;
  }

  if (state.nameModalMode === "next") {
    const w = {
      id: uid(),
      number: nextWorkoutNumber(),
      name,
      segments: [],
      status: "active",
      setNumber: 1,
      phase: "idle",
      resumePartial: null,
    };
    state.workouts.push(w);
    state.activeWorkoutId = w.id;
    state.phase = "idle";
    state.setNumber = 1;
    state.mergeIntoLastSegment = false;
    state.awaitingNextMovement = false;
    // Confirm next name without treating close as cancel
    state.nameModalMode = null;
    closeModal(els.nameWorkoutModal);
    resetNameHelp();
    hideNameSuggestions();
    refreshActiveUI();
  }
}

// ── Edit workout modal ───────────────────────────────────────────
function openEditWorkout(workoutId) {
  const w = state.workouts.find((x) => x.id === workoutId);
  if (!w) return;
  state.editingWorkoutId = workoutId;
  els.editWorkoutTitle.textContent = w.name ? `Edit · ${w.name}` : `Edit Workout ${w.number}`;
  els.inputEditName.value = w.name;
  openModal(els.editWorkoutModal);
}

function closeEditWorkout() {
  closeModal(els.editWorkoutModal);
  state.editingWorkoutId = null;
}

function getEditingWorkout() {
  return state.workouts.find((w) => w.id === state.editingWorkoutId) || null;
}

function onEditSaveName() {
  const w = getEditingWorkout();
  if (!w) return;
  const name = normalizeMovementName(els.inputEditName.value);
  if (!name) return;
  w.name = name;
  els.inputEditName.value = name;
  saveMovementName(name);
  refreshActiveUI();
  closeEditWorkout();
}

function onEditContinue() {
  const target = getEditingWorkout();
  if (!target) return;

  const lastSet =
    target.resumePartial?.setNumber ||
    getLastSetNumber(target) ||
    target.setNumber ||
    1;

  const hasProgress =
    (target.segments && target.segments.length > 0) || target.resumePartial;

  let resumeSet = false;
  if (hasProgress) {
    resumeSet = window.confirm(
      `Continue Set ${lastSet}?\n\nYes — resume Set ${lastSet} (time combines with that set)\nNo — leave it finished and start the next set later`
    );
  }

  if (target.id !== state.activeWorkoutId) {
    // Switching away from current: pause current movement (not whole session)
    if (!state.sessionPaused) pauseActiveWorkout();
  }

  loadActiveIntoState(target, { resumeSet });
  target.status = "active";
  // If session is paused, keep timers frozen until user hits Resume
  if (state.sessionPaused) {
    clearInterval(state.phaseTimerId);
    state.phaseTimerId = null;
    state.phaseStartedAt = null;
    if (resumeSet && state.phase !== "idle") {
      target.resumePartial = {
        phase: state.phase,
        setNumber: state.setNumber,
        baseMs: state.phaseBaseMs || state.phaseElapsedMs || 0,
      };
      // Display frozen partial time; real ticking resumes with session Resume
      els.phaseTimer.textContent = formatMs(target.resumePartial.baseMs);
      state.phase = "idle";
    }
  }
  refreshActiveUI();
  closeEditWorkout();
}

function onEditRestart() {
  const target = getEditingWorkout();
  if (!target) return;
  if (target.id !== state.activeWorkoutId) {
    pauseActiveWorkout();
  } else {
    commitPhaseIfRunning();
  }
  target.segments = [];
  target.setNumber = 1;
  target.phase = "idle";
  target.status = "active";
  loadActiveIntoState(target);
  refreshActiveUI();
  closeEditWorkout();
}

function onEditRemove() {
  const target = getEditingWorkout();
  if (!target) return;
  if (!window.confirm(`Remove ${target.name || "this movement"}?`)) return;

  const wasActive = target.id === state.activeWorkoutId;
  if (wasActive) {
    commitPhaseIfRunning();
  }

  state.workouts = state.workouts.filter((w) => w.id !== target.id);

  // No movements left in this session → back to Start Workout home screen
  if (state.workouts.length === 0) {
    closeEditWorkout();
    resetSession();
    return;
  }

  if (wasActive) {
    // Prefer a paused workout, else any remaining
    const next =
      state.workouts.find((w) => w.status === "paused") ||
      state.workouts.find((w) => w.status === "active") ||
      state.workouts.find((w) => w.status === "finished") ||
      state.workouts[0];
    if (next) {
      loadActiveIntoState(next);
      next.status = "active";
    }
  }
  refreshActiveUI();
  closeEditWorkout();
}

// ── Session logic ────────────────────────────────────────────────
function onStartWorkoutClick(e) {
  e?.preventDefault?.();
  e?.stopPropagation?.();
  // Only one naming dialog for a fresh session start
  openNameModal("start");
}

function onCyclePress() {
  if (state.sessionPaused) return;
  // Between movements after cancel — Start reopens naming
  if (state.awaitingNextMovement && !getActiveWorkout()) {
    requestNameNextMovement();
    return;
  }
  const active = getActiveWorkout();
  if (!active || active.status === "finished") {
    if (!active) requestNameNextMovement();
    return;
  }

  if (state.phase === "idle") {
    // Resume partial if stashed on this workout
    if (active.resumePartial) {
      const p = active.resumePartial;
      state.phase = p.phase;
      state.setNumber = p.setNumber;
      state.mergeIntoLastSegment = p.phase === "work";
      startPhaseTimer({ baseMs: p.baseMs || 0 });
      syncActiveFromState();
      updateCycleButton();
      updatePhaseCard();
      return;
    }
    state.phase = "work";
    state.mergeIntoLastSegment = false;
    if (!active.segments.length) state.setNumber = 1;
    else if (!state.setNumber || state.setNumber < 1) {
      const lastSet = getLastSetNumber(active);
      state.setNumber = lastSet ? lastSet + 1 : 1;
    }
    startPhaseTimer({ baseMs: 0 });
    syncActiveFromState();
    updateCycleButton();
    updatePhaseCard();
    return;
  }

  if (state.phase === "work") {
    endCurrentSetToBreak();
    return;
  }

  if (state.phase === "break") {
    const durationMs = stopPhaseTimer();
    active.segments.push(makeBreakSegment(state.setNumber, durationMs));
    active.resumePartial = null;
    state.phaseBaseMs = 0;
    state.mergeIntoLastSegment = false;
    els.phaseCard?.classList.remove("is-break-over");
    renderLiveLog();
    renderFinishedWorkouts();
    state.setNumber += 1;
    state.phase = "work";
    startPhaseTimer({ baseMs: 0 });
    syncActiveFromState();
    updateCycleButton();
    updatePhaseCard();
  }
}

function onFinishExercise() {
  if (state.sessionPaused) {
    window.alert("Resume the session before finishing a movement.");
    return;
  }
  // Between movements: Continue reopens the name dialog
  if (state.awaitingNextMovement && !getActiveWorkout()) {
    requestNameNextMovement();
    return;
  }
  const active = getActiveWorkout();
  if (!active) return;
  commitPhaseIfRunning();
  active.status = "finished";
  active.phase = "idle";
  active.setNumber = state.setNumber;
  active.resumePartial = null;
  // Detach until next movement is named (prevents adding sets to a finished workout)
  state.activeWorkoutId = null;
  state.phase = "idle";
  state.setNumber = 1;
  state.mergeIntoLastSegment = false;
  state.phaseBaseMs = 0;
  state.awaitingNextMovement = true;
  refreshActiveUI();
  openNameModal("next");
}

function onFinishSession() {
  // Freeze timers while the confirm dialog is open so cancel doesn't "eat" that time
  const wasPaused = state.sessionPaused;
  let frozeForDialog = false;
  if (!wasPaused) {
    freezeMainElapsed();
    if (state.phase !== "idle") {
      freezePhaseElapsed();
      clearInterval(state.phaseTimerId);
      state.phaseTimerId = null;
      state.phaseStartedAt = null;
    }
    clearInterval(state.mainTimerId);
    state.mainTimerId = null;
    state.mainRunningSince = null;
    frozeForDialog = true;
  }

  const ok = window.confirm(
    "Are you sure you're finished with today's workout?\n\nThis will end the session and show your summary."
  );

  if (!ok) {
    // User cancelled — resume counting from frozen elapsed
    if (frozeForDialog) {
      startMainTimer({ reset: false });
      if (state.phase !== "idle") {
        startPhaseTimer({
          baseMs: state.phaseElapsedMs || state.phaseBaseMs || 0,
          resetSetPrompt: false,
        });
      }
    }
    return;
  }

  const active = getActiveWorkout();
  if (active) {
    commitPhaseIfRunning();
    if (active.segments.length > 0) active.status = "finished";
  }

  stopMainTimer();
  const session = buildSessionRecord();
  if (session.workouts.length === 0 && state.workouts.every((w) => !w.segments?.length)) {
    if (!window.confirm("No sets were recorded. End session anyway?")) {
      if (frozeForDialog || !state.mainTimerId) {
        startMainTimer({ reset: false });
        if (state.phase !== "idle") {
          startPhaseTimer({
            baseMs: state.phaseElapsedMs || state.phaseBaseMs || 0,
            resetSetPrompt: false,
          });
        }
      }
      return;
    }
  }

  if (session.workouts.length > 0) addSessionToHistory(session);

  const startLabel = formatTimeAmpm(session.startedAt);
  const endLabel = formatTimeAmpm(session.finishedAt);
  const dayTitle = formatSessionDayTitle(session.startedAt || session.finishedAt);
  els.summaryDateLabel.textContent = `${dayTitle} · ${startLabel} ~ ${endLabel}`;
  fillSummaryContainers(els.summaryMeta, els.summaryBody, session);
  state.canResumeSession = true;
  if (els.btnResumeSession) els.btnResumeSession.classList.remove("hidden");
  showScreen("summary");
  els.mainTimer.classList.add("hidden");
  updateSessionStartDisplay();
}

function resumeFromSummary() {
  if (!state.canResumeSession) return;
  // Bring user back into the same in-memory session
  showScreen("active");
  els.mainTimer.classList.remove("hidden");
  state.sessionPaused = false;
  state.canResumeSession = false;
  // Keep workouts / elapsed; restart the total timer from frozen elapsed
  if (!state.workoutStartedAt) state.workoutStartedAt = Date.now() - (state.mainElapsedMs || 0);
  startMainTimer({ reset: false });
  // Prefer last unfinished or last paused workout as active
  if (!getActiveWorkout() && state.workouts.length) {
    const pick =
      state.workouts.find((w) => w.status === "paused") ||
      state.workouts.find((w) => w.status === "active") ||
      [...state.workouts].reverse().find((w) => w.status === "finished");
    if (pick) {
      pick.status = "active";
      state.activeWorkoutId = pick.id;
      state.phase = "idle";
      state.setNumber = getLastSetNumber(pick) ? getLastSetNumber(pick) + 1 : 1;
    }
  }
  refreshActiveUI();
  updateSessionStartDisplay();
}

function resetSession() {
  clearInterval(state.mainTimerId);
  clearInterval(state.phaseTimerId);
  clearInterval(state.countdownTimerId);
  state.mainTimerId = null;
  state.phaseTimerId = null;
  state.countdownTimerId = null;
  state.workoutStartedAt = null;
  state.mainRunningSince = null;
  state.phaseStartedAt = null;
  state.mainElapsedMs = 0;
  state.phaseElapsedMs = 0;
  state.phaseBaseMs = 0;
  state.mergeIntoLastSegment = false;
  state.sessionPaused = false;
  state.canResumeSession = false;
  state.awaitingNextMovement = false;
  state.phase = "idle";
  state.setNumber = 1;
  state.workouts = [];
  state.activeWorkoutId = null;
  els.mainTimer.classList.add("hidden");
  els.mainTimerValue.textContent = "00:00";
  els.countdownOverlay?.classList.add("hidden");
  els.pauseOverlay?.classList.add("hidden");
  document.body.classList.remove("overlay-active");
  els.btnCycle.classList.remove("is-work-mode", "is-break-mode");
  els.sessionTitle.removeAttribute("data-workout");
  updateSessionStartDisplay();
  updatePauseButton();
  showScreen("start");
  updateClock();
}

// ── Events (bind once — avoids duplicate listeners if script re-evaluates) ──
function bindAppEvents() {
  if (window.__workoutCounterEventsBound) return;
  window.__workoutCounterEventsBound = true;

  els.btnStartWorkout?.addEventListener("click", onStartWorkoutClick);
  els.btnCycle?.addEventListener("click", onCyclePress);
  els.btnSessionWorkoutsToggle?.addEventListener("click", toggleSessionWorkoutsDropdown);
  els.btnPauseSession?.addEventListener("click", requestPauseSession);
  els.btnResumeOverlay?.addEventListener("click", resumeSession);
  els.btnFinishExercise?.addEventListener("click", onFinishExercise);
  els.btnFinishWorkout?.addEventListener("click", onFinishSession);
  els.btnResumeSession?.addEventListener("click", resumeFromSummary);
  els.btnNewSession?.addEventListener("click", resetSession);
  els.btnDeleteMode?.addEventListener("click", enterSessionSelectMode);
  els.btnSelectAll?.addEventListener("click", selectAllSessions);
  els.btnDeleteSelected?.addEventListener("click", deleteSelectedSessions);
  els.btnCancelSelect?.addEventListener("click", exitSessionSelectMode);
  els.btnEditCurrent?.addEventListener("click", () => {
    if (state.activeWorkoutId) openEditWorkout(state.activeWorkoutId);
  });

  els.btnNameConfirm?.addEventListener("click", confirmNameWorkout);
  els.btnNameHelp?.addEventListener("click", toggleNameHelp);
  els.inputWorkoutName?.addEventListener("input", onNameInput);
  els.inputWorkoutName?.addEventListener("focus", () => {
    // Only show matches if there is already text in the field
    if (normalizeMovementName(els.inputWorkoutName.value)) {
      renderNameSuggestions(els.inputWorkoutName.value);
    } else {
      hideNameSuggestions();
    }
  });
  els.inputWorkoutName?.addEventListener("blur", () => {
    setTimeout(() => hideNameSuggestions(), 150);
  });
  els.inputWorkoutName?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      hideNameSuggestions();
      confirmNameWorkout();
    } else if (e.key === "Escape") {
      hideNameSuggestions();
    }
  });

  els.btnEditSaveName?.addEventListener("click", onEditSaveName);
  els.btnEditContinue?.addEventListener("click", onEditContinue);
  els.btnEditRestart?.addEventListener("click", onEditRestart);
  els.btnEditRemove?.addEventListener("click", onEditRemove);

  els.btnSessionsTab?.addEventListener("click", toggleSessionsDrawer);
  els.btnSessionsClose?.addEventListener("click", closeSessionsDrawer);
  els.sessionsBackdrop?.addEventListener("click", closeSessionsDrawer);

  els.btnSettings?.addEventListener("click", openSettings);
  els.toggleSessionNotes?.addEventListener("change", (e) => setShowSessionNotes(e.target.checked));
  els.toggleStartTime?.addEventListener("change", (e) => setShowStartTime(e.target.checked));
  const onMaxBreakInput = () => saveMaxBreakSec(readMaxBreakFromInputs());
  const onMaxSetInput = () => saveMaxSetSec(readMaxSetFromInputs());
  els.inputMaxBreakMin?.addEventListener("change", onMaxBreakInput);
  els.inputMaxBreakSec?.addEventListener("change", onMaxBreakInput);
  els.inputMaxBreakMin?.addEventListener("blur", onMaxBreakInput);
  els.inputMaxBreakSec?.addEventListener("blur", onMaxBreakInput);
  els.inputMaxSetMin?.addEventListener("change", onMaxSetInput);
  els.inputMaxSetSec?.addEventListener("change", onMaxSetInput);
  els.inputMaxSetMin?.addEventListener("blur", onMaxSetInput);
  els.inputMaxSetSec?.addEventListener("blur", onMaxSetInput);
  els.btnGlobeTz?.addEventListener("click", openTzPicker);
  els.btnOpenTzPicker?.addEventListener("click", openTzPicker);
  els.tzPrev?.addEventListener("click", () => shiftPicker(-1));
  els.tzNext?.addEventListener("click", () => shiftPicker(1));
  els.tzConfirm?.addEventListener("click", confirmTimezone);

  els.btnExportSessions?.addEventListener("click", exportSessions);
  els.btnImportSessions?.addEventListener("click", triggerImportPicker);
  els.btnExportSessionsSide?.addEventListener("click", () => {
    if (els.settingsModal.classList.contains("hidden")) openSettings();
    const backup = document.querySelector('.accordion-item[data-accordion="backup"]');
    document.querySelectorAll(".accordion-item.is-open").forEach((el) => el.classList.remove("is-open"));
    if (backup) {
      backup.classList.add("is-open");
      backup.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "true");
    }
    exportSessions();
  });
  els.btnImportSessionsSide?.addEventListener("click", triggerImportPicker);
  els.importFileInput?.addEventListener("change", onImportFileChange);

  els.tzBand?.addEventListener("mouseenter", () => els.tzTooltip.classList.add("is-visible"));
  els.tzBand?.addEventListener("mouseleave", () => els.tzTooltip.classList.remove("is-visible"));
  els.tzMap?.addEventListener("mouseenter", () => els.tzTooltip.classList.add("is-visible"));
  els.tzMap?.addEventListener("mouseleave", () => els.tzTooltip.classList.remove("is-visible"));

  document.querySelectorAll("[data-close]").forEach((node) => {
    node.addEventListener("click", () => {
      const target = node.getAttribute("data-close");
      if (target === "settings") closeSettings();
      if (target === "tz-picker") closeTzPicker();
      if (target === "name-workout") closeNameModal();
      if (target === "edit-workout") closeEditWorkout();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!els.editWorkoutModal.classList.contains("hidden")) {
        closeEditWorkout();
        return;
      }
      if (!els.nameWorkoutModal.classList.contains("hidden")) {
        closeNameModal();
        return;
      }
      if (!els.tzPickerModal.classList.contains("hidden")) {
        closeTzPicker();
        return;
      }
      if (!els.settingsModal.classList.contains("hidden")) {
        closeSettings();
        return;
      }
      if (els.sessionsDrawer.classList.contains("is-open")) {
        closeSessionsDrawer();
        return;
      }
    }
    if (els.tzPickerModal.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      shiftPicker(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      shiftPicker(1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      confirmTimezone();
    }
  });

  setupAccordion();
}

bindAppEvents();

// Seed movement name suggestions from past session history (once)
(function seedMovementNamesFromHistory() {
  try {
    const existing = new Set(loadMovementNames());
    for (const session of loadSessions()) {
      for (const w of session.workouts || []) {
        const n = normalizeMovementName(w.name);
        if (n) existing.add(n);
      }
    }
    if (existing.size) {
      localStorage.setItem(MOVEMENT_NAMES_KEY, JSON.stringify([...existing]));
    }
  } catch {
    /* ignore */
  }
})();

// ── Init ─────────────────────────────────────────────────────────
updateClock();
setInterval(updateClock, 1000);
renderHistory();
updateSelectModeUI();
updateSessionStartDisplay();
showScreen("start");
