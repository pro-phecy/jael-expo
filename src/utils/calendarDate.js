const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Stable string key for a date, ignoring time-of-day. */
export function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Inverse of dateKey — turns "2026-6-13" back into a Date. */
export function keyToDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m, d);
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 24h "HH:MM" -> "4:00pm". Returns null for empty/missing input. */
export function formatTime(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const period = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

/** "9:00" -> 540 minutes past midnight, for sorting. Missing time sorts last. */
export function timeToMinutes(t) {
  if (!t) return 9999;
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
  return h * 60 + m;
}

export function formatMonthYear(date) {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDayHeader(date, today) {
  const base = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return isSameDay(date, today) ? `Today · ${base}` : base;
}

export function formatAgendaHeader(date, today) {
  const diffDays = Math.round((startOfDay(date) - startOfDay(today)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  const opts = date.getFullYear() === today.getFullYear()
    ? { weekday: "long", month: "long", day: "numeric" }
    : { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", opts);
}

export const WEEKDAYS = WEEKDAY_LABELS;

/** Cells for a month grid: leading nulls for padding, then 1..daysInMonth. */
export function monthCells(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  return Array.from({ length: firstWeekday })
    .map(() => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
}