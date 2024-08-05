import { ref, computed } from 'vue';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z, ZodObject } from 'zod';

export function useAISearch(
  system = ref(''),
  model = 'gpt-4o',
  schema: ZodObject<any> = z.object({})
) {
  const result = ref({});
  const fullSystem = computed(
    () => 'Always use the user prompt as a search query.' + system.value
  );
  const loading = ref(false);

  async function search(searchQuery = 'all') {
    loading.value = true;

    if (!searchQuery) {
      result.value = {};
      loading.value = false;
      return;
    }

    const filter = await generateObject({
      model: openai(model),
      system: fullSystem.value,
      prompt: searchQuery,
      schema,
    });

    result.value = filter.object.result;
    loading.value = false;
  }

  return { search, result, loading };
}
