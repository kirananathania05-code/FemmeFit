<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'default' | 'primary' | 'accent' | 'soft' | 'outline';

const props = withDefaults(defineProps<{
  variant?: Variant;
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}>(), {
  variant: 'default',
  padding: 'md',
  hoverable: true,
});

const classes = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--p-${props.padding}`,
  { 'base-card--hoverable': props.hoverable },
]);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  transition: all var(--t-normal);
}

.base-card--primary {
  background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
  border-color: var(--primary-200);
}
.base-card--accent {
  background: linear-gradient(135deg, var(--accent-100) 0%, var(--accent-50) 100%);
  border-color: var(--accent-200);
}
.base-card--soft {
  background: var(--cream);
  border-color: var(--peach);
}
.base-card--outline {
  background: transparent;
  border: 2px solid var(--primary-200);
}

.base-card--p-sm { padding: var(--sp-3); }
.base-card--p-md { padding: var(--sp-5); }
.base-card--p-lg { padding: var(--sp-6); }

.base-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
</style>
