<script setup lang="ts">
import { nutritionTips } from '../../data/nutritionData.js';
</script>

<template>
  <div class="nutrition-banner">
    <div class="nutrition-banner__icon">🥗</div>
    <div class="nutrition-banner__body">
      <h3 class="nutrition-banner__title">Makanan Kaya Zat Besi</h3>
      <p class="nutrition-banner__subtitle">
        Konsumsi makanan bergizi membantu menjaga energi saat menstruasi.
        Kombinasikan dengan vitamin C untuk penyerapan terbaik.
      </p>
      <ul class="nutrition-banner__tips">
        <li v-for="(tip, i) in nutritionTips" :key="i" class="nutrition-banner__tip">
          <span class="nutrition-banner__tip-icon">✓</span>
          {{ tip }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.nutrition-banner {
  display: flex;
  gap: var(--sp-4);
  padding: var(--sp-5);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--accent-100), var(--cream));
  border: 1px solid var(--accent-200);
}

.nutrition-banner__icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  animation: float 3s ease-in-out infinite;
}

.nutrition-banner__title {
  font-size: 1.15rem;
  color: var(--text-strong);
  margin-bottom: var(--sp-1);
}

.nutrition-banner__subtitle {
  font-size: 0.85rem;
  color: var(--neutral-600);
  margin-bottom: var(--sp-3);
  line-height: 1.5;
}

.nutrition-banner__tips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nutrition-banner__tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--neutral-600);
  line-height: 1.4;
}

.nutrition-banner__tip-icon {
  color: var(--accent-400);
  font-weight: 700;
  flex-shrink: 0;
}
</style>
