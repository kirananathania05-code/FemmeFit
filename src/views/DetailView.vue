<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import BaseCard from '../components/common/BaseCard.vue';
import BaseButton from '../components/common/BaseButton.vue';
import Modal from '../components/common/Modal.vue';
import EmptyState from './EmptyState.vue';

import PeriodCalendar from '../components/calendar/PeriodCalendar.vue';
import CycleRing from '../components/tracking/CycleRing.vue';
import CycleChart from '../components/tracking/CycleChart.vue';
import CycleSummary from '../components/tracking/CycleSummary.vue';
import ReminderCard from '../components/reminder/ReminderCard.vue';
import ReminderSettings from '../components/reminder/ReminderSettings.vue';
import NutritionBanner from '../components/nutrition/NutritionBanner.vue';
import NutritionCard from '../components/nutrition/NutritionCard.vue';
import MoodSelector from '../components/symptoms/MoodSelector.vue';
import SymptomForm from '../components/symptoms/SymptomForm.vue';

import { nutritionData, nutritionCategories } from '../data/nutritionData.js';
import { MOODS, SYMPTOMS } from '../stores/healthStore.js';
import { todayStr, prettyDate } from '../utils/dateUtils.js';

const props = defineProps<{ slug?: string }>();
const store = useStore();
const router = useRouter();

const slugMeta: Record<string, { title: string; icon: string; desc: string }> = {
  'cycle-tracking': { title: 'Pantau Siklus', icon: '📅', desc: 'Kalender haid, riwayat, dan prediksi siklus' },
  'ttd-reminder': { title: 'Pengingat TTD', icon: '💊', desc: 'Atur dan konfirmasi konsumsi Tablet Tambah Darah' },
  'nutrition': { title: 'Edukasi Nutrisi', icon: '🥗', desc: 'Makanan kaya zat besi dan tips penyerapan' },
  'symptom-log': { title: 'Catatan Harian', icon: '📝', desc: 'Catat mood, gejala, dan pengalaman harian' },
};

const meta = computed(() => slugMeta[props.slug || ''] || null);

const hasProfile = computed(() => store.getters['user/hasProfile']);

// --- Cycle tracking ---
const entries = computed(() => store.getters['period/sortedEntries']);
const currentDay = computed(() => store.getters['period/currentDay']);
const avgCycle = computed(() => store.getters['period/avgCycleLength']);
const cycleHistory = computed(() => store.getters['period/cycleHistory']);

const showDeleteModal = ref(false);
const entryToDelete = ref<string | null>(null);

function askDelete(id: string) {
  entryToDelete.value = id;
  showDeleteModal.value = true;
}
function confirmDelete() {
  if (entryToDelete.value) {
    store.dispatch('period/removePeriod', entryToDelete.value);
  }
  showDeleteModal.value = false;
  entryToDelete.value = null;
}

// --- Nutrition ---
const activeCategory = ref('Semua');
const filteredNutrition = computed(() => {
  if (activeCategory.value === 'Semua') return nutritionData;
  return nutritionData.filter((f) => f.category === activeCategory.value);
});

// --- Symptom log ---
const selectedMood = ref<string | null>(null);
const selectedSymptoms = ref<string[]>([]);
const note = ref('');
const savedToast = ref(false);

const today = todayStr();
const existingLog = computed(() => store.getters['health/getLog'](today));

watch(existingLog, (log) => {
  if (log) {
    selectedMood.value = log.mood;
    selectedSymptoms.value = [...log.symptoms];
    note.value = log.note;
  }
}, { immediate: true });

const recentLogs = computed(() => store.getters['health/recentLogs']);

function saveSymptomLog() {
  store.dispatch('health/saveLog', {
    date: today,
    mood: selectedMood.value,
    symptoms: selectedSymptoms.value,
    note: note.value,
  });
  savedToast.value = true;
  setTimeout(() => { savedToast.value = false; }, 2000);
}

function getMoodInfo(moodId: string | null) {
  if (!moodId) return null;
  return MOODS.find((m) => m.id === moodId) || null;
}

function formatDateLabel(dateStr: string) {
  return prettyDate(dateStr);
}

function goBack() {
  router.push('/');
}
</script>

