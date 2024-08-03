<template>
  <div>
    <div class="q-mb-xs">
      <q-input dense outlined v-model="functionName" />
    </div>
    <div class="q-mb-sm">
      <q-input
        dense
        outlined
        v-model="functionDescription"
        placeholder="Describe when your tool will be used"
      />
    </div>
    <div class="row items-center q-gutter-xs">
      <q-card
        flat
        bordered
        class="q-mb-sm row items-center q-pa-sm"
        v-for="(parameter, i) in parameters"
        :key="`parameter-${i}`"
      >
        <div class="row items-center q-gutter-xs q-mr-sm">
          <div class="text-weight-bold text-orange-9">Name:</div>
          <div>
            {{ parameter.name }}
          </div>
        </div>
        <div class="row items-center q-gutter-xs">
          <div class="text-weight-bold text-orange-9">Description:</div>
          <div>
            {{ parameter.description }}
          </div>
        </div>
        <q-btn
          size="sm"
          flat
          round
          color="red"
          icon="delete"
          @click="onRemoveParameter(i)"
        />
      </q-card>
    </div>
    <div
      class="row q-gutter-xs q-mb-xs"
      @keypress.enter="
        newParameterName && newParameterDescription && onAddParameter()
      "
    >
      <q-input
        v-model="newParameterName"
        class="col"
        dense
        outlined
        placeholder="parameter name"
      />
      <q-input
        v-model="newParameterDescription"
        class="col"
        dense
        outlined
        placeholder="parameter description"
      />
      <q-btn
        :disabled="!newParameterName || !newParameterDescription"
        unelevated
        color="primary"
        label="Add"
        @click="onAddParameter"
      />
    </div>

    <div v-if="editorActive" id="javascript" class="editor" />
    <div class="row justify-end q-mt-sm q-gutter-xs">
      <q-input
        v-for="(param, i) in parameters"
        :key="`testedParam-${i}`"
        v-model="param.value"
        dense
        outlined
        :placeholder="param.name"
      />
      <q-btn unelevated color="primary" label="Run" @click="onExecute" />
      <q-btn unelevated color="secondary" label="Save" @click="onSave" />
    </div>

    <q-card class="q-mt-sm" flat bordered>
      <q-card-section class="text-h6"> Result: </q-card-section>
      <q-card-section>
        {{ functionResult }}
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useToolsLab } from './tools-lab.hook';

const editorActive = ref(true);
const {
  functionName,
  functionDescription,
  parameters,
  saveTool,
  initEditor,
  execute,
  addParameter,
  removeParameter,
} = useToolsLab();
const newParameterName = ref('');
const newParameterDescription = ref('');
const functionResult = ref('');

async function onRestartEditor() {
  editorActive.value = false;
  await nextTick();
  editorActive.value = true;
  await nextTick();
}

async function onAddParameter() {
  addParameter(newParameterName.value, newParameterDescription.value);
  newParameterName.value = '';
  newParameterDescription.value = '';
  await onRestartEditor();
  initEditor();
}

async function onRemoveParameter(index: number) {
  removeParameter(index);
  await onRestartEditor();
  initEditor();
}

function onExecute() {
  functionResult.value = execute();
}

function onSave() {
  if (functionName.value && functionDescription.value) {
    saveTool();
  }
}

onMounted(() => {
  initEditor();
});

watch(functionName, async () => {
  await onRestartEditor();
  initEditor();
});
</script>

<style lang="sass">
.editor
  height: 30vh
</style>
