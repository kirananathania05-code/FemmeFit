const STORAGE_KEY = 'femmefit_reminder';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveReminderState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const defaultState = {
  enabled: false,
  days: [], // ['Senin', 'Selasa', ...]
  time: '08:00',
  maxRepeat: 2,
  confirmations: {}, // { '2026-11-01': { confirmed, repeatCount, lastNotified } }
};

const loaded = loadState();
const initial = loaded ? { ...defaultState, ...loaded } : { ...defaultState };

export default {
  namespaced: true,
  state: () => ({ ...initial }),
  mutations: {
    SET_ENABLED(state, value) {
      state.enabled = value;
    },
    SET_DAYS(state, days) {
      state.days = days;
    },
    SET_TIME(state, time) {
      state.time = time;
    },
    SET_MAX_REPEAT(state, max) {
      state.maxRepeat = max;
    },
    CONFIRM_TODAY(state, dateStr) {
      state.confirmations[dateStr] = {
        confirmed: true,
        repeatCount: 0,
        lastNotified: Date.now(),
      };
    },
    INCREMENT_REPEAT(state, dateStr) {
      const cur = state.confirmations[dateStr] || { confirmed: false, repeatCount: 0, lastNotified: null };
      state.confirmations[dateStr] = {
        ...cur,
        repeatCount: cur.repeatCount + 1,
        lastNotified: Date.now(),
      };
    },
    CLEAR_CONFIRMATION(state, dateStr) {
      delete state.confirmations[dateStr];
    },
    RESET(state) {
      state.enabled = false;
      state.days = [];
      state.time = '08:00';
      state.maxRepeat = 2;
      state.confirmations = {};
    },
  },
  actions: {
    toggleEnabled({ commit }, value) {
      commit('SET_ENABLED', value);
    },
    setDays({ commit }, days) {
      commit('SET_DAYS', days);
    },
    setTime({ commit }, time) {
      commit('SET_TIME', time);
    },
    setMaxRepeat({ commit }, max) {
      commit('SET_MAX_REPEAT', max);
    },
    confirmToday({ commit }, dateStr) {
      commit('CONFIRM_TODAY', dateStr);
    },
    incrementRepeat({ commit, state }, dateStr) {
      const entry = state.confirmations[dateStr];
      if (entry && entry.repeatCount >= state.maxRepeat) return false;
      commit('INCREMENT_REPEAT', dateStr);
      return true;
    },
    resetReminder({ commit }) {
      commit('RESET');
    },
  },
  getters: {
    isConfirmedToday: (state) => (dateStr) => {
      const entry = state.confirmations[dateStr];
      return entry ? entry.confirmed : false;
    },
    repeatCount: (state) => (dateStr) => {
      const entry = state.confirmations[dateStr];
      return entry ? entry.repeatCount : 0;
    },
    canRepeat: (state) => (dateStr) => {
      const entry = state.confirmations[dateStr];
      if (!entry) return true;
      return entry.repeatCount < state.maxRepeat;
    },
    totalConfirmedThisMonth: (state) => {
      const monthPrefix = new Date().toISOString().slice(0, 7);
      return Object.entries(state.confirmations).filter(
        ([date, val]) => date.startsWith(monthPrefix) && val.confirmed
      ).length;
    },
  },
};
