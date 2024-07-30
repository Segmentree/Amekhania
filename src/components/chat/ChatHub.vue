<template>
  <div class="chat-container">
    <q-card
      bordered
      class="q-pa-md rounded-borders shadow-0 full-width full-height"
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
    <q-page-sticky expand position="bottom">
      <div class="q-pa-md full-width">
        <q-input
          class="full-width bg-white"
          dense
          outlined
          v-model="userQuestion"
          @keypress.enter="askQuestion"
        />
      </div>
    </q-page-sticky>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useChatHub } from './chat-hub.hook';
import { CoreMessage } from 'ai';

interface ChatHubProps {
  system?: string;
  model?: string;
  backgroundMessages?: CoreMessage[];
}

const props = defineProps<ChatHubProps>();
const scrollAreaRef = ref();
const scrollAreaSize = ref(0);

const { conversation, userQuestion, askQuestion } = useChatHub(
  props.system,
  props.model,
  props.backgroundMessages
);

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
