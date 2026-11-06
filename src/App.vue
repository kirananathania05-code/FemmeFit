<script setup lang="ts">
import Navbar from './components/common/Navbar.vue';
import Footer from './components/common/Footer.vue';
</script>

<template>
  <Navbar />
  <main class="app-main">
    <div class="container">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.app-main {
  flex: 1;
  padding-bottom: var(--sp-4);
}
</style>
