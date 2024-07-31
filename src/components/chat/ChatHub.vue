<template>
  <div class="chat-container">
    <q-card
      bordered
      class="rounded-borders shadow-0 full-width full-height q-pa-md"
    >
      <q-scroll-area
        ref="scrollAreaRef"
        class="messages-box"
        @scroll="onScrollChange"
      >
        <q-card
          bordered
          flat
          class="bg-blue-5 q-pa-md q-mt-md text-white text-weight-bold"
          v-for="(entrance, idx) in conversation"
          :key="`response-${idx}`"
        >
          {{ entrance }}
        </q-card>
      </q-scroll-area>
    </q-card>
    <q-input
      class="bg-white q-mt-md"
      dense
      outlined
      v-model="inputValue"
      @keypress.enter="onSend"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useChatHub } from './chat-hub.hook';
import { CoreMessage } from 'ai';
import { Tool } from '../../models/tool';

interface ChatHubProps {
  system?: string;
  model?: string;
  backgroundMessages?: CoreMessage[];
  tools?: Tool[];
}

const props = defineProps<ChatHubProps>();
const scrollAreaRef = ref();
const scrollAreaSize = ref(0);
const inputValue = ref('');

const { conversation, askQuestion } = useChatHub(
  props.system,
  props.model,
  props.backgroundMessages,
  props.tools
);

function onSend() {
  askQuestion(inputValue.value);
  inputValue.value = '';
}

function onScrollChange() {
  if (scrollAreaRef.value.getScroll().verticalSize === scrollAreaSize.value)
    return;

  const vertical = scrollAreaRef.value.getScroll().verticalSize;
  scrollAreaRef.value.setScrollPosition('vertical', vertical);
  scrollAreaSize.value = vertical;
}
</script>

<style lang="scss">
.chat-container {
  width: 100%;
  height: 83vh;
}

.messages-box {
  width: 100%;
  height: 100%;
}
</style>
