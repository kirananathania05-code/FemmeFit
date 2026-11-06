<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import {
  WEEKDAYS_SHORT,
  MONTHS,
  buildMonthGrid,
  formatDate,
} from '../../utils/dateUtils.js';
import BaseButton from '../common/BaseButton.vue';
import Modal from '../common/Modal.vue';
import CalendarDay from './CalendarDay.vue';

const store = useStore();
const entries = computed(() => store.state.period.entries);

const currentView = ref(new Date());
const viewYear = computed(() => currentView.value.getFullYear());
const viewMonth = computed(() => currentView.value.getMonth());
const monthLabel = computed(() => `${MONTHS[viewMonth.value]} ${viewYear.value}`);
const grid = computed(() => buildMonthGrid(viewYear.value, viewMonth.value));

const isCurrentMonth = (date: Date) =>
  date.getMonth() === viewMonth.value && date.getFullYear() === viewYear.value;

function prevMonth() {
  currentView.value = new Date(viewYear.value, viewMonth.value - 1, 1);
}
function nextMonth() {
  currentView.value = new Date(viewYear.value, viewMonth.value + 1, 1);
}
function goToday() {
  currentView.value = new Date();
}

// Add period modal
const showAddModal = ref(false);
const newStart = ref('');
const newEnd = ref('');

function openAddModal() {
  newStart.value = formatDate(new Date());
  newEnd.value = '';
  showAddModal.value = true;
}

function savePeriod() {
  if (!newStart.value) return;
  store.dispatch('period/addPeriod', {
    startDate: newStart.value,
    endDate: newEnd.value || null,
    note: '',
  });
  showAddModal.value = false;
}
</script>

<template>
  <div class="period-calendar">
    <div class="cal-toolbar">
      <button class="cal-nav-btn" @click="prevMonth" aria-label="Bulan sebelumnya">‹</button>
      <div class="cal-month-label">{{ monthLabel }}</div>
      <button class="cal-nav-btn" @click="nextMonth" aria-label="Bulan berikutnya">›</button>
    </div>

    <div class="cal-weekdays">
      <div v-for="d in WEEKDAYS_SHORT" :key="d" class="cal-weekday">{{ d }}</div>
    </div>

    <div class="cal-grid">
      <div
        v-for="(date, i) in grid"
        :key="i"
        class="cal-cell"
        :class="{ 'cal-cell--outside': !isCurrentMonth(date) }"
      >
        <CalendarDay :date="date" :entries="entries" />
      </div>
    </div>

    <div class="cal-actions">
      <BaseButton variant="primary" rounded @click="openAddModal">
        + Catat Haid
      </BaseButton>
      <BaseButton variant="ghost" size="sm" @click="goToday">Hari ini</BaseButton>
    </div>

    <div class="cal-legend">
      <div class="cal-legend-item">
        <span class="cal-legend-dot cal-legend-dot--period"></span>
        <span>Haid</span>
      </div>
      <div class="cal-legend-item">
        <span class="cal-legend-dot cal-legend-dot--today"></span>
        <span>Hari ini</span>
      </div>
    </div>

    <Modal v-model="showAddModal" title="Catat Periode Haid" size="sm">
      <div class="form-group">
        <label class="form-label">Tanggal Mulai</label>
        <input type="date" v-model="newStart" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal Selesai (opsional)</label>
        <input type="date" v-model="newEnd" class="form-input" :min="newStart" />
      </div>
      <template #footer>
        <BaseButton variant="ghost" @click="showAddModal = false">Batal</BaseButton>
        <BaseButton variant="primary" @click="savePeriod">Simpan</BaseButton>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.period-calendar {
  width: 100%;
}

.cal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
}

.cal-month-label {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-strong);
}

.cal-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-50);
  color: var(--primary-500);
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--t-fast);
}
.cal-nav-btn:hover {
  background: var(--primary-100);
  transform: scale(1.1);
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: var(--sp-2);
}
.cal-weekday {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--neutral-400);
  text-transform: uppercase;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-cell--outside {
  opacity: 0.3;
}

.cal-actions {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
  margin-top: var(--sp-4);
}

.cal-legend {
  display: flex;
  gap: var(--sp-4);
  margin-top: var(--sp-3);
}
.cal-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--neutral-500);
}
.cal-legend-dot {
  width: 14px;
  height: 14px;
  border-radius: var(--radius-sm);
}
.cal-legend-dot--period { background: var(--primary-200); }
.cal-legend-dot--today { background: transparent; border: 2px solid var(--primary-400); }

.form-group {
  margin-bottom: var(--sp-4);
}
.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--neutral-700);
  margin-bottom: var(--sp-1);
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
</style>
