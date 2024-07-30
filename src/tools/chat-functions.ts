import { Ref } from 'vue';
import { z } from 'zod';
import { Tool } from '../models/tool';
import { Reminder } from '../models/reminder';
import { useRemindersStore } from 'src/stores/reminders-store';
import { proxyUnwrap } from './helpers';

export function useRemindersTools() {
  const remindersStore = useRemindersStore();

  const setReminder: Tool = {
    description:
      'Whenever the user mentions the needs of a reminder or something related to record a date',
    parameters: z.object({
      summary: z.string().describe('What the user needs to be reminded of'),
      date: z
        .string()
        .describe('The date to remind the user in the format YYYY-MM-DD'),
    }),
    execute: (
      request: () => void,
      promptReference: Ref<string>,
      { summary, date }
    ) => {
      promptReference.value = `Tell the user about the reminder: ${summary} on ${date} was set. Don't call setReminder tool this time.`;
      remindersStore.add({ summary, date });
      request();
    },
  };

  const listReminders: Tool = {
    description: 'List all the reminders that the user has set',
    parameters: z.object({}),
    execute: (request: () => void, promptReference: Ref<string>) => {
      const list = proxyUnwrap(remindersStore.list)
        .map(
          (reminder: Reminder) =>
            `{ 'summary':${reminder.summary}, 'date':${reminder.date}}`
        )
        .join(', ');
      promptReference.value = `Tell the user about his list of reminders ${list}. Don't call listReminder tool this time.`;
      request();
    },
  };

  return { setReminder, listReminders };
}
