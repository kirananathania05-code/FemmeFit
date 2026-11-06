/**
 * nutritionData — static list of iron-rich foods for education.
 * Iron content is approximate (mg per 100g).
 */

export const nutritionData = [
  {
    id: 'hati-ayam',
    name: 'Hati Ayam',
    iron: 9.0,
    category: 'Protein Hewani',
    benefit: 'Sumber zat besi heme yang mudah diserap tubuh.',
    tip: 'Tumis dengan bumbu ringan atau panggang agar tidak alot.',
    emoji: '🍗',
  },
  {
    id: 'daging-sapi',
    name: 'Daging Sapi',
    iron: 2.6,
    category: 'Protein Hewani',
    benefit: 'Mengandung zat besi heme dan vitamin B12.',
    tip: 'Pilih bagian tanpa lemak dan masak dengan sayuran.',
    emoji: '🥩',
  },
  {
    id: 'bayam',
    name: 'Bayam',
    iron: 2.7,
    category: 'Sayuran Hijau',
    benefit: 'Kaya zat besi non-heme dan asam folat.',
    tip: 'Konsumsi dengan vitamin C (jeruk, lemon) untuk membantu penyerapan.',
    emoji: '🥬',
  },
  {
    id: 'kacang-merah',
    name: 'Kacang Merah',
    iron: 2.9,
    category: 'Kacang-kacangan',
    benefit: 'Sumber zat besi dan serat yang baik.',
    tip: 'Rendam semalaman sebelum dimasak agar lebih mudah dicerna.',
    emoji: '🫘',
  },
  {
    id: 'telur',
    name: 'Telur',
    iron: 1.2,
    category: 'Protein Hewani',
    benefit: 'Mengandung zat besi, protein, dan vitamin B12.',
    tip: 'Rebus adalah cara terbaik untuk mempertahankan nutrisi.',
    emoji: '🥚',
  },
  {
    id: 'kismis',
    name: 'Kismis',
    iron: 3.0,
    category: 'Buah Kering',
    benefit: 'Camilan manis dengan kandungan zat besi.',
    tip: 'Sangat baik untuk camilan sehat saat haid.',
    emoji: '🍇',
  },
  {
    id: 'brokoli',
    name: 'Brokoli',
    iron: 1.0,
    category: 'Sayuran Hijau',
    benefit: 'Zat besi, vitamin C, dan serat dalam satu sayuran.',
    tip: 'Kukus singkat untuk menjaga nutrisi dan warna.',
    emoji: '🥦',
  },
  {
    id: 'tempe',
    name: 'Tempe',
    iron: 1.6,
    category: 'Kacang-kacangan',
    benefit: 'Protein nabati dengan zat besi dan prebiotik.',
    tip: 'Tumis dengan sedikit minyak dan bumbu alami.',
    emoji: '🟫',
  },
  {
    id: 'kurma',
    name: 'Kurma',
    iron: 1.2,
    category: 'Buah Kering',
    benefit: 'Sumber energi dan zat besi alami.',
    tip: 'Camilan ideal saat merasa lemas di awal haid.',
    emoji: '🌴',
  },
  {
    id: 'ikan-tuna',
    name: 'Ikan Tuna',
    iron: 1.0,
    category: 'Protein Hewani',
    benefit: 'Zat besi heme dan asam lemak omega-3.',
    tip: 'Panggang atau kukus, hindari menggoreng berlebihan.',
    emoji: '🐟',
  },
];

export const nutritionCategories = [
  'Semua',
  'Protein Hewani',
  'Sayuran Hijau',
  'Kacang-kacangan',
  'Buah Kering',
];

export const nutritionTips = [
  'Gabungkan makanan kaya zat besi dengan vitamin C untuk penyerapan maksimal.',
  'Hindari minum teh atau kopi sebaiknya 1 jam setelah makan zat besi.',
  'Zat besi heme dari hewani lebih mudah diserap dibanding non-heme dari nabati.',
  'Konsumsi TTD sesuai anjuran tidak menggantikan makanan bergizi sehari-hari.',
];
