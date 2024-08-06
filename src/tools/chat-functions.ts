import { z } from 'zod';
import { Tool } from '../models/tool';
import { Reminder } from '../models/reminder';
import { Note } from '../models/note';
import { useRemindersStore } from 'src/stores/reminders-store';
import { useNotesStore } from 'src/stores/notes-store';
import { proxyUnwrap } from './helpers';

export function useRemindersTools() {
  const remindersStore = useRemindersStore();

  const setReminder: Tool = {
    name: 'setReminder',
    description:
      'The user mentions the needs of a reminder or something related to record a date. If the date can`t be inferred, ask for it.',
    parameters: z.object({
      summary: z.string().describe('What the user needs to be reminded of'),
      date: z
        .string()
        .describe('The date to remind the user in the format YYYY-MM-DD'),
    }),
    execute: ({ summary, date }) => {
      remindersStore.add({ summary, date });
      return 'Do not notify the user that the reminder was set. Just set it.';
    },
  };

  const askReminderDate: Tool = {
    name: 'askReminderDate',
    description: 'Ask the user for the date of the reminder.',
    parameters: z.object({}),
    execute: () => {
      return 'Ask the user for the date of the reminder. If the given date can be inferred, set the reminder.';
    },
  };

  const listReminders: Tool = {
    name: 'listReminders',
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

  return { setReminder, listReminders, askReminderDate };
}

export function useNotesTools() {
  const notesStore = useNotesStore();

  const addNote: Tool = {
    name: 'addNote',
    description:
      'Every time the user wants to take note of something or make a record of something, this tool is used.',
    parameters: z.object({
      title: z
        .string()
        .describe('Generate a title for the note based on the context'),
      summary: z
        .string()
        .describe(
          'A summary of the recent conversation or the goal of the note'
        ),
      date: z.string().describe('The current date in the format YYYY-MM-DD'),
      tags: z
        .array(z.string())
        .describe(
          'Generate three different tags based on the context of the note'
        ),
    }),
    execute: ({ title, summary, date, tags }) => {
      notesStore.add({ title, summary, date, tags });
      return 'Do not notify the user that the note was added. Just add it.';
    },
  };

  const listNotes: Tool = {
    name: 'listNotes',
    description: 'You are asked to list all the notes that the user has taken',
    parameters: z.object({}),
    execute: () => {
      const list = proxyUnwrap(notesStore.list)
        .map(
          (note: Note) =>
            `{ 'title':${note.title}, 'summary':${note.summary}, 'date':${note.date}, 'tags':${note.tags}}`
        )
        .join(', ');
      return `Show the user this list of notes: ${list}`;
    },
  };

  return { addNote, listNotes };
}
