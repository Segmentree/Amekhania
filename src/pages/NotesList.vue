<template>
  <div>
    <div class="row justify-center q-gutter-xs">
      <q-card
        class="col-sm-6 col-md-3"
        flat
        bordered
        v-for="note in listWithKeys"
        :key="note.key"
      >
        <q-card-section class="text-h6">
          {{ note.title }}
        </q-card-section>
        <q-card-section class="text-h6">
          {{ note.date }}
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
import { ref, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { Note } from 'src/models/note';
import { useNotesStore } from 'src/stores/notes-store';

import NoteFormDialog from 'src/components/notes/NoteFormDialog.vue';

const creating = ref(false);
const updating = ref(false);
const noteModel = ref({} as Note & { key: string });

const { add, remove, update } = useNotesStore();
const { listWithKeys } = storeToRefs(useNotesStore());

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
    noteModel.value.date
  );
  updating.value = false;
}
</script>
