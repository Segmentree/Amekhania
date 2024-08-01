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
        <q-input v-model="referenceDate" label="Date" type="date" outlined />
      </q-card-section>
      <q-card-section>
        <q-input v-model="referenceSummary" label="Summary" outlined />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Save" color="primary" @click="onSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Reminder } from '../../models/reminder';

interface ReminderFormDialogProps {
  state: boolean;
}

defineProps<ReminderFormDialogProps>();
const emit = defineEmits(['close', 'save', 'change']);

const reminder = defineModel<Reminder & { [key: string]: any }>();
const referenceDate = ref(reminder.value?.date || '');
const referenceSummary = ref(reminder.value?.summary || '');

function onSave() {
  reminder.value = {
    ...reminder.value,
    date: referenceDate.value,
    summary: referenceSummary.value,
  };
  emit('save', reminder.value);
}
</script>
