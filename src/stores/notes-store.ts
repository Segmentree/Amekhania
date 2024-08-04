import { defineStore } from 'pinia';
import {
  createHash,
  getFromLocalStorage,
  setToLocalStorage,
} from '../tools/helpers';
import { Note } from '../models/note';

function updateTags(tags: { [key: string]: boolean }, newTags: string[]) {
  const currentTags = Object.keys(tags).map((tag) => tag.toLowerCase().trim());

  for (const tag of Object.values(newTags)) {
    if (!currentTags.includes(tag.toLowerCase().trim())) {
      tags[tag] = true;
    }
  }

  setToLocalStorage('tags', tags);
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: getFromLocalStorage<Note>('notes'),
    tags: getFromLocalStorage<boolean>('tags'),
  }),
  getters: {
    list: (state) => Object.values(state.notes),
    listWithKeys: (state) =>
      Object.entries(state.notes).map(([key, value]) => ({
        key,
        title: value.title,
        summary: value.summary,
        date: value.date,
        tags: value.tags || [],
      })),
    entry: (state) => (key: string) => state.notes[key],
    byTitle: (state) => (title: string) =>
      Object.values(state.notes).filter((note) => note.title === title),
    tagsList: (state) => Object.keys(state.tags),
  },
  actions: {
    add(note: Note) {
      const key = createHash(`${note.title}-${note.date}`);
      this.notes[key] = note;
      setToLocalStorage('notes', this.notes);
      updateTags(this.tags, note.tags);
    },
    remove(key: string) {
      delete this.notes[key];
      setToLocalStorage('notes', this.notes);
    },
    update(
      key: string,
      title?: string,
      summary?: string,
      date?: string,
      tags?: string[]
    ) {
      if (title) {
        this.notes[key].title = title;
      }
      if (summary) {
        this.notes[key].summary = summary;
      }
      if (date) {
        this.notes[key].date = date;
      }
      if (tags) {
        this.notes[key].tags = tags;
        updateTags(this.tags, tags);
      }
      setToLocalStorage('notes', this.notes);
    },
  },
});
