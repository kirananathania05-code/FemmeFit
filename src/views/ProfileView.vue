<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import BaseCard from '../components/common/BaseCard.vue';
import BaseButton from '../components/common/BaseButton.vue';
import Modal from '../components/common/Modal.vue';

const store = useStore();
const router = useRouter();

const hasProfile = computed(() => store.getters['user/hasProfile']);
const userName = computed(() => store.state.user.name);
const userAge = computed(() => store.state.user.age);
const bloodType = computed(() => store.state.user.bloodType);
const bloodPressure = computed(() => store.state.user.bloodPressure);
const isMinor = computed(() => store.getters['user/isMinor']);

const name = ref(userName.value);
const age = ref(userAge.value);
const bloodTypeVal = ref(bloodType.value);
const bloodPressureVal = ref(bloodPressure.value);

watch(userName, (v) => { name.value = v; });
watch(userAge, (v) => { age.value = v; });
watch(bloodType, (v) => { bloodTypeVal.value = v; });
watch(bloodPressure, (v) => { bloodPressureVal.value = v; });

const showSaveModal = ref(false);
const showResetModal = ref(false);

function saveProfile() {
  store.dispatch('user/saveProfile', {
    name: name.value.trim(),
    age: age.value ? Number(age.value) : null,
    bloodType: bloodTypeVal.value,
    bloodPressure: bloodPressureVal.value,
  });
  showSaveModal.value = true;
  setTimeout(() => { showSaveModal.value = false; }, 2000);
}

const errors = computed(() => {
  const e: string[] = [];
  if (!name.value.trim()) e.push('Nama tidak boleh kosong');
  if (age.value !== null && age.value !== '' && (Number(age.value) < 9 || Number(age.value) > 40))
    e.push('Usia harus antara 9–40 tahun');
  return e;
});

function confirmReset() {
  store.dispatch('user/resetUser');
  store.dispatch('period/resetPeriod');
  store.dispatch('reminder/resetReminder');
  store.dispatch('health/resetHealth');
  showResetModal.value = false;
  router.push('/');
}

const bloodTypes = ['A', 'B', 'AB', 'O', 'Tidak tahu'];

const stats = computed(() => [
  { label: 'Periode tercatat', value: store.getters['period/entryCount'], icon: '📋' },
  { label: 'Konfirmasi TTD bulan ini', value: store.getters['reminder/totalConfirmedThisMonth'], icon: '💊' },
  { label: 'Catatan harian', value: store.getters['health/logCount'], icon: '📝' },
]);
</script>

