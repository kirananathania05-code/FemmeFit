<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'soft';
type Size = 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  variant?: Variant;
  size?: Size;
  block?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  rounded: false,
  disabled: false,
  type: 'button',
});

const classes = computed(() => [
  'base-btn',
  `base-btn--${props.variant}`,
  `base-btn--${props.size}`,
  {
    'base-btn--block': props.block,
    'base-btn--rounded': props.rounded,
    'base-btn--disabled': props.disabled,
  },
]);
</script>

<template>
  <button :class="classes" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-family: var(--font-body);
  font-weight: 700;
  border-radius: var(--radius-md);
  transition: all var(--t-fast);
  white-space: nowrap;
  user-select: none;
  border: 2px solid transparent;
  line-height: 1;
}

.base-btn:active { transform: scale(0.97); }

/* Variants */
.base-btn--primary {
  background: var(--primary-400);
  color: white;
  box-shadow: 0 2px 8px rgba(249, 79, 138, 0.3);
}
.base-btn--primary:hover {
  background: var(--primary-500);
  box-shadow: 0 4px 14px rgba(249, 79, 138, 0.4);
}

.base-btn--secondary {
  background: var(--secondary-200);
  color: var(--neutral-700);
}
.base-btn--secondary:hover {
  background: var(--secondary-300);
}

.base-btn--ghost {
  background: transparent;
  color: var(--primary-500);
  border-color: var(--primary-200);
}
.base-btn--ghost:hover {
  background: var(--primary-50);
  border-color: var(--primary-300);
}

.base-btn--success {
  background: var(--accent-300);
  color: white;
  box-shadow: 0 2px 8px rgba(52, 181, 127, 0.3);
}
.base-btn--success:hover {
  background: var(--accent-400);
}

.base-btn--danger {
  background: var(--error-100);
  color: var(--error-600);
  border-color: var(--error-200);
}
.base-btn--danger:hover {
  background: var(--error-200);
}

.base-btn--soft {
  background: var(--primary-50);
  color: var(--primary-600);
}
.base-btn--soft:hover {
  background: var(--primary-100);
}

/* Sizes */
.base-btn--sm {
  padding: 7px 14px;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
}
.base-btn--md {
  padding: 11px 22px;
  font-size: 0.95rem;
}
.base-btn--lg {
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: var(--radius-lg);
}

.base-btn--block { width: 100%; }
.base-btn--rounded { border-radius: var(--radius-full); padding-left: 24px; padding-right: 24px; }
.base-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
