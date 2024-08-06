<template>
  <div>
    <div class="row justify-center q-mb-lg">
      <ai-search
        class="col-12 col-sm-10"
        :system="filterSystem"
        :schema="filterSchema"
        @change="filterKeys = $event"
      />
    </div>
    <div class="row justify-center q-gutter-xs">
      <q-card
        class="col-12 col-sm-5"
        flat
        bordered
        v-for="note in notesList"
        :key="note.key"
      >
        <q-card-section class="text-h6">
          {{ note.title }}
        </q-card-section>
        <q-card-section class="text-h6">
          {{ note.date }}
        </q-card-section>
        <q-card-section class="row q-gutter-xs">
          <q-card
            flat
            v-for="(tag, i) in note.tags"
            :key="`note-tag-${i}`"
            class="q-px-sm bg-info text-white text-weight-bold"
          >
            <q-card-section class="q-pa-none">
              {{ tag }}
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section>
          {{ note.summary }}
        </q-card-section>
        <q-card-actions align="right">
          <div class="row justify-end absolute-bottom">
            <q-btn
              size="sm"
              flat
              round
              color="orange"
              icon="edit"
              @click="onStartUpdate(note)"
            />
            <q-btn
              size="sm"
              flat
              round
              color="red"
              icon="delete"
              @click="remove(note.key)"
            />
          </div>
        </q-card-actions>
      </q-card>
    </div>
    <q-page-sticky :offset="[10, 10]">
      <q-btn fab color="primary" icon="add" @click="creating = true" />
    </q-page-sticky>
    <note-form-dialog
      v-if="creating"
      :state="creating"
      @save="onSave"
      @change="creating = $event"
    />
    <note-form-dialog
      v-if="updating"
      :state="updating"
      v-model="noteModel"
      @save="onUpdate"
      @change="updating = $event"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, nextTick, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Note } from 'src/models/note';
import { useNotesStore } from 'src/stores/notes-store';
import { z } from 'zod';
import NoteFormDialog from 'src/components/notes/NoteFormDialog.vue';
import AiSearch from '../components/search/AiSearch.vue';

const creating = ref(false);
const updating = ref(false);
const noteModel = ref({} as Note & { key: string });

const { add, remove, update } = useNotesStore();
const { listWithKeys } = storeToRefs(useNotesStore());

const stringList = computed(() =>
  listWithKeys.value
    .map(
      (note) =>
        `{ title: ${note.title}, summary: ${note.summary}, date: ${note.date}, tags: ${note.tags}, key: ${note.key} }`
    )
    .join(',')
);

const filterSystem = computed(
  () =>
    `Do all the filters over this list of notes: [${stringList.value}] following the user search query.`
);
const filterKeys: Ref<string[]> = ref([]);
const filterSchema = z.object({
  result: z
    .array(z.string().describe('the key of the note'))
    .describe('The resulting array of the search'),
});

const notesList = computed(() => {
  if (!filterKeys.value || !filterKeys.value.length) return listWithKeys.value;
  return listWithKeys.value.filter((note) =>
    filterKeys.value.includes(note.key)
  );
});

function onStartUpdate(note: Note & { key: string }) {
  noteModel.value = { ...note };
  nextTick(() => (updating.value = true));
}

function onSave(note: Note) {
  add(note);
  creating.value = false;
}

function onUpdate() {
  update(
    noteModel.value.key,
    noteModel.value.title,
    noteModel.value.summary,
    noteModel.value.date,
    noteModel.value.tags
  );
  updating.value = false;
}
</script>
