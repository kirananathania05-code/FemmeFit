import { averageCycleLength, averagePeriodLength, predictNextStart, currentCycleDay, buildCycleHistory } from '../utils/cycleUtils.js';
import { todayStr } from '../utils/dateUtils.js';

const STORAGE_KEY = 'femmefit_period';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePeriodState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const defaultState = {
  entries: [], // { id, startDate, endDate, note }
};

const loaded = loadState();
const initial = loaded ? { ...defaultState, ...loaded } : { ...defaultState };

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default {
  namespaced: true,
  state: () => ({ ...initial }),
  mutations: {
    ADD_ENTRY(state, { startDate, endDate, note }) {
      state.entries.push({
        id: genId(),
        startDate,
        endDate: endDate || null,
        note: note || '',
      });
      state.entries.sort((a, b) => a.startDate.localeCompare(b.startDate));
    },
    UPDATE_ENTRY(state, { id, updates }) {
      const idx = state.entries.findIndex((e) => e.id === id);
      if (idx >= 0) {
        state.entries[idx] = { ...state.entries[idx], ...updates };
        state.entries.sort((a, b) => a.startDate.localeCompare(b.startDate));
      }
    },
    REMOVE_ENTRY(state, id) {
      state.entries = state.entries.filter((e) => e.id !== id);
    },
    RESET(state) {
      state.entries = [];
    },
  },
  actions: {
    addPeriod({ commit }, payload) {
      commit('ADD_ENTRY', payload);
    },
    updatePeriod({ commit }, payload) {
      commit('UPDATE_ENTRY', payload);
    },
    removePeriod({ commit }, id) {
      commit('REMOVE_ENTRY', id);
    },
    resetPeriod({ commit }) {
      commit('RESET');
    },
  },
  getters: {
    sortedEntries: (state) => [...state.entries].sort((a, b) => b.startDate.localeCompare(a.startDate)),
    entryCount: (state) => state.entries.length,
    avgCycleLength: (state) => averageCycleLength(state.entries),
    avgPeriodLength: (state) => averagePeriodLength(state.entries),
    nextPredictedStart: (state) => predictNextStart(state.entries),
    currentDay: (state) => currentCycleDay(state.entries),
    cycleHistory: (state) => buildCycleHistory(state.entries),
    latestEntry: (state) => {
      const sorted = [...state.entries].sort((a, b) => b.startDate.localeCompare(a.startDate));
      return sorted[0] || null;
    },
    isOnPeriod: (state) => {
      const today = todayStr();
      return state.entries.some((e) => {
        if (!e.endDate) return e.startDate === today;
        return today >= e.startDate && today <= e.endDate;
      });
    },
  },
};
