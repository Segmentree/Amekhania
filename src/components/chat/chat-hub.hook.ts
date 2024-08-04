import { ref } from 'vue';
import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage, tool as toTool } from 'ai';
import { Tool } from '../../models/tool';

type ToolState = 'auto' | 'none' | 'required';

export function useChatHub(
  system = '',
  model = 'gpt-4-turbo',
  backgroundMessages: CoreMessage[] = [],
  tools: Tool[] = []
) {
  const messages = ref(backgroundMessages);

  const toolsToUse = tools.reduce((acc, tool) => {
    acc[`${tool.name}`] = toTool({
      description: tool.description,
      parameters: tool.parameters,
      execute: async (args) => tool.execute && tool.execute(args),
    });
    return acc;
  }, {} as { [key: string]: any });

  async function askQuestion(
    userQuestion: string,
    toolChoice: ToolState = 'auto'
  ) {
    messages.value.push({ role: 'user', content: userQuestion });
    const result = await streamText({
      model: openai(model),
      system: system,
      messages: messages.value,
      tools: toolsToUse,
      async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        console.log({ text, toolCalls, toolResults, finishReason, usage });
        if (toolResults)
          for (const { result } of toolResults) {
            if (result) {
              await askQuestion(result, 'none');
            }
          }
      },
      toolChoice,
    });

    const hasNext = await result.textStream[Symbol.asyncIterator]().next();
    if (hasNext.value) {
      const lastIdx = messages.value.push({role: 'assistant', content: ''}) - 1;
      for await (const chunk of result.textStream) {
        messages.value[lastIdx].content += chunk;
      }
    }
  }

  return { messages, askQuestion };
}
