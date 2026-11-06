<script setup lang="ts">
import { MOODS } from '../../stores/healthStore.js';

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

function select(moodId: string) {
  emit('update:modelValue', moodId);
}
</script>

<template>
  <div class="mood-selector">
    <div class="mood-selector__label">Bagaimana perasaanmu hari ini?</div>
    <div class="mood-selector__grid">
      <button
        v-for="mood in MOODS"
        :key="mood.id"
        class="mood-btn"
        :class="{ 'mood-btn--active': modelValue === mood.id }"
        :style="{ '--mood-color': mood.color }"
        @click="select(mood.id)"
      >
        <span class="mood-btn__emoji">{{ mood.emoji }}</span>
        <span class="mood-btn__label">{{ mood.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mood-selector {
  width: 100%;
}

.mood-selector__label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--neutral-700);
  margin-bottom: var(--sp-3);
}

.mood-selector__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--sp-3) var(--sp-2);
  border-radius: var(--radius-md);
  background: var(--neutral-100);
  border: 2px solid transparent;
  transition: all var(--t-fast);
}

.mood-btn:hover {
  background: var(--neutral-200);
  transform: translateY(-2px);
}

.mood-btn--active {
  background: color-mix(in srgb, var(--mood-color) 15%, white);
  border-color: var(--mood-color);
  transform: scale(1.05);
}

.mood-btn__emoji {
  font-size: 1.8rem;
  transition: transform var(--t-fast);
}
.mood-btn--active .mood-btn__emoji {
  animation: popIn var(--t-slow);
}

.mood-btn__label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--neutral-600);
}
.mood-btn--active .mood-btn__label {
  color: var(--text-strong);
}

@media (min-width: 400px) {
  .mood-selector__grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
