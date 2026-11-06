const STORAGE_KEY = 'femmefit_user';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

const defaultState = {
  name: '',
  age: null,
  bloodType: '',
  bloodPressure: '',
  hasOnboarded: false,
};

const loaded = loadState();
const initial = loaded ? { ...defaultState, ...loaded } : { ...defaultState };

export default {
  namespaced: true,
  state: () => ({ ...initial }),
  mutations: {
    SET_PROFILE(state, profile) {
      state.name = profile.name ?? '';
      state.age = profile.age ?? null;
      state.bloodType = profile.bloodType ?? '';
      state.bloodPressure = profile.bloodPressure ?? '';
      state.hasOnboarded = true;
    },
    UPDATE_PROFILE(state, partial) {
      for (const [key, value] of Object.entries(partial)) {
        if (key in state) state[key] = value;
      }
    },
    COMPLETE_ONBOARDING(state) {
      state.hasOnboarded = true;
    },
    RESET(state) {
      Object.assign(state, { ...defaultState });
    },
  },
  actions: {
    saveProfile({ commit }, profile) {
      commit('SET_PROFILE', profile);
    },
    updateProfile({ commit }, partial) {
      commit('UPDATE_PROFILE', partial);
    },
    resetUser({ commit }) {
      commit('RESET');
    },
  },
  getters: {
    hasProfile: (state) => state.hasOnboarded && state.name.length > 0,
    displayName: (state) => state.name || 'Pengguna',
    userInitial: (state) => (state.name ? state.name.charAt(0).toUpperCase() : '?'),
    isMinor: (state) => state.age !== null && state.age < 18,
  },
};
