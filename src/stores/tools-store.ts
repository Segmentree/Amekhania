import { defineStore } from 'pinia';
import {
  createHash,
  getFromLocalStorage,
  setToLocalStorage,
  projectContext,
} from '../tools/helpers';
import { Tool, CustomTool } from '../models/tool';
import { z } from 'zod';

function toUsableTool(tool: CustomTool): Tool {
  const ctx = projectContext();
  return {
    name: tool.name,
    description: tool.description,
    parameters: z.object(
      tool.parameters.reduce((acc, param) => {
        acc[param.name] = z.string().describe(param.description);
        return acc;
      }, {} as { [key: string]: z.ZodString })
    ),
    execute: async (args) => {
      const argsNames = tool.parameters.map((param) => param.name) as string[];
      const argsValues = tool.parameters.map(
        (param) => args[param.name]
      ) as string[];
      const fn = new Function(...argsNames, tool.body).bind(ctx);
      const result = await fn.call(ctx, ...argsValues);
      return result;
    },
  };
}

export const useToolsStore = defineStore('tools', {
  state: () => ({
    tools: getFromLocalStorage<CustomTool>('tools'),
  }),
  getters: {
    list: (state) => Object.values(state.tools).map(toUsableTool),
    listWithCode: (state) =>
      Object.keys(state.tools).map((key) => ({ key, ...state.tools[key] })),
    entry: (state) => (key: string) => state.tools[key],
    byName: (state) => (name: string) => {
      const tool = Object.values(state.tools).find(
        (tool) => tool.name === name
      );
      return tool ? toUsableTool(tool) : undefined;
    },
  },
  actions: {
    add(tool: CustomTool) {
      const date = new Date().toISOString().toString();
      const key = createHash(tool.name + date);
      this.tools[key] = tool;
      setToLocalStorage('tools', this.tools);
    },
    remove(key: string) {
      delete this.tools[key];
      setToLocalStorage('tools', this.tools);
    },
    update(key: string, tool: CustomTool) {
      this.tools[key] = tool;
      setToLocalStorage('tools', this.tools);
    },
  },
});
