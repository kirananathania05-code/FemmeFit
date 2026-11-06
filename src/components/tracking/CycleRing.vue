<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentDay: number | null;
  cycleLength: number | null;
  phase?: string;
}>();

const cl = computed(() => props.cycleLength || 28);
const day = computed(() => props.currentDay ?? 0);
const progress = computed(() => {
  if (cl.value <= 0) return 0;
  return Math.min((day.value / cl.value) * 100, 100);
});

const radius = 80;
const circumference = 2 * Math.PI * radius;
const strokeOffset = computed(() => circumference - (progress.value / 100) * circumference);

const arcColor = computed(() => {
  switch (props.phase) {
    case 'menstrual': return '#F94F8A';
    case 'follicular': return '#FBB85A';
    case 'ovulation': return '#34B57F';
    case 'luteal': return '#A78BFA';
    default: return '#FFA8C0';
  }
});
</script>

<template>
  <div class="cycle-ring">
    <svg viewBox="0 0 200 200" class="cycle-ring__svg">
      <circle
        cx="100" cy="100" :r="radius"
        fill="none"
        stroke="var(--neutral-200)"
        stroke-width="14"
      />
      <circle
        cx="100" cy="100" :r="radius"
        fill="none"
        :stroke="arcColor"
        stroke-width="14"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeOffset"
        transform="rotate(-90 100 100)"
        class="cycle-ring__arc"
      />
    </svg>
    <div class="cycle-ring__center">
      <div class="cycle-ring__day">{{ day || '–' }}</div>
      <div class="cycle-ring__label">dari {{ cl }} hari</div>
    </div>
  </div>
</template>

<style scoped>
.cycle-ring {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}

.cycle-ring__svg {
  width: 100%;
  height: 100%;
}

.cycle-ring__arc {
  transition: stroke-dashoffset var(--t-slow), stroke var(--t-normal);
}

.cycle-ring__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cycle-ring__day {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-strong);
  line-height: 1;
}

.cycle-ring__label {
  font-size: 0.8rem;
  color: var(--neutral-500);
  margin-top: 4px;
}
</style>
