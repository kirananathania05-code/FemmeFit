/**
 * dateUtils — date helpers for the FemmeFit calendar and cycle tracking.
 * All functions return plain values; no side effects.
 */

export const WEEKDAYS_SHORT = ['Mn', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sa'];
export const WEEKDAYS_LONG = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/** Parse a 'YYYY-MM-DD' string into a local Date (no timezone drift). */
export function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Format a Date into 'YYYY-MM-DD'. */
export function formatDate(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Today as 'YYYY-MM-DD'. */
export function todayStr() {
  return formatDate(new Date());
}

/** Number of days in a given month (0-indexed). */
export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/** Build a 6×7 grid of Date objects for a month view (Mon-start). */
export function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  // Convert Sunday(0) to index 6 for Monday-start
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const gridStart = new Date(year, month, 1 - startOffset);
  const grid = [];
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return grid;
}

/** Difference in whole days between two date strings (a - b). */
export function dayDiff(aStr, bStr) {
  const a = parseDate(aStr);
  const b = parseDate(bStr);
  if (!a || !b) return 0;
  return Math.round((a - b) / 86400000);
}

/** Add n days to a date string, return new 'YYYY-MM-DD'. */
export function addDays(dateStr, n) {
  const d = parseDate(dateStr);
  if (!d) return '';
  d.setDate(d.getDate() + n);
  return formatDate(d);
}

/** Human-friendly label: "5 Mar 2026". */
export function prettyDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/** Full label: "5 Maret 2026". */
export function fullDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return '';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Check if two date strings are the same day. */
export function isSameDay(aStr, bStr) {
  return aStr === bStr;
}

/** Check if a date string is today. */
export function isToday(dateStr) {
  return dateStr === todayStr();
}

/** Get the day of the week (0=Sunday). */
export function dayOfWeek(dateStr) {
  const d = parseDate(dateStr);
  return d ? d.getDay() : -1;
}

/** Format a time string "HH:MM" for display. */
export function prettyTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}
