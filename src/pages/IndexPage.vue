<template>
  <q-page class="row q-pa-md">
    <chat-hub :tools="tools" />
  </q-page>
</template>

<script setup>
import ChatHub from 'src/components/chat/ChatHub.vue';
import { useRemindersTools } from '../tools/chat-functions';

const { setReminder, listReminders, askReminderDate } = useRemindersTools();
const tools = [setReminder, listReminders, askReminderDate];
</script>
