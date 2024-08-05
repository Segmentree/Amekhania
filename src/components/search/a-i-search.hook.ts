import { ref, computed } from 'vue';
import { generateObject } from 'ai';
import { z, ZodObject } from 'zod';
import { useUserStore } from 'src/stores/user-store';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

export function useAISearch(
  system = ref(''),
  model?: string,
  schema: ZodObject<any> = z.object({})
) {
  const result = ref({});
  const fullSystem = computed(
    () => 'Always use the user prompt as a search query.' + system.value
  );
  const loading = ref(false);
  const { registry, searchModel } = useUserStore();
  const router = useRouter();

  async function search(searchQuery = 'all') {
    loading.value = true;

    if (!searchQuery) {
      result.value = {};
      loading.value = false;
      return;
    }

    try {
      const filter = await generateObject({
        model: registry.languageModel(model || searchModel || 'openai:gpt-4o'),
        system: fullSystem.value,
        prompt: searchQuery,
        schema,
      });

      result.value = filter.object.result;
      loading.value = false;
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

  return { search, result, loading };
}
