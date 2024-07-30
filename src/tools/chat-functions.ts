import { z } from 'zod';
import { Tool } from '../models/tool';
import { Reminder } from '../models/reminder';
import { useRemindersStore } from 'src/stores/reminders-store';
import { proxyUnwrap } from './helpers';

export function useRemindersTools() {
  const remindersStore = useRemindersStore();

  const setReminder: Tool = {
    description:
      'The user mentions the needs of a reminder or something related to record a date.',
    parameters: z.object({
      summary: z.string().describe('What the user needs to be reminded of'),
      date: z
        .string()
        .describe('The date to remind the user in the format YYYY-MM-DD'),
    }),
    execute: ({ summary, date }) => {
      remindersStore.add({ summary, date });
      return `Notify the user the reminder for ${summary} was created on ${date}. Don't say more than that.`;
    },
  };

  const listReminders: Tool = {
    description:
      'You are asked to list all the reminders that the user has set',
    parameters: z.object({}),
    execute: () => {
      const list = proxyUnwrap(remindersStore.list)
        .map(
          (reminder: Reminder) =>
            `{ 'summary':${reminder.summary}, 'date':${reminder.date}}`
        )
        .join(', ');
      return `Show the user this list of reminders: ${list}`;
    },
  };

  return { setReminder, listReminders };
}
