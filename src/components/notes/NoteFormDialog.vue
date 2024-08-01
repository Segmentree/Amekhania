<template>
  <q-dialog
    :modelValue="state"
    @update:modelValue="$emit('change', $event)"
    @keypress.enter="onSave"
  >
    <q-card style="width: 400px">
      <q-card-section class="row justify-end">
        <q-btn size="sm" icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input v-model="referenceTitle" label="Title" outlined />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="referenceSummary"
          label="Summary"
          type="textarea"
          outlined
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Save" color="primary" @click="onSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Note } from '../../models/note';

interface NoteFormDialogProps {
  state: boolean;
}

defineProps<NoteFormDialogProps>();
const emit = defineEmits(['close', 'save', 'change']);

const note = defineModel<Note & { [key: string]: any }>();
const referenceSummary = ref(note.value?.summary || '');
const referenceTitle = ref(note.value?.title || '');
const noteDate = ref(note.value?.date);

function onSave() {
  note.value = {
    ...note.value,
    date: noteDate.value || new Date().toDateString(),
    summary: referenceSummary.value,
    title: referenceTitle.value,
  };
  emit('save', note.value);
}
</script>
