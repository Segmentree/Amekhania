import { defineStore } from 'pinia';
import {
  createHash,
  getFromLocalStorage,
  setToLocalStorage,
} from '../tools/helpers';
import { Tool, CustomTool } from '../models/tool';
import { z } from 'zod';

function toUsableTool(tool: CustomTool): Tool {
  return {
    name: tool.name,
    description: tool.description,
    parameters: z.object(
      tool.parameters.reduce((acc, param) => {
        acc[param.name] = z.string().describe(param.description);
        return acc;
      }, {} as { [key: string]: z.ZodString })
    ),
    execute: (args) => {
      const argsNames = tool.parameters.map((param) => param.name) as string[];
      const argsValues = tool.parameters.map(
        (param) => args[param.name]
      ) as string[];
      const fn = new Function(...argsNames, tool.body);
      return fn.call(null, ...argsValues);
    },
  };
}

export const useToolsStore = defineStore('tools', {
  state: () => ({
    tools: getFromLocalStorage<CustomTool>('tools'),
  }),
  getters: {
    list: (state) => Object.values(state.tools).map(toUsableTool),
    entry: (state) => (key: string) => toUsableTool(state.tools[key]),
    byName: (state) => (name: string) => {
      const tool = Object.values(state.tools).find(
        (tool) => tool.name === name
      );
      return tool ? toUsableTool(tool) : undefined;
    },
  },
  actions: {
    add(tool: CustomTool) {
      const key = createHash(tool.name);
      this.tools[key] = tool;
      setToLocalStorage('tools', this.tools);
    },
    remove(key: string) {
      delete this.tools[key];
      setToLocalStorage('tools', this.tools);
    },
  },
});
