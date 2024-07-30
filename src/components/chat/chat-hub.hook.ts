import { ref, Ref } from 'vue';
import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage, tool } from 'ai';
import { useRemindersTools } from '../../tools/chat-functions';

type ToolState = 'auto' | 'none' | 'required';

export function useChatHub(
  system = '',
  model = 'gpt-4-turbo',
  backgroundMessages: CoreMessage[] = []
) {
  const userQuestion = ref('');
  const messages = backgroundMessages;
  const conversation: Ref<string[]> = ref([]);

  const { setReminder, listReminders } = useRemindersTools();

  async function askQuestion(toolChoice: ToolState = 'auto') {
    messages.push({ role: 'user', content: userQuestion.value });
    const result = await streamText({
      model: openai(model),
      system: system,
      messages,
      tools: {
        setReminder: tool({
          description: setReminder.description,
          parameters: setReminder.parameters,
          execute: async (args) => setReminder.execute(args),
        }),
        listReminders: tool({
          description: listReminders.description,
          parameters: listReminders.parameters,
          execute: async (args) => listReminders.execute(args),
        }),
      },
      async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
        console.log({ text, toolCalls, toolResults, finishReason, usage });
        if (toolResults)
          for (const { result } of toolResults) {
            if (result != undefined) {
              userQuestion.value = result;
              await askQuestion('none');
            }
          }
      },
      toolChoice,
    });

    const hasNext = await result.textStream[Symbol.asyncIterator]().next();
    if (hasNext.value) {
      conversation.value.push('');
      const lastIdx = conversation.value.length - 1;
      for await (const chunk of result.textStream) {
        conversation.value[lastIdx] += chunk;
      }
    }

    result.text.then((text) => {
      if (text) messages.push({ role: 'assistant', content: text });
    });

    userQuestion.value = '';
  }

  return { conversation, userQuestion, askQuestion };
}
