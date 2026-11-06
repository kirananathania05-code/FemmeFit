<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { fullDate } from '../../utils/dateUtils.js';
import { PHASE_INFO, getPhase } from '../../utils/cycleUtils.js';

const store = useStore();

const avgCycle = computed(() => store.getters['period/avgCycleLength']);
const avgPeriod = computed(() => store.getters['period/avgPeriodLength']);
const nextStart = computed(() => store.getters['period/nextPredictedStart']);
const currentDay = computed(() => store.getters['period/currentDay']);
const latest = computed(() => store.getters['period/latestEntry']);
const entryCount = computed(() => store.getters['period/entryCount']);

const phase = computed(() => {
  if (!latest.value) return null;
  return getPhase(new Date().toISOString().slice(0, 10), latest.value.startDate, avgCycle.value || 28);
});

const phaseInfo = computed(() => (phase.value ? PHASE_INFO[phase.value] : null));

const daysUntilNext = computed(() => {
  if (!nextStart.value) return null;
  const today = new Date();
  const next = new Date(nextStart.value);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
});

const nextStartLabel = computed(() => {
  if (!nextStart.value) return 'Belum ada prediksi';
  return fullDate(nextStart.value);
});

const summaryItems = computed(() => [
  {
    label: 'Rata-rata siklus',
    value: avgCycle.value ? `${avgCycle.value} hari` : '—',
    icon: '🔄',
  },
  {
    label: 'Rata-rata durasi',
    value: avgPeriod.value ? `${avgPeriod.value} hari` : '—',
    icon: '⏱️',
  },
  {
    label: 'Periode tercatat',
    value: `${entryCount.value}×`,
    icon: '📋',
  },
  {
    label: 'Prediksi haid berikutnya',
    value: nextStartLabel.value,
    icon: '📅',
    small: true,
  },
]);
</script>

<template>
  <div class="cycle-summary">
    <div class="cycle-summary__phase" v-if="phaseInfo">
      <span class="cycle-summary__phase-icon" :style="{ background: phaseInfo.color + '22' }">
        {{ phaseInfo.icon }}
      </span>
      <div>
        <div class="cycle-summary__phase-label" :style="{ color: phaseInfo.color }">
          Fase {{ phaseInfo.label }}
        </div>
        <div class="cycle-summary__phase-desc">{{ phaseInfo.desc }}</div>
      </div>
    </div>

    <div class="cycle-summary__grid">
      <div v-for="item in summaryItems" :key="item.label" class="cycle-summary__item">
        <span class="cycle-summary__icon">{{ item.icon }}</span>
        <div>
          <div class="cycle-summary__item-label">{{ item.label }}</div>
          <div
            class="cycle-summary__item-value"
            :class="{ 'cycle-summary__item-value--small': item.small }"
          >{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div class="cycle-summary__countdown" v-if="daysUntilNext !== null && daysUntilNext >= 0">
      <span class="cycle-summary__countdown-num">{{ daysUntilNext }}</span>
      <span class="cycle-summary__countdown-label">hari menuju haid berikutnya</span>
    </div>

    <p class="cycle-summary__disclaimer">
      ⚠️ Prediksi bersifat estimasi. Siklus bisa bervariasi, bukan diagnosis.
    </p>
  </div>
</template>

<style scoped>
.cycle-summary {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.cycle-summary__phase {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--neutral-50);
}

.cycle-summary__phase-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.cycle-summary__phase-label {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 2px;
}

.cycle-summary__phase-desc {
  font-size: 0.8rem;
  color: var(--neutral-500);
}

.cycle-summary__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}

.cycle-summary__item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--primary-50);
  border: 1px solid var(--primary-100);
}

.cycle-summary__icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.cycle-summary__item-label {
  font-size: 0.7rem;
  color: var(--neutral-500);
  font-weight: 600;
}

.cycle-summary__item-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-strong);
}
.cycle-summary__item-value--small {
  font-size: 0.85rem;
}

.cycle-summary__countdown {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--sp-2);
  padding: var(--sp-3);
  background: linear-gradient(135deg, var(--primary-100), var(--secondary-100));
  border-radius: var(--radius-md);
}

.cycle-summary__countdown-num {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-500);
}

.cycle-summary__countdown-label {
  font-size: 0.8rem;
  color: var(--neutral-600);
}

.cycle-summary__disclaimer {
  font-size: 0.72rem;
  color: var(--neutral-400);
  text-align: center;
  line-height: 1.4;
}
</style>
