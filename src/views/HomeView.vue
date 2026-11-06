<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { todayStr, fullDate } from '../utils/dateUtils.js';
import { PHASE_INFO, getPhase } from '../utils/cycleUtils.js';
import { MOODS } from '../stores/healthStore.js';

import BaseCard from '../components/common/BaseCard.vue';
import BaseButton from '../components/common/BaseButton.vue';
import CycleRing from '../components/tracking/CycleRing.vue';
import CycleSummary from '../components/tracking/CycleSummary.vue';
import ReminderCard from '../components/reminder/ReminderCard.vue';
import EmptyState from './EmptyState.vue';

const store = useStore();
const router = useRouter();

const hasProfile = computed(() => store.getters['user/hasProfile']);
const displayName = computed(() => store.getters['user/displayName']);
const isMinor = computed(() => store.getters['user/isMinor']);

const hasPeriodData = computed(() => store.getters['period/entryCount'] > 0);
const currentDay = computed(() => store.getters['period/currentDay']);
const avgCycle = computed(() => store.getters['period/avgCycleLength']);
const latestEntry = computed(() => store.getters['period/latestEntry']);
const isOnPeriod = computed(() => store.getters['period/isOnPeriod']);

const phase = computed(() => {
  if (!latestEntry.value) return null;
  return getPhase(todayStr(), latestEntry.value.startDate, avgCycle.value || 28);
});
const phaseInfo = computed(() => (phase.value ? PHASE_INFO[phase.value] : null));

const todayLog = computed(() => store.getters['health/getLog'](todayStr()));
const todayMood = computed(() => {
  if (!todayLog.value?.mood) return null;
  return MOODS.find((m) => m.id === todayLog.value.mood) || null;
});

const today = fullDate(todayStr());

const featureCards = [
  { slug: 'cycle-tracking', icon: '📅', title: 'Pantau Siklus', desc: 'Kalender haid & prediksi', color: 'var(--primary-200)' },
  { slug: 'ttd-reminder', icon: '💊', title: 'Pengingat TTD', desc: 'Jaga konsistensi tablet', color: 'var(--secondary-200)' },
  { slug: 'nutrition', icon: '🥗', title: 'Edukasi Nutrisi', desc: 'Makanan kaya zat besi', color: 'var(--accent-200)' },
  { slug: 'symptom-log', icon: '📝', title: 'Catatan Harian', desc: 'Mood & gejala', color: 'var(--warning-200)' },
];

function goToDetail(slug: string) {
  router.push(`/explore/${slug}`);
}

function goToProfile() {
  router.push('/explore');
}
</script>

