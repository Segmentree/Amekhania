import { streamText, CoreMessage } from 'ai';
import { Tool } from 'src/models/tool';
import { getModelTools } from 'src/tools/helpers';
import { useUserStore } from 'src/stores/user-store';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import { useChatStore } from 'src/stores/chat-store';
import { ref } from 'vue';
import { Ref } from 'vue';

type ToolState = 'auto' | 'none' | 'required';

interface ChatMessage {
  internal?: boolean;
  role: 'user' | 'assistant' | 'tool';
  content: string;
}

export function useChatHub(system = '', model?: string, tools: Tool[] = []) {
  const chatStore = useChatStore();
  const messages = ref(chatStore.messages) as Ref<ChatMessage[]>;
  const { registry, chatModel, temperature } = useUserStore();
  const router = useRouter();

  async function askQuestion(
    userQuestion: string,
    toolChoice: ToolState = 'auto',
    internal = false
  ) {
    messages.value.push({
      role: 'user',
      content: userQuestion,
      internal: internal,
    } as ChatMessage);

    try {
      const result = await streamText({
        model: registry.languageModel(model || chatModel || 'openai:gpt-4o'),
        system: system,
        messages: messages.value as CoreMessage[],
        temperature: Number(temperature),
        tools: getModelTools(tools),
        async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
          console.log({ text, toolCalls, toolResults, finishReason, usage });
          if (toolResults)
            for (const { result } of toolResults) {
              if (result) {
                await askQuestion(result, 'none', true);
              }
            }
        },
        toolChoice,
      });

      const hasNext = await result.textStream[Symbol.asyncIterator]().next();
      if (hasNext.value) {
        const lastIdx =
          messages.value.push({ role: 'assistant', content: '' }) - 1;
        for await (const chunk of result.textStream) {
          messages.value[lastIdx].content += chunk;
        }
      }
    } catch (e: any) {
      if (e.message.includes('Incorrect API key')) {
        Notify.create({
          message: 'Incorrect API key please update it in settings',
          color: 'negative',
        });
        router.push({ name: 'UserSettings' });
      } else {
        console.error(e);
      }
    }
  }

  return { messages, askQuestion };
}
