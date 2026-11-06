<script setup lang="ts">
import { computed } from 'vue';
import { formatDate, isToday } from '../../utils/dateUtils.js';
import { isPeriodDay } from '../../utils/cycleUtils.js';

const props = defineProps<{
  date: Date;
  entries: Array<{ startDate: string; endDate: string | null }>;
}>();

const dateStr = computed(() => formatDate(props.date));
const inPeriod = computed(() => isPeriodDay(dateStr.value, props.entries));
const today = computed(() => isToday(dateStr.value));
</script>

<template>
  <div
    class="cal-day"
    :class="{
      'cal-day--period': inPeriod,
      'cal-day--today': today,
    }"
  >
    {{ date.getDate() }}
  </div>
</template>

<style scoped>
.cal-day {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--neutral-600);
  transition: all var(--t-fast);
  cursor: default;
}

.cal-day--period {
  background: var(--primary-200);
  color: var(--primary-700);
  font-weight: 700;
}

.cal-day--today {
  border: 2px solid var(--primary-400);
  color: var(--primary-600);
}
.cal-day--today.cal-day--period {
  border-color: var(--primary-500);
  background: var(--primary-300);
  color: white;
}
</style>
