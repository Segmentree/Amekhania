import { defineStore } from 'pinia';
import { getFromLocalStorage, setToLocalStorage } from '../tools/helpers';
import { ChatMessage } from 'src/models/tool';

export const useChatStore = defineStore('chat', {
  state: () => ({
    chat: getFromLocalStorage<ChatMessage[]>('chat') as {
      messages: ChatMessage[];
    },
  }),
  getters: {
    messages: (state) => state.chat?.messages || [],
  },
  actions: {
    setMessages(messages: ChatMessage[]) {
      this.chat.messages = messages;
      setToLocalStorage<ChatMessage[]>('chat', this.chat);
    },
  },
});
