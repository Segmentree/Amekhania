<template>
  <chat-hub :tools="tools" />
</template>

<script setup>
import ChatHub from 'src/components/chat/ChatHub.vue';
import { useRemindersTools } from '../tools/chat-functions';

const { setReminder, listReminders, askReminderDate } = useRemindersTools();
const tools = [setReminder, listReminders, askReminderDate];
</script>
