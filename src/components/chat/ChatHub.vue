<template>
  <div class="chat-container">
    <q-card class="rounded-borders shadow-0 full-width full-height q-pa-md">
      <q-scroll-area
        ref="scrollAreaRef"
        class="messages-box"
        @scroll="onScrollChange"
      >
        <div
          class="row full-width"
          v-for="(entrance, idx) in visibleMessages"
          :key="`response-${idx}`"
          :class="
            entrance.role == 'assistant' ? 'justify-start' : 'justify-end'
          "
        >
          <q-card
            flat
            class="q-pa-md q-mt-md chat-card"
            :class="
              entrance.role == 'assistant'
                ? 'text-white bg-blue-10'
                : 'bg-blue-grey-1'
            "
          >
            <q-markdown
              content-style="background-color: transparent"
              :src="entrance.content"
            />
          </q-card>
        </div>
      </q-scroll-area>
    </q-card>
    <div class="row justify-center">
      <q-input
        class="q-mt-md chat-card"
        filled
        v-model="inputValue"
        @keypress.enter="onSend"
      >
        <template v-slot:append>
          <q-btn
            round
            size="sm"
            @click="onSend"
            :disable="!inputValue"
            icon="keyboard_double_arrow_up"
            color="blue-10"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
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

const { messages, askQuestion } = useChatHub(
  props.system,
  props.model,
  props.tools
);

if (!messages.value.length)
  askQuestion(
    `
              With a little bit of creativity, greet the user and provide a short explanation of what they can do in the app
              They can discuss, make plans and brainstorn with you and then
              set reminders, save messages as notes and build their own ai tools`,
    'auto',
    true
  );

const visibleMessages = computed(() => {
  return messages.value.filter((message) => !message.internal);
});

function onSend() {
  if (inputValue.value) {
    askQuestion(inputValue.value);
    inputValue.value = '';
  }
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

.chat-card {
  width: 90%;
  padding-bottom: 0;
  border-radius: 15px;
  max-width: 70vw;
}

.messages-box {
  width: 100%;
  height: 100%;
}

pre {
  color: white !important;
  background: #212121 !important;
}

.q-markdown--line-numbers {
  color: white !important;
  background: #212121 !important;
}
.q-markdown--line-numbers-wrapper {
  background: #212121 !important;
}
</style>
