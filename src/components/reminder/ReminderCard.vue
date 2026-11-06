<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { todayStr, prettyTime } from '../../utils/dateUtils.js';
import BaseButton from '../common/BaseButton.vue';

const store = useStore();

const enabled = computed(() => store.state.reminder.enabled);
const reminderTime = computed(() => store.state.reminder.time);
const days = computed(() => store.state.reminder.days);
const isConfirmed = computed(() => store.getters['reminder/isConfirmedToday'](todayStr()));
const confirmedThisMonth = computed(() => store.getters['reminder/totalConfirmedThisMonth']);

function confirm() {
  store.dispatch('reminder/confirmToday', todayStr());
}
</script>

<template>
  <div class="reminder-card" :class="{ 'reminder-card--active': enabled, 'reminder-card--done': isConfirmed }">
    <div class="reminder-card__head">
      <span class="reminder-card__icon">{{ isConfirmed ? '✅' : '💊' }}</span>
      <div class="reminder-card__title-area">
        <div class="reminder-card__title">Tablet Tambah Darah</div>
        <div class="reminder-card__status">
          <template v-if="!enabled">Pengingat nonaktif</template>
          <template v-else-if="isConfirmed">Sudah dikonfirmasi hari ini!</template>
          <template v-else>Menunggu konfirmasi</template>
        </div>
      </div>
    </div>

    <div class="reminder-card__info" v-if="enabled">
      <div class="reminder-card__time">
        <span class="reminder-card__time-icon">⏰</span>
        <span>{{ prettyTime(reminderTime) }}</span>
      </div>
      <div class="reminder-card__days" v-if="days.length > 0">
        <span
          v-for="d in days"
          :key="d"
          class="reminder-card__day-pill"
        >{{ d.slice(0, 3) }}</span>
      </div>
    </div>

    <BaseButton
      :variant="isConfirmed ? 'success' : 'primary'"
      :disabled="isConfirmed"
      block
      rounded
      @click="confirm"
    >
      {{ isConfirmed ? 'Sudah diminum!' : 'Konfirmasi Minum TTD' }}
    </BaseButton>

    <div class="reminder-card__streak" v-if="confirmedThisMonth > 0">
      🔥 {{ confirmedThisMonth }}× konfirmasi bulan ini
    </div>
  </div>
</template>

<style scoped>
.reminder-card {
  padding: var(--sp-5);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 2px solid var(--neutral-200);
  transition: all var(--t-normal);
}

.reminder-card--active {
  border-color: var(--primary-200);
  background: linear-gradient(135deg, var(--primary-50), var(--cream));
}

.reminder-card--done {
  border-color: var(--accent-200);
  background: linear-gradient(135deg, var(--accent-50), var(--cream));
}

.reminder-card__head {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

.reminder-card__icon {
  font-size: 2rem;
  animation: bounce-dot 2s ease-in-out infinite;
}
.reminder-card--done .reminder-card__icon {
  animation: none;
}

.reminder-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-strong);
}

.reminder-card__status {
  font-size: 0.82rem;
  color: var(--neutral-500);
}

.reminder-card__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-4);
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.reminder-card__time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: var(--primary-600);
}

.reminder-card__days {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.reminder-card__day-pill {
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--primary-100);
  color: var(--primary-600);
  font-size: 0.72rem;
  font-weight: 600;
}

.reminder-card__streak {
  text-align: center;
  margin-top: var(--sp-3);
  font-size: 0.82rem;
  color: var(--secondary-500);
  font-weight: 600;
}
</style>
