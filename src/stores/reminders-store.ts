import { defineStore } from 'pinia';
import {
  createHash,
  getFromLocalStorage,
  setToLocalStorage,
} from '../tools/helpers';
import { Reminder } from '../models/reminder';
import { format } from '@formkit/tempo';

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    reminders: getFromLocalStorage<Reminder>('reminders'),
  }),
  getters: {
    list: (state) => Object.values(state.reminders),
    listWithKeys: (state) =>
      Object.entries(state.reminders).map(([key, value]) => ({
        key,
        summary: value.summary,
        date: value.date,
      })),
    entry: (state) => (key: string) => state.reminders[key],
    byDate: (state) => (date: string) =>
      Object.values(state.reminders).filter(
        (reminder) => new Date(reminder.date) === new Date(date)
      ),
    byYear: (state) => (year: number) =>
      Object.values(state.reminders).filter(
        (reminder) => new Date(reminder.date).getFullYear() === year
      ),
  },
  actions: {
    add(reminder: Reminder) {
      const key = createHash(`${reminder.summary}-${reminder.date}`);
      this.reminders[key] = {
        ...reminder,
        date: format(reminder.date, 'full'),
      };
      setToLocalStorage('reminders', this.reminders);
    },
    remove(key: string) {
      delete this.reminders[key];
      setToLocalStorage('reminders', this.reminders);
    },
    update(key: string, summary?: string, date?: string) {
      if (summary) {
        this.reminders[key].summary = summary;
      }
      if (date) {
        this.reminders[key].date = format(date, 'full');
      }
      setToLocalStorage('reminders', this.reminders);
    },
  },
});
