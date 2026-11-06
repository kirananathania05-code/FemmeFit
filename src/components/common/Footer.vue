<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__brand">
        <span class="footer__logo">🌸</span>
        <span class="footer__name">FemmeFit</span>
      </div>
      <p class="footer__tagline">
        Sahabat kesehatan menstruasi — edukasi, pemantauan, dan kebiasaan sehat.
      </p>
      <p class="footer__disclaimer">
        FemmeFit memberikan edukasi dan pemantauan, bukan diagnosis medis.
        Untuk diagnosis konsultasikan dengan tenaga kesehatan.
      </p>
      <p class="footer__copy">© 2026 FemmeFit · Dibuat dengan 💕</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background: linear-gradient(180deg, var(--cream) 0%, var(--primary-50) 100%);
  border-top: 1px solid var(--primary-100);
  padding: var(--sp-6) 0 var(--sp-4);
}

.footer__inner {
  text-align: center;
  max-width: 600px;
}

.footer__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--primary-500);
  margin-bottom: var(--sp-2);
}

.footer__logo {
  animation: float 3s ease-in-out infinite;
}

.footer__tagline {
  font-size: 0.9rem;
  color: var(--neutral-600);
  margin-bottom: var(--sp-2);
}

.footer__disclaimer {
  font-size: 0.75rem;
  color: var(--neutral-500);
  line-height: 1.5;
  margin-bottom: var(--sp-3);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.footer__copy {
  font-size: 0.75rem;
  color: var(--neutral-400);
}
</style>