<template>
  <div class="detail">
    <!-- Unknown slug -->
    <EmptyState
      v-if="!meta"
      icon="🤔"
      title="Fitur tidak ditemukan"
      message="Fitur yang kamu cari belum tersedia."
    >
      <BaseButton variant="primary" rounded @click="goBack">Kembali ke Beranda</BaseButton>
    </EmptyState>

    <template v-else>
      <!-- Header -->
      <div class="detail__header animate-fadeIn">
        <button class="detail__back" @click="goBack" aria-label="Kembali">‹</button>
        <span class="detail__icon">{{ meta.icon }}</span>
        <div>
          <h1 class="detail__title">{{ meta.title }}</h1>
          <p class="detail__desc">{{ meta.desc }}</p>
        </div>
      </div>

      <!-- Onboarding prompt -->
      <BaseCard v-if="!hasProfile" variant="primary" :padding="'md'">
        <div class="detail__onboard">
          <span class="detail__onboard-icon">🌸</span>
          <p>Lengkapi profilmu dulu untuk mulai menggunakan fitur ini.</p>
          <BaseButton variant="primary" rounded @click="router.push('/explore')">Isi Profil</BaseButton>
        </div>
      </BaseCard>

      <!-- CYCLE TRACKING -->
      <template v-if="slug === 'cycle-tracking' && hasProfile">
        <BaseCard variant="default" :padding="'lg'" class="animate-fadeIn">
          <h3 class="detail__section-title">Kalender Haid</h3>
          <PeriodCalendar />
        </BaseCard>

        <BaseCard variant="primary" :padding="'lg'" class="animate-fadeIn" v-if="entries.length > 0">
          <h3 class="detail__section-title">Ringkasan Siklus</h3>
          <div class="detail__cycle-ring">
            <CycleRing :current-day="currentDay" :cycle-length="avgCycle" />
          </div>
          <CycleSummary />
        </BaseCard>

        <BaseCard variant="default" :padding="'lg'" class="animate-fadeIn" v-if="entries.length > 0">
          <h3 class="detail__section-title">Grafik Siklus</h3>
          <CycleChart :history="cycleHistory" />
        </BaseCard>

        <BaseCard variant="default" :padding="'lg'" class="animate-fadeIn" v-if="entries.length > 0">
          <h3 class="detail__section-title">Riwayat Haid</h3>
          <div class="detail__history">
            <div v-for="entry in entries" :key="entry.id" class="detail__history-item">
              <div class="detail__history-info">
                <span class="detail__history-date">{{ prettyDate(entry.startDate) }}</span>
                <span class="detail__history-dash" v-if="entry.endDate">—</span>
                <span class="detail__history-date" v-if="entry.endDate">{{ prettyDate(entry.endDate) }}</span>
                <span class="detail__history-ongoing" v-else>berlangsung</span>
              </div>
              <button class="detail__delete-btn" @click="askDelete(entry.id)" aria-label="Hapus">🗑️</button>
            </div>
          </div>
        </BaseCard>

        <EmptyState
          v-if="entries.length === 0"
          icon="🌿"
          title="Belum ada data haid"
          message="Gunakan kalender di atas untuk mencatat tanggal mulai dan selesai haid."
        />

        <Modal v-model="showDeleteModal" title="Hapus periode ini?" size="sm">
          <p class="detail__modal-text">Data periode haid ini akan dihapus permanen.</p>
          <template #footer>
            <BaseButton variant="ghost" @click="showDeleteModal = false">Batal</BaseButton>
            <BaseButton variant="danger" @click="confirmDelete">Hapus</BaseButton>
          </template>
        </Modal>
      </template>

      <!-- TTD REMINDER -->
      <template v-if="slug === 'ttd-reminder' && hasProfile">
        <BaseCard variant="primary" :padding="'lg'" class="animate-fadeIn">
          <ReminderCard />
        </BaseCard>

        <BaseCard variant="default" :padding="'lg'" class="animate-fadeIn">
          <h3 class="detail__section-title">Pengaturan Pengingat</h3>
          <ReminderSettings />
        </BaseCard>

        <BaseCard variant="soft" :padding="'md'" class="animate-fadeIn">
          <h4 class="detail__notice-title">ℹ️ Tentang Pengingat</h4>
          <p class="detail__notice-text">
            FemmeFit menampilkan pengingat saat website aktif. Notifikasi muncul pada hari dan jam yang dipilih,
            dengan batas pengulangan maksimal sesuai pengaturan. Untuk notifikasi saat browser ditutup,
            diperlukan layanan web push dengan backend.
          </p>
        </BaseCard>
      </template>

      <!-- NUTRITION -->
      <template v-if="slug === 'nutrition' && hasProfile">
        <NutritionBanner class="animate-fadeIn" />

        <div class="detail__filter animate-fadeIn">
          <button
            v-for="cat in nutritionCategories"
            :key="cat"
            class="detail__filter-btn"
            :class="{ 'detail__filter-btn--active': activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <div class="detail__nutrition-grid animate-fadeIn">
          <NutritionCard v-for="food in filteredNutrition" :key="food.id" :food="food" />
        </div>

        <BaseCard variant="soft" :padding="'md'" class="animate-fadeIn">
          <h4 class="detail__notice-title">⚠️ Catatan Penting</h4>
          <p class="detail__notice-text">
            Kandungan zat besi adalah perkiraan per 100 gram. Konsultasikan kebutuhan nutrisi spesifik
            dengan tenaga kesehatan. Tablet Tambah Darah melengkapi, bukan menggantikan, makanan bergizi.
          </p>
        </BaseCard>
      </template>

      <!-- SYMPTOM LOG -->
      <template v-if="slug === 'symptom-log' && hasProfile">
        <BaseCard variant="default" :padding="'lg'" class="animate-fadeIn">
          <h3 class="detail__section-title">Catat Hari Ini · {{ prettyDate(today) }}</h3>

          <div class="detail__mood-section">
            <MoodSelector v-model="selectedMood" />
          </div>

          <SymptomForm
            :symptoms="selectedSymptoms"
            :note="note"
            @update:symptoms="selectedSymptoms = $event"
            @update:note="note = $event"
            @submit="saveSymptomLog"
          />
        </BaseCard>

        <BaseCard variant="soft" :padding="'md'" class="animate-fadeIn">
          <h4 class="detail__notice-title">⚠️ Edukasi, Bukan Diagnosis</h4>
          <p class="detail__notice-text">
            Gejala seperti lemas atau pusing tidak cukup untuk mendiagnosis anemia. Diagnosis memerlukan
            pemeriksaan hemoglobin (Hb) oleh tenaga kesehatan. FemmeFit hanya membantu mencatat dan mengedukasi.
          </p>
        </BaseCard>

        <BaseCard variant="default" :padding="'lg'" class="animate-fadeIn" v-if="recentLogs.length > 0">
          <h3 class="detail__section-title">Riwayat Catatan</h3>
          <div class="detail__logs">
            <div v-for="log in recentLogs.slice(0, 10)" :key="log.id" class="detail__log-item">
              <span class="detail__log-date">{{ formatDateLabel(log.date) }}</span>
              <span class="detail__log-mood" v-if="getMoodInfo(log.mood)">
                {{ getMoodInfo(log.mood)?.emoji }} {{ getMoodInfo(log.mood)?.label }}
              </span>
              <span class="detail__log-symptoms" v-if="log.symptoms.length > 0">
                {{ log.symptoms.length }} gejala
              </span>
              <span class="detail__log-note" v-if="log.note">· {{ log.note.slice(0, 30) }}{{ log.note.length > 30 ? '…' : '' }}</span>
            </div>
          </div>
        </BaseCard>
      </template>

      <!-- Save toast -->
      <Transition name="fade">
        <div v-if="savedToast" class="detail__toast">
          ✅ Catatan tersimpan!
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
.detail {
  padding: var(--sp-4) 0 var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.detail__header {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.detail__back {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--primary-50);
  color: var(--primary-500);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--t-fast);
  flex-shrink: 0;
}
.detail__back:hover {
  background: var(--primary-100);
  transform: scale(1.1);
}
.detail__icon {
  font-size: 1.8rem;
}
.detail__title {
  font-size: 1.4rem;
  color: var(--text-strong);
}
.detail__desc {
  font-size: 0.82rem;
  color: var(--neutral-500);
}

