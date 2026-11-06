<script setup lang="ts">
import BaseCard from '../components/common/BaseCard.vue';
import BaseButton from '../components/common/BaseButton.vue';

const features = [
  { icon: '📅', title: 'Pantau Siklus', desc: 'Kalender haid, riwayat menstruasi, dan prediksi siklus berikutnya.' },
  { icon: '💊', title: 'Pengingat TTD', desc: 'Atur hari dan jam pengingat untuk membangun konsistensi konsumsi Tablet Tambah Darah.' },
  { icon: '🥗', title: 'Edukasi Nutrisi', desc: 'Pelajari makanan kaya zat besi dan tips penyerapan yang baik untuk tubuh.' },
  { icon: '📝', title: 'Catatan Harian', desc: 'Catat mood dan gejala harian untuk memahami pola tubuhmu.' },
];

const principles = [
  'Edukasi, bukan diagnosis — FemmeFit tidak mendiagnosis anemia atau kondisi medis lain.',
  'Bahasa sederhana dan ramah — tidak menghakimi, mudah dipahami untuk usia 9–40 tahun.',
  'Privasi diutamakan — semua data tersimpan lokal di perangkat, tidak dikirim ke server.',
  'Estimasi, bukan kepastian — prediksi siklus bersifat perkiraan dan bisa bervariasi.',
];

const faqs = [
  { q: 'Apakah FemmeFit bisa mendiagnosis anemia?', a: 'Tidak. Gejala seperti lemas atau pusing tidak cukup untuk diagnosis anemia. Diagnosis memerlukan pemeriksaan hemoglobin (Hb) oleh tenaga kesehatan.' },
  { q: 'Apakah data saya aman?', a: 'Semua data disimpan hanya di browser perangkat kamu (localStorage). Data tidak dikirim ke mana pun dan dapat dihapus kapan saja melalui halaman Profil.' },
  { q: 'Apakah pengingat TTD muncul saat browser ditutup?', a: 'Tidak. Pengingat hanya muncul saat website FemmeFit aktif. Notifikasi push sungguhan memerlukan layanan backend tambahan.' },
  { q: 'Apakah golongan darah diperlukan?', a: 'Tidak. Golongan darah dan tekanan darah bersifat opsional dan tidak digunakan untuk menghitung siklus atau mendiagnosis kondisi apapun.' },
];
</script>

<template>
  <div class="about">
    <div class="about__hero">
      <span class="about__hero-emoji">🌸</span>
      <h1 class="about__title">Tentang FemmeFit</h1>
      <p class="about__subtitle">
        Sahabat kesehatan menstruasi — edukasi, pemantauan, dan kebiasaan sehat untuk perempuan.
      </p>
    </div>

    <BaseCard variant="primary" :padding="'lg'">
      <div class="about__mission">
        <h3>Misi Kami</h3>
        <p>
          FemmeFit membantu perempuan memahami pola siklus haid, membangun konsistensi konsumsi
          Tablet Tambah Darah (TTD), serta mengenali pentingnya makanan bergizi kaya zat besi.
          Fokus produk adalah pencegahan dan peningkatan kesadaran, bukan diagnosis.
        </p>
      </div>
    </BaseCard>

    <h2 class="about__section-title">Fitur Utama</h2>
    <div class="about__features">
      <BaseCard v-for="f in features" :key="f.title" variant="default" :padding="'md'">
        <div class="about__feature">
          <span class="about__feature-icon">{{ f.icon }}</span>
          <h4 class="about__feature-title">{{ f.title }}</h4>
          <p class="about__feature-desc">{{ f.desc }}</p>
        </div>
      </BaseCard>
    </div>

    <h2 class="about__section-title">Prinsip Kami</h2>
    <div class="about__principles">
      <div v-for="(p, i) in principles" :key="i" class="about__principle">
        <span class="about__principle-check">✓</span>
        <span>{{ p }}</span>
      </div>
    </div>

    <h2 class="about__section-title">Pertanyaan Umum</h2>
    <div class="about__faqs">
      <details v-for="(faq, i) in faqs" :key="i" class="about__faq">
        <summary class="about__faq-q">{{ faq.q }}</summary>
        <p class="about__faq-a">{{ faq.a }}</p>
      </details>
    </div>

    <BaseCard variant="soft" :padding="'md'">
      <h4 class="about__disclaimer-title">⚠️ Disclaimer Kesehatan</h4>
      <p class="about__disclaimer-text">
        FemmeFit adalah alat edukasi dan pemantauan, bukan pengganti konsultasi medis.
        Untuk diagnosis, pengobatan, atau keputusan kesehatan, konsultasikan dengan tenaga kesehatan profesional.
      </p>
    </BaseCard>
  </div>
</template>

<style scoped>
.about {
  padding: var(--sp-4) 0 var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.about__hero {
  text-align: center;
  padding: var(--sp-4) 0;
}
.about__hero-emoji {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
  display: block;
  margin-bottom: var(--sp-2);
}
.about__title {
  font-size: 1.8rem;
  color: var(--text-strong);
}
.about__subtitle {
  font-size: 0.92rem;
  color: var(--neutral-500);
  margin-top: var(--sp-2);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.about__mission h3 {
  font-size: 1.2rem;
  margin-bottom: var(--sp-2);
}
.about__mission p {
  font-size: 0.88rem;
  color: var(--neutral-600);
  line-height: 1.6;
}

.about__section-title {
  font-size: 1.25rem;
  color: var(--text-strong);
}

.about__features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
@media (min-width: 640px) {
  .about__features {
    grid-template-columns: repeat(4, 1fr);
  }
}

.about__feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}
.about__feature-icon {
  font-size: 1.8rem;
}
.about__feature-title {
  font-size: 0.95rem;
  color: var(--text-strong);
}
.about__feature-desc {
  font-size: 0.78rem;
  color: var(--neutral-500);
  line-height: 1.4;
}

.about__principles {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.about__principle {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
  padding: var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  color: var(--neutral-600);
  line-height: 1.5;
}
.about__principle-check {
  color: var(--accent-400);
  font-weight: 700;
  flex-shrink: 0;
}

.about__faqs {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.about__faq {
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  overflow: hidden;
}
.about__faq-q {
  padding: var(--sp-3) var(--sp-4);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-strong);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.about__faq-q::after {
  content: '▸';
  color: var(--primary-400);
  transition: transform var(--t-fast);
}
.about__faq[open] .about__faq-q::after {
  transform: rotate(90deg);
}
.about__faq-a {
  padding: 0 var(--sp-4) var(--sp-3);
  font-size: 0.82rem;
  color: var(--neutral-600);
  line-height: 1.5;
}

.about__disclaimer-title {
  font-size: 1rem;
  margin-bottom: var(--sp-2);
}
.about__disclaimer-text {
  font-size: 0.82rem;
  color: var(--neutral-600);
  line-height: 1.5;
}
</style>
