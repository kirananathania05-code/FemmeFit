<script setup lang="ts">
import { ref, watch } from 'vue';
import { SYMPTOMS } from '../../stores/healthStore.js';
import BaseButton from '../common/BaseButton.vue';

const props = defineProps<{
  symptoms: string[];
  note: string;
}>();

const emit = defineEmits<{
  (e: 'update:symptoms', val: string[]): void;
  (e: 'update:note', val: string): void;
  (e: 'submit'): void;
}>();

const localSymptoms = ref<string[]>([...props.symptoms]);
const localNote = ref(props.note);

watch(() => props.symptoms, (v) => { localSymptoms.value = [...v]; });
watch(() => props.note, (v) => { localNote.value = v; });

function toggle(symptom: string) {
  if (localSymptoms.value.includes(symptom)) {
    localSymptoms.value = localSymptoms.value.filter((s) => s !== symptom);
  } else {
    localSymptoms.value = [...localSymptoms.value, symptom];
  }
  emit('update:symptoms', localSymptoms.value);
}

function onNoteInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value;
  localNote.value = val;
  emit('update:note', val);
}

function submit() {
  emit('submit');
}
</script>

<template>
  <div class="symptom-form">
    <div class="symptom-form__section">
      <label class="symptom-form__label">Gejala yang dirasakan</label>
      <p class="symptom-form__hint">Pilih gejala yang kamu alami hari ini (opsional)</p>
      <div class="symptom-form__chips">
        <button
          v-for="sym in SYMPTOMS"
          :key="sym"
          class="symptom-chip"
          :class="{ 'symptom-chip--active': localSymptoms.includes(sym) }"
          @click="toggle(sym)"
        >{{ sym }}</button>
      </div>
    </div>

    <div class="symptom-form__section">
      <label class="symptom-form__label" for="symptom-note">Catatan harian</label>
      <textarea
        id="symptom-note"
        :value="localNote"
        @input="onNoteInput"
        class="symptom-form__textarea"
        rows="3"
        placeholder="Tulis catatan atau pengalaman hari ini..."
      ></textarea>
    </div>

    <BaseButton variant="primary" block rounded @click="submit">
      Simpan Catatan
    </BaseButton>
  </div>
</template>

<style scoped>
.symptom-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.symptom-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.symptom-form__label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--neutral-700);
}

.symptom-form__hint {
  font-size: 0.75rem;
  color: var(--neutral-400);
}

.symptom-form__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.symptom-chip {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--neutral-100);
  color: var(--neutral-500);
  font-size: 0.82rem;
  font-weight: 600;
  transition: all var(--t-fast);
  border: 2px solid transparent;
}
.symptom-chip:hover {
  background: var(--neutral-200);
}
.symptom-chip--active {
  background: var(--primary-100);
  color: var(--primary-600);
  border-color: var(--primary-300);
}

.symptom-form__textarea {
  width: 100%;
  padding: var(--sp-3);
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--text-strong);
  background: var(--neutral-0);
  resize: vertical;
  font-family: var(--font-body);
  line-height: 1.5;
  transition: border-color var(--t-fast);
}
.symptom-form__textarea:focus {
  outline: none;
  border-color: var(--primary-300);
}
</style>