<template>
  <div class="profile">
    <div class="profile__header">
      <h1>Profil Pengguna</h1>
      <p class="profile__subtitle">Kelola informasi dan preferensi kamu</p>
    </div>

    <!-- Stats summary -->
    <div class="profile__stats" v-if="hasProfile">
      <div v-for="stat in stats" :key="stat.label" class="profile__stat">
        <span class="profile__stat-icon">{{ stat.icon }}</span>
        <span class="profile__stat-value">{{ stat.value }}</span>
        <span class="profile__stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <!-- Profile form -->
    <BaseCard variant="default" :padding="'lg'">
      <h3 class="profile__form-title">Informasi Dasar</h3>

      <div class="profile__field">
        <label class="profile__label">Nama <span class="profile__required">*</span></label>
        <input
          v-model="name"
          type="text"
          placeholder="Nama kamu"
          class="profile__input"
          maxlength="30"
        />
      </div>

      <div class="profile__field">
        <label class="profile__label">Usia <span class="profile__required">*</span></label>
        <input
          v-model="age"
          type="number"
          min="9"
          max="40"
          placeholder="9–40 tahun"
          class="profile__input"
        />
        <p class="profile__hint">FemmeFit ditujukan untuk usia 9–40 tahun.</p>
      </div>

      <div class="profile__field">
        <label class="profile__label">Golongan Darah (opsional)</label>
        <div class="profile__chips">
          <button
            v-for="bt in bloodTypes"
            :key="bt"
            class="profile__chip"
            :class="{ 'profile__chip--active': bloodTypeVal === bt }"
            @click="bloodTypeVal = bt"
          >{{ bt }}</button>
        </div>
        <p class="profile__hint">Tidak digunakan untuk diagnosis, hanya untuk catatan pribadi.</p>
      </div>

      <div class="profile__field">
        <label class="profile__label">Tekanan Darah (opsional)</label>
        <input
          v-model="bloodPressureVal"
          type="text"
          placeholder="contoh: 120/80 mmHg"
          class="profile__input"
        />
        <p class="profile__hint">Catatan pribadi, bukan untuk diagnosis anemia.</p>
      </div>

      <div class="profile__errors" v-if="errors.length > 0">
        <p v-for="e in errors" :key="e" class="profile__error">⚠️ {{ e }}</p>
      </div>

      <BaseButton
        variant="primary"
        block
        rounded
        :disabled="errors.length > 0"
        @click="saveProfile"
      >
        {{ hasProfile ? 'Perbarui Profil' : 'Simpan & Mulai' }}
      </BaseButton>
    </BaseCard>

    <!-- Privacy notice -->
    <BaseCard variant="soft" :padding="'md'">
      <h4 class="profile__notice-title">🔒 Privasi Data</h4>
      <p class="profile__notice-text">
        Semua data hanya tersimpan di browser perangkat ini (localStorage) dan tidak dikirim ke server.
      </p>
      <p class="profile__notice-text" v-if="isMinor">
        Karena kamu masih di bawah 18 tahun, FemmeFit membatasi data yang dikumpulkan dan tidak menyimpan
        informasi sensitif tambahan.
      </p>
    </BaseCard>

    <!-- Data management -->
    <BaseCard variant="outline" :padding="'md'" v-if="hasProfile">
      <h4 class="profile__notice-title">Kelola Data</h4>
      <p class="profile__notice-text">
        Hapus semua data (profil, siklus, pengingat, catatan) dari perangkat ini. Tindakan ini tidak dapat dibatalkan.
      </p>
      <BaseButton variant="danger" size="sm" @click="showResetModal = true">
        Hapus Semua Data
      </BaseButton>
    </BaseCard>

    <!-- Success toast -->
    <Transition name="fade">
      <div v-if="showSaveModal" class="profile__toast">
        ✅ Profil tersimpan!
      </div>
    </Transition>

    <!-- Reset confirm modal -->
    <Modal v-model="showResetModal" title="Hapus semua data?" size="sm">
      <p class="profile__modal-text">
        Semua data FemmeFit di perangkat ini akan dihapus permanen: profil, riwayat haid,
        pengaturan pengingat, dan catatan harian.
      </p>
      <template #footer>
        <BaseButton variant="ghost" @click="showResetModal = false">Batal</BaseButton>
        <BaseButton variant="danger" @click="confirmReset">Ya, hapus semua</BaseButton>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.profile {
  padding: var(--sp-4) 0 var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.profile__header {
  text-align: center;
  padding: var(--sp-2) 0;
}
.profile__header h1 {
  font-size: 1.5rem;
  color: var(--text-strong);
}
.profile__subtitle {
  font-size: 0.85rem;
  color: var(--neutral-500);
  margin-top: 4px;
}

.profile__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
}
.profile__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
}
.profile__stat-icon { font-size: 1.2rem; }
.profile__stat-value {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.4rem;
  color: var(--primary-500);
}
.profile__stat-label {
  font-size: 0.68rem;
  color: var(--neutral-500);
  text-align: center;
  line-height: 1.2;
}

.profile__form-title {
  font-size: 1.15rem;
  margin-bottom: var(--sp-4);
}

.profile__field {
  margin-bottom: var(--sp-4);
}

.profile__label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--neutral-700);
  margin-bottom: var(--sp-1);
}
.profile__required { color: var(--primary-400); }

.profile__input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--text-strong);
  background: var(--neutral-0);
  transition: border-color var(--t-fast);
}
.profile__input:focus {
  outline: none;
  border-color: var(--primary-300);
}

.profile__hint {
  font-size: 0.72rem;
  color: var(--neutral-400);
  margin-top: 4px;
}

.profile__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.profile__chip {
  padding: 7px 16px;
  border-radius: var(--radius-full);
  background: var(--neutral-100);
  color: var(--neutral-500);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all var(--t-fast);
}
.profile__chip--active {
  background: var(--primary-400);
  color: white;
}

.profile__errors {
  margin-bottom: var(--sp-3);
}
.profile__error {
  font-size: 0.8rem;
  color: var(--error-600);
  margin-bottom: 4px;
}

.profile__notice-title {
  font-size: 1rem;
  margin-bottom: var(--sp-2);
}
.profile__notice-text {
  font-size: 0.82rem;
  color: var(--neutral-600);
  line-height: 1.5;
  margin-bottom: var(--sp-2);
}

.profile__modal-text {
  font-size: 0.88rem;
  color: var(--neutral-600);
  line-height: 1.5;
}

.profile__toast {
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
  animation: slideUp var(--t-normal);
}
</style>
