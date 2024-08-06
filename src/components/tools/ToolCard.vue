<template>
  <q-card flat bordered>
    <q-card-section class="text-h6">
      {{ tool.name }}
    </q-card-section>
    <q-card-section>
      <div class="text-weight-bold">Scenario description</div>
      {{ tool.description }}
    </q-card-section>
    <q-card-section>
      <div class="row justify-end q-mt-sm">
        <q-btn
          size="sm"
          flat
          round
          color="orange"
          icon="edit"
          @click="$emit('edit', tool.key)"
        />
        <q-btn
          size="sm"
          flat
          round
          color="red"
          icon="delete"
          @click="$emit('remove', tool.key)"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { CustomTool } from '../../models/tool';

interface ToolCardProps {
  tool: CustomTool & { key: string };
}

defineProps<ToolCardProps>();
</script>
