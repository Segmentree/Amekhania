import { defineStore } from 'pinia';
import {
  createHash,
  getFromLocalStorage,
  setToLocalStorage,
} from '../tools/helpers';
import { Note } from '../models/note';
import { format } from '@formkit/tempo';

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: getFromLocalStorage<Note>('notes'),
  }),
  getters: {
    list: (state) => Object.values(state.notes),
    listWithKeys: (state) =>
      Object.entries(state.notes).map(([key, value]) => ({
        key,
        title: value.title,
        summary: value.summary,
        date: value.date,
      })),
    entry: (state) => (key: string) => state.notes[key],
    byTitle: (state) => (title: string) =>
      Object.values(state.notes).filter((note) => note.title === title),
  },
  actions: {
    add(note: Note) {
      const key = createHash(`${note.title}-${note.date}`);
      this.notes[key] = { ...note, date: format(note.date, 'full') };
      setToLocalStorage('notes', this.notes);
    },
    remove(key: string) {
      delete this.notes[key];
      setToLocalStorage('notes', this.notes);
    },
    update(key: string, title?: string, summary?: string, date?: string) {
      if (title) {
        this.notes[key].title = title;
      }
      if (summary) {
        this.notes[key].summary = summary;
      }
      if (date) {
        this.notes[key].date = format(date, 'full');
      }
      setToLocalStorage('notes', this.notes);
    },
  },
});
