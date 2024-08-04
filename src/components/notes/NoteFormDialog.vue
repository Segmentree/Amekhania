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
        <q-input dense v-model="referenceTitle" label="Title" outlined />
      </q-card-section>
      <q-card-section>
        <q-select
          dense
          outlined
          v-model="referenceTags"
          multiple
          :options="filterOptions"
          use-chips
          use-input
          input-debounce="0"
          new-value-mode="add"
          @filter="filterFn"
          stack-label
          label="tags"
        >
          <template #selected-item="{ opt, removeAtIndex, index }">
            <q-card
              flat
              class="bg-info q-px-sm text-white text-weight-bold q-mr-xs q-my-xs"
            >
              {{ opt }}
              <q-btn
                round
                dense
                flat
                size="8px"
                icon="delete"
                color="white"
                @click="removeAtIndex(index)"
              />
            </q-card>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section>
        <q-input
          dense
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
import { useNotesStore } from '../../stores/notes-store';

interface NoteFormDialogProps {
  state: boolean;
}

defineProps<NoteFormDialogProps>();
const emit = defineEmits(['close', 'save', 'change']);

const { tagsList } = useNotesStore();
const filterOptions = ref(tagsList);

const note = defineModel<Note & { [key: string]: any }>();
const referenceSummary = ref(note.value?.summary || '');
const referenceTitle = ref(note.value?.title || '');
const referenceTags = ref(note.value?.tags || []);
const noteDate = ref(note.value?.date);

function onSave() {
  note.value = {
    ...note.value,
    date: noteDate.value || new Date().toISOString().split('T')[0],
    summary: referenceSummary.value,
    title: referenceTitle.value,
    tags: referenceTags.value,
  };
  emit('save', note.value);
}

function filterFn(val: string, update: (callback: () => void) => void) {
  update(() => {
    if (val === '') {
      filterOptions.value = tagsList;
      return;
    }
    const needle = val.toLowerCase();
    filterOptions.value = tagsList.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>
