/**
 * Workout Rep & Set Counter
 */

const STORAGE_KEY = "workout-counter-sessions";
const TZ_STORAGE_KEY = "workout-counter-timezone";
const SHOW_NOTES_KEY = "workout-counter-show-session-notes";
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
  screenStart: document.getElementById("screen-start"),
  screenActive: document.getElementById("screen-active"),
  screenSummary: document.getElementById("screen-summary"),
  dateLabel: document.getElementById("date-label"),
  currentDate: document.getElementById("current-date"),
  currentTime: document.getElementById("current-time"),
  timezoneNote: document.getElementById("timezone-note"),
  btnStartWorkout: document.getElementById("btn-start-workout"),
  sessionTitle: document.getElementById("session-title"),
  sessionMovement: document.getElementById("session-movement"),
  phaseCard: document.getElementById("phase-card"),
  phaseLabel: document.getElementById("phase-label"),
  phaseTimer: document.getElementById("phase-timer"),
  phaseHint: document.getElementById("phase-hint"),
  btnCycle: document.getElementById("btn-cycle"),
  btnFinishExercise: document.getElementById("btn-finish-exercise"),
  btnFinishWorkout: document.getElementById("btn-finish-workout"),
  btnEditCurrent: document.getElementById("btn-edit-current"),
  liveLogList: document.getElementById("live-log-list"),
  finishedList: document.getElementById("finished-workouts-list"),
  finishedEmpty: document.getElementById("finished-workouts-empty"),
  summaryMeta: document.getElementById("summary-meta"),
  summaryBody: document.getElementById("summary-body"),
  summaryDateLabel: document.getElementById("summary-date-label"),
  btnNewSession: document.getElementById("btn-new-session"),
  historyList: document.getElementById("history-list"),
  historyEmpty: document.getElementById("history-empty"),
  btnClearHistory: document.getElementById("btn-clear-history"),
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
  nameWorkoutHint: document.getElementById("name-workout-hint"),
  inputWorkoutName: document.getElementById("input-workout-name"),
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
 * { id, number, name, segments, status: 'active'|'paused'|'finished', setNumber, phase }
 */
