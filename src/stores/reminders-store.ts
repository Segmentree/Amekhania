import { defineStore } from 'pinia';
import sha256 from 'crypto-js/sha256';
import { Reminder } from '../models/reminder';

function getReminders() {
  return (
    localStorage.getItem('reminders') !== null
      ? JSON.parse(localStorage.getItem('reminders')!)
      : {}
  ) as { [key: string]: Reminder };
}

function setReminders(reminders: { [key: string]: Reminder }) {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}

function createHash(key: string) {
  return sha256(key).toString();
}

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    reminders: getReminders(),
  }),
  getters: {
    list: (state) => Object.values(state.reminders),
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
    add(reminder: { summary: string; date: string }) {
      const key = createHash(`${reminder.summary}-${reminder.date}`);
      this.reminders[key] = reminder;
      setReminders(this.reminders);
    },
    remove(key: string) {
      delete this.reminders[key];
      setReminders(this.reminders);
    },
    update(key: string, summary?: string, date?: string) {
      if (summary) {
        this.reminders[key].summary = summary;
      }
      if (date) {
        this.reminders[key].date = date;
      }
      setReminders(this.reminders);
    },
  },
});
