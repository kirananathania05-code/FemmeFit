<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const hasProfile = computed(() => store.getters['user/hasProfile']);
const userInitial = computed(() => store.getters['user/userInitial']);

const navItems = [
  { name: 'Beranda', to: '/', icon: '🏠' },
  { name: 'Profil', to: '/explore', icon: '👤' },
  { name: 'Tentang', to: '/about', icon: '💖' },
];

const isActive = (to: string) => {
  if (to === '/') return route.path === '/';
  return route.path.startsWith(to);
};
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner container">
      <router-link to="/" class="navbar__brand">
        <span class="navbar__logo">🌸</span>
        <span class="navbar__name">FemmeFit</span>
      </router-link>

      <nav class="navbar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="navbar__link"
          :class="{ 'navbar__link--active': isActive(item.to) }"
        >
          <span class="navbar__icon">{{ item.icon }}</span>
          <span class="navbar__label">{{ item.name }}</span>
        </router-link>
      </nav>

      <router-link to="/explore" class="navbar__avatar" v-if="hasProfile">
        {{ userInitial }}
      </router-link>
      <router-link to="/explore" class="navbar__avatar navbar__avatar--empty" v-else>
        ?
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 244, 222, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--primary-100);
  padding: var(--sp-2) 0;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  max-width: 880px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.3rem;
  color: var(--primary-500);
  transition: transform var(--t-fast);
}
.navbar__brand:hover { transform: scale(1.03); }
.navbar__brand:visited { color: var(--primary-500); }

.navbar__logo {
  font-size: 1.4rem;
  animation: float 3s ease-in-out infinite;
}

.navbar__nav {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
}

.navbar__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-md);
  color: var(--neutral-600);
  font-size: 0.7rem;
  font-weight: 600;
  transition: all var(--t-fast);
  min-width: 56px;
}
.navbar__link:hover {
  background: var(--primary-50);
  color: var(--primary-500);
}
.navbar__link--active {
  background: var(--primary-100);
  color: var(--primary-600);
}
.navbar__link--active:visited { color: var(--primary-600); }

.navbar__icon {
  font-size: 1.2rem;
}

.navbar__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background: var(--primary-400);
  color: white;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  transition: transform var(--t-fast);
  box-shadow: var(--shadow-sm);
}
.navbar__avatar:hover { transform: scale(1.08); }
.navbar__avatar--empty {
  background: var(--neutral-300);
  color: var(--neutral-0);
}

@media (max-width: 420px) {
  .navbar__label { display: none; }
  .navbar__link { min-width: 44px; padding: var(--sp-1) var(--sp-2); }
  .navbar__name { font-size: 1.1rem; }
}
</style>
