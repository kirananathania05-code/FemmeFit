<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '../common/BaseButton.vue';
import { WEEKDAYS_LONG } from '../../utils/dateUtils.js';

const store = useStore();

const enabled = computed(() => store.state.reminder.enabled);
const days = computed(() => [...store.state.reminder.days]);
const time = computed(() => store.state.reminder.time);
const maxRepeat = computed(() => store.state.reminder.maxRepeat);

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

function toggleDay(day: string) {
  let next: string[];
  if (days.value.includes(day)) {
    next = days.value.filter((d) => d !== day);
  } else {
    next = [...days.value, day];
  }
  store.dispatch('reminder/setDays', next);
}

function toggleEnabled() {
  store.dispatch('reminder/toggleEnabled', !enabled.value);
}

function saveTime(val: string) {
  store.dispatch('reminder/setTime', val);
}

function saveMaxRepeat(val: number) {
  store.dispatch('reminder/setMaxRepeat', val);
}

function save() {
  if (!enabled.value && days.value.length === 0) {
    store.dispatch('reminder/toggleEnabled', true);
  }
  emit('saved');
}
</script>

<template>
  <div class="reminder-settings">
    <div class="reminder-settings__toggle">
      <div>
        <div class="reminder-settings__toggle-label">Aktifkan pengingat TTD</div>
        <div class="reminder-settings__toggle-hint">Notifikasi muncul saat website aktif</div>
      </div>
      <button
        class="toggle-switch"
        :class="{ 'toggle-switch--on': enabled }"
        @click="toggleEnabled"
        role="switch"
        :aria-checked="enabled"
      >
        <span class="toggle-knob"></span>
      </button>
    </div>

    <div class="reminder-settings__section" v-if="enabled">
      <label class="form-label">Pilih hari pengingat</label>
      <div class="day-grid">
        <button
          v-for="day in WEEKDAYS_LONG"
          :key="day"
          class="day-btn"
          :class="{ 'day-btn--active': days.includes(day) }"
          @click="toggleDay(day)"
        >{{ day.slice(0, 3) }}</button>
      </div>
    </div>

    <div class="reminder-settings__section" v-if="enabled">
      <label class="form-label" for="reminder-time">Jam pengingat</label>
      <input
        id="reminder-time"
        type="time"
        :value="time"
        @input="saveTime(($event.target as HTMLInputElement).value)"
        class="form-input"
      />
    </div>

    <div class="reminder-settings__section" v-if="enabled">
      <label class="form-label">Maksimal pengulangan: {{ maxRepeat }}×</label>
      <div class="repeat-options">
        <button
          v-for="n in 3"
          :key="n"
          class="repeat-btn"
          :class="{ 'repeat-btn--active': maxRepeat === n }"
          @click="saveMaxRepeat(n)"
        >{{ n }}×</button>
      </div>
      <p class="reminder-settings__hint">
        Pengingat tidak akan berulang lebih dari batas ini untuk menghindari gangguan.
      </p>
    </div>

    <BaseButton variant="primary" block rounded @click="save" v-if="enabled">
      Simpan Pengaturan
    </BaseButton>
  </div>
</template>

<style scoped>
.reminder-settings {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.reminder-settings__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--primary-50);
}

.reminder-settings__toggle-label {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text-strong);
}

.reminder-settings__toggle-hint {
  font-size: 0.78rem;
  color: var(--neutral-500);
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--neutral-300);
  transition: background var(--t-fast);
  flex-shrink: 0;
}
.toggle-switch--on { background: var(--primary-400); }

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  background: white;
  box-shadow: var(--shadow-xs);
  transition: transform var(--t-normal);
}
.toggle-switch--on .toggle-knob { transform: translateX(22px); }

.reminder-settings__section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.form-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--neutral-700);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--text-strong);
  background: var(--neutral-0);
  transition: border-color var(--t-fast);
}
.form-input:focus {
  outline: none;
  border-color: var(--primary-300);
}

.day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.day-btn {
  padding: 8px 4px;
  border-radius: var(--radius-sm);
  background: var(--neutral-100);
  color: var(--neutral-500);
  font-size: 0.75rem;
  font-weight: 700;
  transition: all var(--t-fast);
}
.day-btn--active {
  background: var(--primary-400);
  color: white;
}

.repeat-options {
  display: flex;
  gap: var(--sp-2);
}
.repeat-btn {
  flex: 1;
  padding: 8px;
  border-radius: var(--radius-md);
  background: var(--neutral-100);
  color: var(--neutral-500);
  font-weight: 700;
  transition: all var(--t-fast);
}
.repeat-btn--active {
  background: var(--primary-400);
  color: white;
}

.reminder-settings__hint {
  font-size: 0.75rem;
  color: var(--neutral-400);
  line-height: 1.4;
}
</style>