<template>
  <div class="home">
    <!-- Greeting -->
    <section class="home__greeting animate-fadeIn">
      <div class="home__date">{{ today }}</div>
      <h1 class="home__hello">Hai, {{ displayName }}! 👋</h1>
      <p class="home__sub" v-if="isOnPeriod">Sedang haid — jaga istirahat dan nutrisi ya 💕</p>
      <p class="home__sub" v-else-if="phaseInfo">Fase {{ phaseInfo.label }} — {{ phaseInfo.desc }}</p>
      <p class="home__sub" v-else>Selamat datang di FemmeFit 🌸</p>
    </section>

    <!-- Onboarding prompt -->
    <BaseCard v-if="!hasProfile" variant="primary" class="home__onboard animate-popIn">
      <div class="home__onboard-icon">🌸</div>
      <h2>Lengkapi profilmu dulu</h2>
      <p>Isi nama dan usia untuk mulai memantau kesehatan menstruasi.</p>
      <BaseButton variant="primary" rounded @click="goToProfile">Mulai Onboarding</BaseButton>
    </BaseCard>

    <!-- Cycle ring + summary -->
    <section v-if="hasProfile" class="home__cycle animate-fadeIn">
      <BaseCard variant="primary" :padding="'md'">
        <div class="home__cycle-head">
          <h3 class="home__section-title">Siklus Hari Ini</h3>
          <span class="home__phase-badge" v-if="phaseInfo" :style="{ background: phaseInfo.color + '22', color: phaseInfo.color }">
            {{ phaseInfo.icon }} {{ phaseInfo.label }}
          </span>
        </div>
        <CycleRing :current-day="currentDay" :cycle-length="avgCycle" :phase="phase" />
        <CycleSummary v-if="hasPeriodData" />
        <EmptyState
          v-else
          icon="🌿"
          title="Belum ada data haid"
          message="Catat periode haid pertamamu untuk mulai melihat ringkasan siklus dan prediksi."
        />
      </BaseCard>
    </section>

    <!-- TTD Reminder -->
    <section v-if="hasProfile" class="home__reminder animate-fadeIn">
      <h3 class="home__section-title">Pengingat TTD</h3>
      <ReminderCard />
    </section>

    <!-- Today's mood -->
    <section v-if="hasProfile" class="home__mood animate-fadeIn">
      <BaseCard variant="soft" :padding="'md'">
        <div class="home__mood-head">
          <h3 class="home__section-title">Mood Hari Ini</h3>
          <BaseButton variant="ghost" size="sm" @click="goToDetail('symptom-log')">
            {{ todayMood ? 'Ubah' : 'Catat' }}
          </BaseButton>
        </div>
        <div v-if="todayMood" class="home__mood-display">
          <span class="home__mood-emoji">{{ todayMood.emoji }}</span>
          <span class="home__mood-label">{{ todayMood.label }}</span>
        </div>
        <p v-else class="home__mood-empty">Belum mencatat mood hari ini</p>
      </BaseCard>
    </section>

    <!-- Feature cards -->
    <section v-if="hasProfile" class="home__features animate-fadeIn">
      <h3 class="home__section-title">Eksplorasi Fitur</h3>
      <div class="home__feature-grid">
        <button
          v-for="card in featureCards"
          :key="card.slug"
          class="home__feature-card"
          @click="goToDetail(card.slug)"
        >
          <span class="home__feature-icon" :style="{ background: card.color }">{{ card.icon }}</span>
          <span class="home__feature-title">{{ card.title }}</span>
          <span class="home__feature-desc">{{ card.desc }}</span>
        </button>
      </div>
    </section>

    <!-- Privacy note for minors -->
    <p v-if="hasProfile && isMinor" class="home__privacy-note">
      🔒 Data kamu hanya tersimpan di perangkat ini dan tidak dikirim ke mana pun.
    </p>
  </div>
</template>

<style scoped>
.home {
  padding: var(--sp-4) 0 var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.home__greeting {
  text-align: center;
  padding: var(--sp-3) 0;
}
.home__date {
  font-size: 0.8rem;
  color: var(--neutral-400);
  font-weight: 600;
}
.home__hello {
  font-size: 1.6rem;
  margin-top: var(--sp-1);
}
.home__sub {
  font-size: 0.88rem;
  color: var(--neutral-500);
  margin-top: 4px;
}

.home__onboard {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
}
.home__onboard-icon {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}
.home__onboard p {
  font-size: 0.88rem;
  color: var(--neutral-500);
  max-width: 280px;
}

.home__section-title {
  font-size: 1.05rem;
  color: var(--text-strong);
  margin-bottom: var(--sp-3);
}

.home__cycle-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
}
.home__cycle-head .home__section-title {
  margin-bottom: 0;
}

.home__phase-badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.home__reminder {
  display: flex;
  flex-direction: column;
}

.home__mood-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.home__mood-head .home__section-title {
  margin-bottom: 0;
}

.home__mood-display {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
}
.home__mood-emoji {
  font-size: 2rem;
}
.home__mood-label {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-strong);
}
.home__mood-empty {
  margin-top: var(--sp-2);
  color: var(--neutral-400);
  font-size: 0.85rem;
}

.home__feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
@media (min-width: 640px) {
  .home__feature-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.home__feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--sp-4);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  transition: all var(--t-normal);
  text-align: center;
}
.home__feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-200);
}

.home__feature-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.home__feature-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-strong);
}
.home__feature-desc {
  font-size: 0.72rem;
  color: var(--neutral-500);
}

.home__privacy-note {
  text-align: center;
  font-size: 0.75rem;
  color: var(--neutral-400);
  padding: var(--sp-2);
  background: var(--neutral-100);
  border-radius: var(--radius-md);
}
</style>
