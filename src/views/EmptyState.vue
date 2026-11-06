<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
}>();

const emit = defineEmits<{ (e: 'action'): void }>();
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">{{ icon || '🌸' }}</div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__message" v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--sp-7) var(--sp-4);
  gap: var(--sp-2);
}

.empty-state__icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
  margin-bottom: var(--sp-2);
}

.empty-state__title {
  font-size: 1.25rem;
  color: var(--text-strong);
}

.empty-state__message {
  font-size: 0.9rem;
  color: var(--neutral-500);
  max-width: 320px;
  line-height: 1.5;
}
</style>
