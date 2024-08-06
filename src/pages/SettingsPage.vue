<template>
  <div class="row justify-center">
    <q-card
      flat
      bordered
      class="q-pa-md col-12 col-sm-11 col-md-10"
      @keypress.enter="onSave"
    >
      <q-card-section class="q-px-none">
        <div class="text-weight-bold text-capitalize q-py-xs">ApiKey</div>
        <q-input
          v-model="apiKeyReference"
          dense
          outlined
          placeholder="Input your OpenAI api key"
          type="password"
        />
      </q-card-section>
      <q-card-section class="q-px-none">
        <div class="text-weight-bold text-capitalize q-py-xs">
          Chat assistant model
        </div>
        <q-input
          v-model="chatModelRef"
          dense
          outlined
          placeholder="Input what model you want to use for the chat assistant (default: openai:gpt-4o)"
        />
      </q-card-section>
      <q-card-section class="q-px-none">
        <div class="text-weight-bold text-capitalize q-py-xs">
          Search assistant model
        </div>
        <q-input
          v-model="searchModelRef"
          dense
          outlined
          placeholder="Input what model you want to use for the search assistant (default: openai:gpt-4o)"
        />
      </q-card-section>
      <q-card-section class="q-px-none">
        <div class="text-weight-bold text-capitalize q-py-xs">
          Model Temperature
        </div>
        <q-input
          v-model.number="temperatureRef"
          step="0.1"
          type="number"
          dense
          outlined
          placeholder="Type in what temperature setting would you prefer (default: 0.5)"
          hint="0 means almost deterministic results, and higher values mean more randomness."
        />
      </q-card-section>
      <q-card-actions class="row justify-end q-px-none">
        <q-btn unelevated label="Save" color="primary" @click="onSave" />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user-store';
import { Notify } from 'quasar';

const {
  chatModel,
  searchModel,
  apiKey,
  temperature,
  setApiKey,
  setChatModel,
  setSearchModel,
  setTemperature,
} = useUserStore();
const chatModelRef = ref(chatModel);
const searchModelRef = ref(searchModel);
const apiKeyReference = ref('');
const temperatureRef = ref(temperature);

if (!apiKey) {
  Notify.create({
    message:
      'Please, setup a valid openai api key to use the features of this app',
    color: 'warning',
  });
}

function onSave() {
  if (apiKeyReference.value) {
    setApiKey(apiKeyReference.value);
  }
  setChatModel(chatModelRef.value);
  setSearchModel(searchModelRef.value);
  setTemperature(temperatureRef.value);
  Notify.create({
    message:
      'Your settings have been saved successfully. Refresh the page to apply the changes.',
    color: 'positive',
  });
}
</script>
