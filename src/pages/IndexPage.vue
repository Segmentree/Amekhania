<template>
  <chat-hub :tools="tools" />
</template>

<script setup>
import ChatHub from 'src/components/chat/ChatHub.vue';
import { useRemindersTools, useNotesTools } from '../tools/chat-functions';
import { useToolsStore } from '../stores/tools-store';

const { list: customToolsList } = useToolsStore();

const { setReminder, listReminders, askReminderDate } = useRemindersTools();
const { addNote, listNotes } = useNotesTools();
const tools = [
  setReminder,
  listReminders,
  askReminderDate,
  addNote,
  listNotes,
  ...customToolsList,
];
</script>
