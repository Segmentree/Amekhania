<template>
  <div>
    <q-input
      dense
      outlined
      v-model="searchValue"
      placeholder="Type a search criteria"
      :loading="loading"
      @keypress.enter="search(searchValue)"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, toRef } from 'vue';
import { useAISearch } from './a-i-search.hook';
import { ZodObject } from 'zod';

interface AiSearchProps {
  system?: string;
  model?: string;
  schema?: ZodObject<any>;
}

const props = defineProps<AiSearchProps>();
const emit = defineEmits(['change']);

const searchValue = ref('');
const { result, loading, search } = useAISearch(
  toRef(() => props.system || ''),
  props.model,
  props.schema
);

watch(result, (newValue) => emit('change', newValue));
watch(
  () => props.system,
  () => search(searchValue.value)
);
</script>
