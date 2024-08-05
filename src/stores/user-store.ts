import { defineStore } from 'pinia';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';
import { getFromLocalStorage, setToLocalStorage } from '../tools/helpers';

export const useUserStore = defineStore('user', {
  state: () => ({
    settings: getFromLocalStorage<string>('user') as {
      apiKey: string;
      chatModel: string;
      searchModel: string;
    },
  }),
  getters: {
    registry: (state) => {
      return createProviderRegistry({
        // register provider with prefix and default setup:
        anthropic,

        // register provider with prefix and custom setup:
        openai: createOpenAI({
          apiKey: state.settings?.apiKey,
        }),
      });
    },
    chatModel: (state) => state.settings?.chatModel,
    searchModel: (state) => state.settings?.searchModel,
    apiKey: (state) => state.settings?.apiKey,
  },
  actions: {
    setApiKey(apiKey: string) {
      this.settings.apiKey = apiKey;
      setToLocalStorage('user', this.settings);
    },
    setChatModel(model: string) {
      this.settings.chatModel = model;
      setToLocalStorage('user', this.settings);
    },
    setSearchModel(model: string) {
      this.settings.searchModel = model;
      setToLocalStorage('user', this.settings);
    },
  },
});
