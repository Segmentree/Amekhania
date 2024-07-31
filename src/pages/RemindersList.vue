<template>
  <div>
    <div class="row q-gutter-xs">
      <q-card
        class="col-md-3 col-lg-2"
        flat
        bordered
        v-for="reminder in listWithKeys"
        :key="reminder.key"
      >
        <q-card-section class="text-h6">
          {{ reminder.date }}
        </q-card-section>
        <q-card-section>
          {{ reminder.summary }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            round
            color="orange"
            icon="edit"
            @click="onStartUpdate(reminder)"
          />
          <q-btn
            flat
            round
            color="red"
            icon="delete"
            @click="remove(reminder.key)"
          />
        </q-card-actions>
      </q-card>
    </div>
    <q-page-sticky :offset="[10, 10]">
      <q-btn fab color="primary" icon="add" @click="creating = true" />
    </q-page-sticky>
    <reminder-form-dialog
      :state="creating"
      @save="onSave"
      @change="creating = $event"
    />
    <reminder-form-dialog
      :state="updating"
      v-model="reminderModel"
      @save="onUpdate"
      @change="updating = $event"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRemindersStore } from 'src/stores/reminders-store';
import { storeToRefs } from 'pinia';
import { Reminder } from 'src/models/reminder';

import ReminderFormDialog from '../components/reminders/ReminderFormDialog.vue';

const creating = ref(false);
const updating = ref(false);
const reminderModel = ref({} as Reminder & { key: string });

const { add, remove, update } = useRemindersStore();
const { listWithKeys } = storeToRefs(useRemindersStore());

function onStartUpdate(reminder: Reminder & { key: string }) {
  reminderModel.value = reminder;
  nextTick(() => (updating.value = true));
}

function onSave(reminder: Reminder) {
  add(reminder);
  creating.value = false;
}

function onUpdate() {
  update(
    reminderModel.value.key,
    reminderModel.value.summary,
    reminderModel.value.date
  );
  updating.value = false;
}
</script>