.detail__onboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  text-align: center;
}
.detail__onboard-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}
.detail__onboard p {
  font-size: 0.88rem;
  color: var(--neutral-500);
}

.detail__section-title {
  font-size: 1.1rem;
  margin-bottom: var(--sp-4);
  color: var(--text-strong);
}

.detail__cycle-ring {
  display: flex;
  justify-content: center;
  margin-bottom: var(--sp-4);
}

.detail__history {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.detail__history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--primary-50);
  border: 1px solid var(--primary-100);
}
.detail__history-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  color: var(--neutral-700);
  font-weight: 600;
}
.detail__history-dash { color: var(--neutral-400); }
.detail__history-ongoing {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--primary-200);
  color: var(--primary-700);
}
.detail__delete-btn {
  font-size: 1rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--t-fast);
  opacity: 0.6;
}
.detail__delete-btn:hover {
  opacity: 1;
  background: var(--error-50);
}

.detail__modal-text {
  font-size: 0.88rem;
  color: var(--neutral-600);
  line-height: 1.5;
}

.detail__filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.detail__filter-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--neutral-100);
  color: var(--neutral-500);
  font-size: 0.8rem;
  font-weight: 600;
  transition: all var(--t-fast);
}
.detail__filter-btn--active {
  background: var(--primary-400);
  color: white;
}

.detail__nutrition-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
@media (min-width: 640px) {
  .detail__nutrition-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.detail__notice-title {
  font-size: 1rem;
  margin-bottom: var(--sp-2);
}
.detail__notice-text {
  font-size: 0.82rem;
  color: var(--neutral-600);
  line-height: 1.5;
}

.detail__mood-section {
  margin-bottom: var(--sp-5);
}

.detail__logs {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.detail__log-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--neutral-50);
  font-size: 0.82rem;
  color: var(--neutral-600);
  flex-wrap: wrap;
}
.detail__log-date {
  font-weight: 700;
  color: var(--text-strong);
}
.detail__log-mood {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 600;
}
.detail__log-symptoms {
  font-size: 0.75rem;
  color: var(--neutral-400);
}
.detail__log-note {
  font-size: 0.75rem;
  color: var(--neutral-500);
}

.detail__toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-400);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: var(--shadow-lg);
  z-index: 999;
}
</style>
