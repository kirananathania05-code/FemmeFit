/**
 * cycleUtils — logic for cycle length, predictions, and phase calculations.
 * Returns estimates only, never diagnoses.
 */

import { parseDate, dayDiff, addDays } from './dateUtils.js';

/**
 * Compute the length (days) of a single period entry.
 * If endDate is null/missing, returns null (ongoing).
 */
export function periodLength(entry) {
  if (!entry?.startDate) return 0;
  if (!entry.endDate) return null;
  return dayDiff(entry.endDate, entry.startDate) + 1;
}

/**
 * Compute the cycle length (days) between two consecutive period startDates.
 */
export function cycleLength(startA, startB) {
  return Math.abs(dayDiff(startB, startA));
}

/**
 * From a sorted (oldest-first) array of period entries, compute the average cycle length.
 * Returns null if fewer than 2 entries.
 */
export function averageCycleLength(entries) {
  if (!entries || entries.length < 2) return null;
  const sorted = [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lengths = [];
  for (let i = 1; i < sorted.length; i++) {
    lengths.push(cycleLength(sorted[i - 1].startDate, sorted[i].startDate));
  }
  return Math.round(lengths.reduce((s, v) => s + v, 0) / lengths.length);
}

/**
 * Average period duration from completed entries.
 */
export function averagePeriodLength(entries) {
  if (!entries || entries.length === 0) return null;
  const completed = entries.filter(e => e.endDate);
  if (completed.length === 0) return null;
  const lengths = completed.map(periodLength);
  return Math.round(lengths.reduce((s, v) => s + v, 0) / lengths.length);
}

/**
 * Predict the next period start date based on the latest entry + avg cycle length.
 * Falls back to 28 days if not enough data.
 */
export function predictNextStart(entries) {
  if (!entries || entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const last = sorted[sorted.length - 1];
  const avg = averageCycleLength(entries) || 28;
  return addDays(last.startDate, avg);
}

/**
 * Get the current cycle day (1-based) relative to the last period start.
 * Returns null if no entries.
 */
export function currentCycleDay(entries) {
  if (!entries || entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const last = sorted[sorted.length - 1];
  return dayDiff(new Date().toISOString().slice(0, 10), last.startDate) + 1;
}

/**
 * Determine the cycle phase for a given date, given the last period start and avg cycle length.
 * Phases: menstrual, follicular, ovulation, luteal.
 */
export function getPhase(dateStr, lastPeriodStart, cycleLen) {
  if (!lastPeriodStart) return null;
  const day = dayDiff(dateStr, lastPeriodStart) + 1;
  const cl = cycleLen || 28;
  const cycleDay = ((day - 1) % cl) + 1;

  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= 13) return 'follicular';
  if (cycleDay <= 16) return 'ovulation';
  return 'luteal';
}

export const PHASE_INFO = {
  menstrual: { label: 'Menstruasi', color: '#F94F8A', icon: '🩸', desc: 'Fase haid — tubuh melepas dinding rahim.' },
  follicular: { label: 'Folikular', color: '#FBB85A', icon: '🌱', desc: 'Tubuh mempersiapkan pelepasan sel telur.' },
  ovulation: { label: 'Ovulasi', color: '#34B57F', icon: '✨', desc: 'Sel telur dilepas — masa paling subur.' },
  luteal: { label: 'Luteal', color: '#A78BFA', icon: '🌙', desc: 'PMS mungkin muncul. Jaga istirahat dan nutrisi.' },
};

/**
 * Check if a date string falls within any period entry's range.
 */
export function isPeriodDay(dateStr, entries) {
  if (!entries) return false;
  for (const e of entries) {
    if (!e.startDate) continue;
    if (dateStr === e.startDate) return true;
    if (e.endDate && dateStr >= e.startDate && dateStr <= e.endDate) return true;
  }
  return false;
}

/**
 * Generate cycle history for the chart: array of { label, cycleLength, periodLength }.
 */
export function buildCycleHistory(entries) {
  if (!entries || entries.length === 0) return [];
  const sorted = [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const history = [];
  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const pl = periodLength(entry);
    let cl = null;
    if (i > 0) {
      cl = cycleLength(sorted[i - 1].startDate, entry.startDate);
    }
    history.push({
      label: `Siklus ${i + 1}`,
      cycleLength: cl,
      periodLength: pl,
    });
  }
  return history;
}
