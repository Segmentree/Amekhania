import { ref, Ref } from 'vue';
import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage, tool } from 'ai';
import { useRemindersTools } from '../../tools/chat-functions';

export function useChatHub(
  system = '',
  model = 'gpt-4-turbo',
  backgroundMessages: CoreMessage[] = []
) {
  const userQuestion = ref('');
  const messages = backgroundMessages;
  const conversation: Ref<string[]> = ref([]);

  const { setReminder, listReminders } = useRemindersTools();

  async function askQuestion() {
    messages.push({ role: 'user', content: userQuestion.value });

    const result = await streamText({
      model: openai(model),
      system: system,
      messages,
      tools: {
        setReminder: tool({
          description: setReminder.description,
          parameters: setReminder.parameters,
          execute: async (args) => {
            setReminder.execute(askQuestion, userQuestion, args);
          },
        }),
        listReminders: tool({
          description: listReminders.description,
          parameters: listReminders.parameters,
          execute: async (args) => {
            listReminders.execute(askQuestion, userQuestion, args);
          },
        }),
      },
    });

    const hasNext = await result.textStream[Symbol.asyncIterator]().next();
    if (hasNext.value) {
      conversation.value.push('');
      for await (const chunk of result.textStream) {
        conversation.value[conversation.value.length - 1] += chunk;
      }
    }

    result.text.then((text) => {
      if (text) messages.push({ role: 'assistant', content: text });
    });

    userQuestion.value = '';
  }

  return { conversation, userQuestion, askQuestion };
}