const state = {
  timezone: loadSavedTimezone(),
  showSessionNotes: loadShowSessionNotes(),
  pickerIndex: 0,
  workoutStartedAt: null,
  mainElapsedMs: 0,
  mainTimerId: null,
  phase: "idle",
  phaseStartedAt: null,
  phaseElapsedMs: 0,
  phaseTimerId: null,
  workouts: [],
  activeWorkoutId: null,
  setNumber: 1,
  nameModalMode: null, // 'start' | 'next'
  editingWorkoutId: null,
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

function formatSessionDateLabel(date = new Date()) {
  const tz = getTimezone();
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long" }).format(date);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return `${weekday} ${parts.month}/${parts.day}/${parts.year}`;
}

function lonToPercent(lon) {
  let x = ((lon + 180) / 360) * 100;
  if (x < 0) x += 100;
  if (x > 100) x -= 100;
  return x;
}

function updateClock() {
  const meta = getTzMeta();
  const p = nowInZoneParts();
  if (els.dateLabel) els.dateLabel.textContent = `Today · ${meta.region}`;
  els.currentDate.textContent = `${p.weekday}, ${p.month} ${p.day}, ${p.year}`;
  els.currentTime.textContent = `${p.hour}:${p.minute}:${p.second} ${p.dayPeriod}`;
  if (els.timezoneNote) els.timezoneNote.textContent = `Timezone: ${meta.id}`;
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

function openSettings() {
  refreshSettingsTzDisplay();
  refreshSettingsClientInfo();
  if (els.toggleSessionNotes) els.toggleSessionNotes.checked = state.showSessionNotes;
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
  closeTzPicker();
  if (els.settingsModal.classList.contains("hidden")) openSettings();
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

  // Also include active workout segments if any
  const stats = computeSessionStats(workouts, state.mainElapsedMs);
  const finishedAt = Date.now();
  const client = detectClientEnvironment();
  const tzMeta = getTzMeta();
  return {
    id: `session-${finishedAt}-${Math.random().toString(36).slice(2, 8)}`,
    dateLabel: formatSessionDateLabel(new Date(finishedAt)),
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

function buildWorkoutsHTML(workouts) {
  if (!workouts || workouts.length === 0) {
    return `<p class="empty-note">No sets were recorded this session.</p>`;
  }
  return workouts
    .map((workout) => {
      const wi = workoutColorIndex(workout.number);
      const title = workout.name
        ? `Workout ${workout.number} · ${escapeHtml(workout.name)}`
        : `Workout ${workout.number}`;
      if (!workout.segments?.length) {
        return `<div class="workout-block" data-workout="${wi}"><h2>${title}</h2><p class="empty-note">No sets or breaks.</p></div>`;
      }
      let setTime = 0;
      let breakTime = 0;
      const rows = workout.segments
        .map((seg) => {
          if (seg.type === "set") setTime += seg.durationMs;
          else breakTime += seg.durationMs;
          const label = seg.type === "set" ? `Set ${seg.number}` : `Break after Set ${seg.number}`;
          return `<div class="row ${seg.type === "set" ? "is-set" : "is-break"}"><span class="name ${seg.type}">${label}</span><span class="time">${formatMs(seg.durationMs)}</span></div>`;
        })
        .join("");
      return `
        <div class="workout-block" data-workout="${wi}">
          <h2>${title}</h2>
          ${rows}
          <div class="totals">
            <span>Work time: <strong style="color:var(--set)">${formatMs(setTime)}</strong></span>
            <span>Break time: <strong style="color:var(--break)">${formatMs(breakTime)}</strong></span>
          </div>
        </div>`;
    })
    .join("");
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
  let body = buildWorkoutsHTML(session.workouts);
  if (state.showSessionNotes) body += buildSessionNoteMetaHTML(session);
  bodyEl.innerHTML = body;
}

function renderHistory(openId = null) {
  const sessions = loadSessions();
  const list = els.historyList;
  list.querySelectorAll(".history-item").forEach((el) => el.remove());
  if (sessions.length === 0) {
    els.historyEmpty.classList.remove("hidden");
    return;
  }
  els.historyEmpty.classList.add("hidden");
  const ordered = [...sessions].sort((a, b) => b.finishedAt - a.finishedAt);
  for (const session of ordered) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.dataset.id = session.id;
    if (openId && session.id === openId) item.classList.add("is-open");
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
        <span class="date-text">${escapeHtml(session.dateLabel)}</span>
        ${browserChip ? `<span class="browser-chip">${browserChip}</span>` : ""}
      </span>
      <svg class="chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
      </svg>`;
    const body = document.createElement("div");
    body.className = "history-item-body";
    const meta = document.createElement("div");
    meta.className = "summary-meta";
    const detail = document.createElement("div");
    detail.className = "summary-body";
    fillSummaryContainers(meta, detail, session);
    body.append(meta, detail);
    toggle.addEventListener("click", () => {
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
    item.append(toggle, body);
    list.appendChild(item);
  }
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
  if (state.workoutStartedAt) state.mainElapsedMs = Date.now() - state.workoutStartedAt;
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
  if (state.phaseStartedAt) state.phaseElapsedMs = Date.now() - state.phaseStartedAt;
  els.phaseTimer.textContent = formatMs(state.phaseElapsedMs);
  return state.phaseElapsedMs;
}

// ── Active workout sync ──────────────────────────────────────────
function commitPhaseIfRunning() {
  if (state.phase === "idle") return;
  const durationMs = stopPhaseTimer();
  const active = getActiveWorkout();
  if (!active) return;
  if (state.phase === "work") {
    active.segments.push({ type: "set", number: state.setNumber, durationMs });
  } else if (state.phase === "break") {
    active.segments.push({ type: "break", number: state.setNumber, durationMs });
  }
  state.phase = "idle";
  state.phaseElapsedMs = 0;
  renderLiveLog();
}

function syncActiveFromState() {
  const active = getActiveWorkout();
  if (!active) return;
  active.phase = state.phase;
  active.setNumber = state.setNumber;
  active.segments = active.segments || [];
}

function loadActiveIntoState(workout) {
  state.activeWorkoutId = workout.id;
  state.phase = workout.phase || "idle";
  state.setNumber = workout.setNumber || 1;
  state.phaseElapsedMs = 0;
  state.phaseStartedAt = null;
  els.phaseTimer.textContent = "00:00";
  // Continuing always resumes from idle (sets already committed when paused)
  if (state.phase !== "idle") {
    state.phase = "idle";
    workout.phase = "idle";
  }
  workout.status = "active";
}

function pauseActiveWorkout() {
  const active = getActiveWorkout();
  if (!active) return;
  commitPhaseIfRunning();
  syncActiveFromState();
  // Keep finished as finished; otherwise mark paused
  if (active.status !== "finished") active.status = "paused";
  active.phase = "idle";
}

// ── UI updates ───────────────────────────────────────────────────
function updateCycleButton() {
  const btn = els.btnCycle;
  const active = getActiveWorkout();
  const name = active?.name || "";
  btn.classList.remove("is-work-mode", "is-break-mode");
  if (state.phase === "idle") {
    btn.textContent = name ? `${name} · Start` : "Start";
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
  card.classList.remove("is-work", "is-break", "is-idle");
  const active = getActiveWorkout();
  if (state.phase === "idle") {
    card.classList.add("is-idle");
    els.phaseLabel.textContent = "Ready";
    els.phaseTimer.textContent = "00:00";
    els.phaseHint.textContent = active
      ? `Press Start to begin ${active.name}`
      : "Press Start to begin";
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

function updateSessionTitle() {
  const active = getActiveWorkout();
  if (!active) {
    els.sessionTitle.textContent = "Next workout";
    els.sessionTitle.removeAttribute("data-workout");
    if (els.sessionMovement) {
      els.sessionMovement.textContent = "Name the next movement to continue";
    }
    if (els.btnFinishExercise) {
      els.btnFinishExercise.textContent = "Finish";
      els.btnFinishExercise.disabled = true;
    }
    if (els.btnCycle) els.btnCycle.disabled = true;
    return;
  }
  const n = active.number;
  const name = (active.name || "").trim() || `Workout ${n}`;
  // Primary title becomes the movement name (not "Workout 1")
  els.sessionTitle.textContent = name;
  els.sessionTitle.dataset.workout = String(workoutColorIndex(n));
  if (els.sessionMovement) {
    els.sessionMovement.textContent = `Workout ${n}`;
  }
  if (els.btnFinishExercise) {
    els.btnFinishExercise.textContent = `Finish ${name}`;
    els.btnFinishExercise.disabled = false;
  }
  if (els.btnCycle) els.btnCycle.disabled = false;
}

function renderLiveLog() {
  const list = els.liveLogList;
  list.innerHTML = "";
  const active = getActiveWorkout();
  const segments = active?.segments || [];
  if (segments.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No sets or breaks recorded yet.";
    list.appendChild(p);
    return;
  }
  for (const seg of segments) {
    const li = document.createElement("li");
    li.className = seg.type === "set" ? "is-set" : "is-break";
    const kind = document.createElement("span");
    kind.className = `kind ${seg.type}`;
    kind.textContent = seg.type === "set" ? `Set ${seg.number}` : `Break ${seg.number}`;
    const dur = document.createElement("span");
    dur.className = "dur";
    dur.textContent = formatMs(seg.durationMs);
    li.append(kind, dur);
    list.appendChild(li);
  }
}

function renderFinishedWorkouts() {
  const list = els.finishedList;
  if (!list) return;
  list.innerHTML = "";
  // Show all workouts as a session map (active included for reference)
  const ordered = [...state.workouts].sort((a, b) => a.number - b.number);
  if (ordered.length === 0) return;

  for (const w of ordered) {
    const li = document.createElement("li");
    li.className = "fw-item";
    if (w.status === "paused") li.classList.add("is-paused");
    if (w.id === state.activeWorkoutId) li.classList.add("is-active-ref");
    li.dataset.workout = String(workoutColorIndex(w.number));

    const sets = (w.segments || []).filter((s) => s.type === "set").length;
    const main = document.createElement("div");
    main.className = "fw-main";
    main.innerHTML = `
      <span class="fw-name">${escapeHtml(w.name || `Workout ${w.number}`)}</span>
      <span class="fw-meta">Workout ${w.number} · ${sets} set${sets === 1 ? "" : "s"} · ${w.status}</span>
    `;

    const badge = document.createElement("span");
    badge.className = `fw-badge ${w.status}`;
    badge.textContent = w.status;

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "btn-edit-mini";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => openEditWorkout(w.id));

    li.append(main, badge, edit);
    list.appendChild(li);
  }
}

function refreshActiveUI() {
  updateSessionTitle();
  updateCycleButton();
  updatePhaseCard();
  renderLiveLog();
  renderFinishedWorkouts();
}

function showScreen(name) {
  els.screenStart.classList.toggle("hidden", name !== "start");
  els.screenActive.classList.toggle("hidden", name !== "active");
  els.screenSummary.classList.toggle("hidden", name !== "summary");
}

// ── Name workout modal ───────────────────────────────────────────
function openNameModal(mode) {
  state.nameModalMode = mode;
  if (mode === "start") {
    els.nameWorkoutTitle.textContent = "Name this movement";
    els.nameWorkoutHint.textContent = "What exercise is Workout 1?";
  } else {
    const n = nextWorkoutNumber();
    els.nameWorkoutTitle.textContent = `Name Workout ${n}`;
    els.nameWorkoutHint.textContent = "What exercise is next?";
  }
  els.inputWorkoutName.value = "";
  openModal(els.nameWorkoutModal);
  setTimeout(() => els.inputWorkoutName.focus(), 50);
}

function closeNameModal() {
  const mode = state.nameModalMode;
  closeModal(els.nameWorkoutModal);
  state.nameModalMode = null;
  // If user cancelled naming the first workout, stay on start screen
  if (mode === "start" && !state.workouts.length) {
    showScreen("start");
  }
  // If cancelled naming next, they can Edit → Continue a finished workout or try Start again
  refreshActiveUI();
}

function confirmNameWorkout() {
  const name = els.inputWorkoutName.value.trim();
  if (!name) {
    els.inputWorkoutName.focus();
    els.inputWorkoutName.placeholder = "Please enter a name";
    return;
  }

  if (state.nameModalMode === "start") {
    state.workouts = [];
    state.mainElapsedMs = 0;
    const w = {
      id: uid(),
      number: 1,
      name,
      segments: [],
      status: "active",
      setNumber: 1,
      phase: "idle",
    };
    state.workouts.push(w);
    state.activeWorkoutId = w.id;
    state.phase = "idle";
    state.setNumber = 1;
    startMainTimer();
    showScreen("active");
    refreshActiveUI();
    closeNameModal();
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
    };
    state.workouts.push(w);
    state.activeWorkoutId = w.id;
    state.phase = "idle";
    state.setNumber = 1;
    refreshActiveUI();
    closeNameModal();
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
  const name = els.inputEditName.value.trim();
  if (!name) return;
  w.name = name;
  refreshActiveUI();
  closeEditWorkout();
}

function onEditContinue() {
  const target = getEditingWorkout();
  if (!target) return;
  if (target.id === state.activeWorkoutId) {
    closeEditWorkout();
    return;
  }
  pauseActiveWorkout();
  loadActiveIntoState(target);
  // If it was finished, continuing reopens it
  target.status = "active";
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
  if (!window.confirm(`Remove Workout ${target.number} · ${target.name}?`)) return;

  const wasActive = target.id === state.activeWorkoutId;
  if (wasActive) {
    commitPhaseIfRunning();
  }

  state.workouts = state.workouts.filter((w) => w.id !== target.id);

  if (wasActive) {
    // Prefer a paused workout, else any remaining, else name a new one
    const next =
      state.workouts.find((w) => w.status === "paused") ||
      state.workouts.find((w) => w.status === "finished") ||
      state.workouts[0];
    if (next) {
      loadActiveIntoState(next);
      next.status = "active";
    } else {
      state.activeWorkoutId = null;
      closeEditWorkout();
      openNameModal("next");
      refreshActiveUI();
      return;
    }
  }
  refreshActiveUI();
  closeEditWorkout();
}

// ── Session logic ────────────────────────────────────────────────
function onStartWorkoutClick() {
  openNameModal("start");
}

function onCyclePress() {
  const active = getActiveWorkout();
  if (!active || active.status === "finished") {
    if (!active) openNameModal("next");
    return;
  }

  if (state.phase === "idle") {
    state.phase = "work";
    // If no sets yet, start at 1; else continue from saved setNumber if restarting mid
    if (!active.segments.length) state.setNumber = 1;
    else {
      const lastSet = [...active.segments].reverse().find((s) => s.type === "set");
      // After a completed break, setNumber already points to next; if idle after finish set without break, keep
      if (!state.setNumber || state.setNumber < 1) {
        state.setNumber = lastSet ? lastSet.number + 1 : 1;
      }
    }
    startPhaseTimer();
    syncActiveFromState();
    updateCycleButton();
    updatePhaseCard();
    return;
  }

  if (state.phase === "work") {
    const durationMs = stopPhaseTimer();
    active.segments.push({ type: "set", number: state.setNumber, durationMs });
    renderLiveLog();
    renderFinishedWorkouts();
    state.phase = "break";
    startPhaseTimer();
    syncActiveFromState();
    updateCycleButton();
    updatePhaseCard();
    return;
  }

  if (state.phase === "break") {
    const durationMs = stopPhaseTimer();
    active.segments.push({ type: "break", number: state.setNumber, durationMs });
    renderLiveLog();
    renderFinishedWorkouts();
    state.setNumber += 1;
    state.phase = "work";
    startPhaseTimer();
    syncActiveFromState();
    updateCycleButton();
    updatePhaseCard();
  }
}

function onFinishExercise() {
  const active = getActiveWorkout();
  if (!active) return;
  commitPhaseIfRunning();
  active.status = "finished";
  active.phase = "idle";
  active.setNumber = state.setNumber;
  // Detach until next movement is named (prevents adding sets to a finished workout)
  state.activeWorkoutId = null;
  state.phase = "idle";
  state.setNumber = 1;
  refreshActiveUI();
  openNameModal("next");
}

function onFinishSession() {
  const ok = window.confirm(
    "Are you sure you're finished with today's workout?\n\nThis will end the session and show your summary."
  );
  if (!ok) return;

  const active = getActiveWorkout();
  if (active) {
    commitPhaseIfRunning();
    if (active.segments.length > 0) active.status = "finished";
  }

  stopMainTimer();
  const session = buildSessionRecord();
  if (session.workouts.length === 0 && state.workouts.every((w) => !w.segments?.length)) {
    // empty session — still allow end without saving empty?
    if (!window.confirm("No sets were recorded. End session anyway?")) {
      // resume main timer
      if (!state.mainTimerId && state.workoutStartedAt) {
        const already = state.mainElapsedMs;
        state.workoutStartedAt = Date.now() - already;
        state.mainTimerId = setInterval(() => {
          state.mainElapsedMs = Date.now() - state.workoutStartedAt;
          els.mainTimerValue.textContent = formatMs(state.mainElapsedMs);
        }, 250);
      }
      return;
    }
  }

  if (session.workouts.length > 0) addSessionToHistory(session);

  els.summaryDateLabel.textContent = session.dateLabel || formatSessionDateLabel();
  fillSummaryContainers(els.summaryMeta, els.summaryBody, session);
  showScreen("summary");
  els.mainTimer.classList.add("hidden");
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
  state.setNumber = 1;
  state.workouts = [];
  state.activeWorkoutId = null;
  els.mainTimer.classList.add("hidden");
  els.mainTimerValue.textContent = "00:00";
  els.btnCycle.classList.remove("is-work-mode", "is-break-mode");
  els.sessionTitle.removeAttribute("data-workout");
  showScreen("start");
  updateClock();
}

function onClearHistory() {
  if (!loadSessions().length) return;
  if (!window.confirm("Clear all saved session history?")) return;
  saveSessions([]);
  renderHistory();
}

// ── Events ───────────────────────────────────────────────────────
els.btnStartWorkout.addEventListener("click", onStartWorkoutClick);
els.btnCycle.addEventListener("click", onCyclePress);
els.btnFinishExercise.addEventListener("click", onFinishExercise);
els.btnFinishWorkout.addEventListener("click", onFinishSession);
els.btnNewSession.addEventListener("click", resetSession);
els.btnClearHistory.addEventListener("click", onClearHistory);
els.btnEditCurrent?.addEventListener("click", () => {
  if (state.activeWorkoutId) openEditWorkout(state.activeWorkoutId);
});

els.btnNameConfirm?.addEventListener("click", confirmNameWorkout);
els.inputWorkoutName?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    confirmNameWorkout();
  }
});

els.btnEditSaveName?.addEventListener("click", onEditSaveName);
els.btnEditContinue?.addEventListener("click", onEditContinue);
els.btnEditRestart?.addEventListener("click", onEditRestart);
els.btnEditRemove?.addEventListener("click", onEditRemove);

els.btnSessionsTab?.addEventListener("click", toggleSessionsDrawer);
els.btnSessionsClose?.addEventListener("click", closeSessionsDrawer);
els.sessionsBackdrop?.addEventListener("click", closeSessionsDrawer);

els.btnSettings.addEventListener("click", openSettings);
els.toggleSessionNotes?.addEventListener("change", (e) => setShowSessionNotes(e.target.checked));
els.btnOpenTzPicker.addEventListener("click", openTzPicker);
els.tzPrev.addEventListener("click", () => shiftPicker(-1));
els.tzNext.addEventListener("click", () => shiftPicker(1));
els.tzConfirm.addEventListener("click", confirmTimezone);

els.btnExportSessions?.addEventListener("click", exportSessions);
els.btnImportSessions?.addEventListener("click", triggerImportPicker);
els.btnExportSessionsSide?.addEventListener("click", () => {
  if (els.settingsModal.classList.contains("hidden")) openSettings();
  // open backup accordion
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

els.tzBand.addEventListener("mouseenter", () => els.tzTooltip.classList.add("is-visible"));
els.tzBand.addEventListener("mouseleave", () => els.tzTooltip.classList.remove("is-visible"));
els.tzMap.addEventListener("mouseenter", () => els.tzTooltip.classList.add("is-visible"));
els.tzMap.addEventListener("mouseleave", () => els.tzTooltip.classList.remove("is-visible"));

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

// ── Init ─────────────────────────────────────────────────────────
updateClock();
setInterval(updateClock, 1000);
renderHistory();
showScreen("start");
