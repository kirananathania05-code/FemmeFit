<script setup lang="ts">
defineProps<{
  food: {
    id: string;
    name: string;
    iron: number;
    category: string;
    benefit: string;
    tip: string;
    emoji: string;
  };
}>();
</script>

<template>
  <div class="nutrition-card">
    <div class="nutrition-card__emoji">{{ food.emoji }}</div>
    <div class="nutrition-card__body">
      <div class="nutrition-card__head">
        <h4 class="nutrition-card__name">{{ food.name }}</h4>
        <span class="nutrition-card__badge">{{ food.iron }} mg</span>
      </div>
      <p class="nutrition-card__category">{{ food.category }}</p>
      <p class="nutrition-card__benefit">{{ food.benefit }}</p>
      <div class="nutrition-card__tip">
        <span class="nutrition-card__tip-icon">💡</span>
        <span>{{ food.tip }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nutrition-card {
  display: flex;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  transition: all var(--t-normal);
}
.nutrition-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--primary-200);
}

.nutrition-card__emoji {
  font-size: 2rem;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--cream);
  flex-shrink: 0;
}

.nutrition-card__body {
  flex: 1;
  min-width: 0;
}

.nutrition-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
}

.nutrition-card__name {
  font-size: 1.05rem;
  color: var(--text-strong);
}

.nutrition-card__badge {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--secondary-100);
  color: var(--secondary-500);
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.nutrition-card__category {
  font-size: 0.75rem;
  color: var(--neutral-400);
  font-weight: 600;
  margin-top: 2px;
}

.nutrition-card__benefit {
  font-size: 0.82rem;
  color: var(--neutral-600);
  margin-top: var(--sp-2);
  line-height: 1.5;
}

.nutrition-card__tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: var(--sp-2);
  padding: var(--sp-2);
  border-radius: var(--radius-sm);
  background: var(--accent-50);
  font-size: 0.78rem;
  color: var(--neutral-600);
  line-height: 1.4;
}

.nutrition-card__tip-icon {
  flex-shrink: 0;
}
</style>
