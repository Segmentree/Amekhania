import { ref, Ref } from 'vue';
import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai';

export function useChatHub(
  system = '',
  model = 'gpt-4-turbo',
  backgroundMessages: CoreMessage[] = []
) {
  const userQuestion = ref('');
  const messages = backgroundMessages;
  const conversation: Ref<string[]> = ref([]);

  async function askQuestion() {
    messages.push({ role: 'user', content: userQuestion.value });
    conversation.value.push('');
    const result = await streamText({
      model: openai(model),
      system: system,
      messages,
    });

    for await (const chunk of result.textStream) {
      conversation.value[conversation.value.length - 1] += chunk;
    }

    result.text.then((text) => {
      messages.push({ role: 'assistant', content: text });
    });

    userQuestion.value = '';
  }

  return { conversation, userQuestion, askQuestion };
}
