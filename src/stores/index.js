import { createStore } from 'vuex';

import user, { saveUserState } from './userStore.js';
import period, { savePeriodState } from './periodStore.js';
import reminder, { saveReminderState } from './reminderStore.js';
import health, { saveHealthState } from './healthStore.js';

export default createStore({
  modules: {
    user,
    period,
    reminder,
    health,
  },
  strict: false,
  plugins: [
    (store) => {
      store.subscribe((mutation, state) => {
        const ns = mutation.type.split('/')[0];
        if (ns === 'user') saveUserState(state.user);
        else if (ns === 'period') savePeriodState(state.period);
        else if (ns === 'reminder') saveReminderState(state.reminder);
        else if (ns === 'health') saveHealthState(state.health);
      });
    },
  ],
});
