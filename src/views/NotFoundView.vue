<script setup lang="ts">
import BaseButton from '../components/common/BaseButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="not-found">
    <div class="not-found__emoji">🌸</div>
    <h1 class="not-found__code">404</h1>
    <h2 class="not-found__title">Halaman tidak ditemukan</h2>
    <p class="not-found__message">
      Sepertinya halaman yang kamu cari belum tersedia, atau mungkin sudah dipindahkan.
    </p>
    <BaseButton variant="primary" rounded @click="router.push('/')">Kembali ke Beranda</BaseButton>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--sp-8) var(--sp-4);
  gap: var(--sp-3);
  min-height: 60vh;
}

.not-found__emoji {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

.not-found__code {
  font-family: var(--font-heading);
  font-size: 4rem;
  font-weight: 800;
  color: var(--primary-300);
  line-height: 1;
}

.not-found__title {
  font-size: 1.3rem;
  color: var(--text-strong);
}

.not-found__message {
  font-size: 0.88rem;
  color: var(--neutral-500);
  max-width: 320px;
  margin-bottom: var(--sp-2);
}
</style>
