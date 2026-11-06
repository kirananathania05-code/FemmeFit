<script setup lang="ts">
import { computed } from 'vue';

interface HistoryItem {
  label: string;
  cycleLength: number | null;
  periodLength: number | null;
}

const props = defineProps<{
  history: HistoryItem[];
}>();

const chartWidth = 280;
const chartHeight = 160;
const padding = 24;
const barGap = 8;
const maxBars = 6;

const visibleData = computed(() => props.history.slice(-maxBars));

const maxCycle = computed(() => {
  const vals = visibleData.value.map((d) => d.cycleLength || 0).filter((v) => v > 0);
  return vals.length ? Math.max(...vals, 35) : 35;
});

const barCount = computed(() => visibleData.value.length);
const barWidth = computed(() => {
  if (barCount.value === 0) return 30;
  return Math.max(16, (chartWidth - padding * 2 - barGap * (barCount.value - 1)) / barCount.value);
});

function barHeight(val: number | null) {
  if (!val) return 0;
  return ((val / maxCycle.value) * (chartHeight - padding * 2));
}

function barY(val: number | null) {
  return chartHeight - padding - barHeight(val);
}

function barX(index: number) {
  return padding + index * (barWidth.value + barGap);
}

const gridLines = computed(() => {
  const lines = [];
  for (let i = 0; i <= 4; i++) {
    const y = padding + ((chartHeight - padding * 2) / 4) * i;
    const val = Math.round(maxCycle.value - (maxCycle.value / 4) * i);
    lines.push({ y, val });
  }
  return lines;
});
</script>

<template>
  <div class="cycle-chart">
    <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="cycle-chart__svg" v-if="barCount > 0">
      <!-- grid lines -->
      <g class="cycle-chart__grid">
        <line
          v-for="g in gridLines"
          :key="g.y"
          :x1="padding" :x2="chartWidth - padding"
          :y1="g.y" :y2="g.y"
          stroke="var(--neutral-200)"
          stroke-dasharray="3,3"
        />
        <text :x="4" :y="g.y + 3" font-size="8" fill="var(--neutral-400)" v-for="g in gridLines" :key="'t' + g.y">
          {{ g.val }}
        </text>
      </g>

      <!-- bars: cycle length -->
      <g class="cycle-chart__bars">
        <rect
          v-for="(d, i) in visibleData"
          :key="d.label"
          :x="barX(i)"
          :y="barY(d.cycleLength)"
          :width="barWidth"
          :height="barHeight(d.cycleLength)"
          :rx="4"
          :fill="d.cycleLength ? 'var(--primary-300)' : 'transparent'"
          class="cycle-chart__bar"
        >
          <title>{{ d.label }}: {{ d.cycleLength || '—' }} hari</title>
        </rect>
      </g>

      <!-- bar labels -->
      <g class="cycle-chart__labels">
        <text
          v-for="(d, i) in visibleData"
          :key="'l' + i"
          :x="barX(i) + barWidth / 2"
          :y="chartHeight - 8"
          text-anchor="middle"
          font-size="7"
          fill="var(--neutral-500)"
        >{{ d.label.replace('Siklus ', 'S') }}</text>
      </g>
    </svg>

    <div class="cycle-chart__empty" v-else>
      <span class="cycle-chart__empty-icon">📊</span>
      <p>Belum ada data siklus untuk ditampilkan</p>
      <p class="cycle-chart__hint">Catat minimal 2 periode haid untuk melihat grafik</p>
    </div>

    <div class="cycle-chart__legend" v-if="barCount > 0">
      <div class="cycle-chart__legend-item">
        <span class="cycle-chart__legend-bar"></span>
        <span>Panjang siklus (hari)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cycle-chart {
  width: 100%;
}
.cycle-chart__svg {
  width: 100%;
  height: auto;
}
.cycle-chart__bar {
  transition: opacity var(--t-fast);
}
.cycle-chart__bar:hover { opacity: 0.8; }

.cycle-chart__empty {
  text-align: center;
  padding: var(--sp-6);
  color: var(--neutral-500);
}
.cycle-chart__empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--sp-2);
}
.cycle-chart__hint {
  font-size: 0.8rem;
  margin-top: var(--sp-1);
}

.cycle-chart__legend {
  display: flex;
  justify-content: center;
  margin-top: var(--sp-2);
}
.cycle-chart__legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--neutral-500);
}
.cycle-chart__legend-bar {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--primary-300);
}
</style>
