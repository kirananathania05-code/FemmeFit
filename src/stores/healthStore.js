export const MOODS = [
  { id: 'senang', label: 'Senang', emoji: '😊', color: '#FBB85A' },
  { id: 'tenang', label: 'Tenang', emoji: '😌', color: '#A8E4C3' },
  { id: 'lelah', label: 'Lelah', emoji: '😮‍💨', color: '#FFA8C0' },
  { id: 'sedih', label: 'Sedih', emoji: '😢', color: '#A1A1B0' },
  { id: 'marah', label: 'Marah', emoji: '😠', color: '#F94F8A' },
  { id: 'cemas', label: 'Cemas', emoji: '😰', color: '#FFD08A' },
];

export const SYMPTOMS = [
  'Kram perut',
  'Pusing',
  'Lemas',
  'Mual',
  'Nyeri payudara',
  'Mood swing',
  'Jerawat',
  'Nafsu makan meningkat',
  'Insomnia',
  'Nyeri punggung',
];

const STORAGE_KEY = 'femmefit_health';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveHealthState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const defaultState = {
  logs: {}, // { 'YYYY-MM-DD': { id, mood, symptoms[], note, updatedAt } }
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
    SET_LOG(state, { date, mood, symptoms, note }) {
      state.logs[date] = {
        id: state.logs[date]?.id || genId(),
        mood: mood || null,
        symptoms: symptoms || [],
        note: note || '',
        updatedAt: Date.now(),
      };
    },
    REMOVE_LOG(state, date) {
      delete state.logs[date];
    },
    RESET(state) {
      state.logs = {};
    },
  },
  actions: {
    saveLog({ commit }, { date, mood, symptoms, note }) {
      commit('SET_LOG', { date, mood, symptoms, note });
    },
    removeLog({ commit }, date) {
      commit('REMOVE_LOG', date);
    },
    resetHealth({ commit }) {
      commit('RESET');
    },
  },
  getters: {
    getLog: (state) => (date) => state.logs[date] || null,
    hasLogToday: (state) => (date) => !!state.logs[date],
    recentLogs: (state) => {
      return Object.entries(state.logs)
        .map(([date, val]) => ({ date, ...val }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30);
    },
    logCount: (state) => Object.keys(state.logs).length,
  },
};
