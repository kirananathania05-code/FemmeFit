<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
}>(), {
  title: '',
  size: 'md',
  closable: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

function close() {
  if (props.closable) {
    emit('update:modelValue', false);
    emit('close');
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

watch(() => props.modelValue, (val) => {
  if (val) {
    document.addEventListener('keydown', onKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  if (props.modelValue) {
    document.addEventListener('keydown', onKeydown);
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div :class="['modal-box', `modal-box--${size}`]" role="dialog" aria-modal="true">
          <div class="modal-header" v-if="title || closable">
            <h3 class="modal-title" v-if="title">{{ title }}</h3>
            <button v-if="closable" class="modal-close" @click="close" aria-label="Tutup">
              ✕
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-4);
  background: rgba(26, 26, 40, 0.4);
  backdrop-filter: blur(4px);
}

.modal-box {
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.modal-box--sm { max-width: 360px; }
.modal-box--md { max-width: 440px; }
.modal-box--lg { max-width: 600px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-5) var(--sp-5) var(--sp-3);
}

.modal-title {
  font-size: 1.25rem;
  color: var(--text-strong);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  color: var(--neutral-500);
  font-size: 1rem;
  background: var(--neutral-100);
  transition: all var(--t-fast);
}
.modal-close:hover {
  background: var(--neutral-200);
  color: var(--neutral-700);
  transform: rotate(90deg);
}

.modal-body {
  padding: 0 var(--sp-5) var(--sp-5);
}

.modal-footer {
  display: flex;
  gap: var(--sp-3);
  padding: 0 var(--sp-5) var(--sp-5);
  justify-content: flex-end;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity var(--t-normal);
}
.modal-enter-active .modal-box, .modal-leave-active .modal-box {
  transition: transform var(--t-normal), opacity var(--t-normal);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-box, .modal-leave-to .modal-box {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}
</style>
