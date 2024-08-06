<template>
  <div>
    <Teleport v-if="mountDrawerList" to="#right-drawer-content">
      <tool-card
        class="q-mb-xs"
        v-for="(tool, i) in listWithCode"
        @edit="onEdit"
        @remove="onRemove"
        :key="`tool-${i}`"
        :tool="tool"
      />
    </Teleport>
    <div class="row justify-end">
      <q-btn
        class="q-mb-xs q-mx-xs"
        unelevated
        color="secondary"
        label="Reset"
        @click="onReset"
      />
      <q-btn
        class="q-mb-xs"
        unelevated
        color="primary"
        label="Tools list"
        @click="$emit('change-right-drawer')"
      />
    </div>
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
      <q-btn
        v-if="editingTool"
        unelevated
        color="secondary"
        label="Update"
        @click="onUpdate"
      />
      <q-btn
        unelevated
        color="secondary"
        :label="editingTool ? 'Save as New' : 'Save'"
        @click="onSave"
      />
      <q-btn unelevated color="primary" label="Run" @click="onExecute" />
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
import { ref, Ref, onMounted, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useToolsLab } from './tools-lab.hook';
import { useToolsStore } from 'src/stores/tools-store';
import { Notify } from 'quasar';
import ToolCard from 'src/components/tools/ToolCard.vue';

const mountDrawerList = ref(false);
const editorActive = ref(true);
const { remove, update } = useToolsStore();
const { listWithCode, entry } = storeToRefs(useToolsStore());

const {
  functionName,
  functionDescription,
  parameters,
  toolMethodBody,
  reset,
  saveTool,
  initEditor,
  execute,
  addParameter,
  removeParameter,
} = useToolsLab();
const newParameterName = ref('');
const newParameterDescription = ref('');
const functionResult = ref('');
const editingTool: Ref<string | undefined> = ref();

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

async function onExecute() {
  functionResult.value = await execute();
}

function onEdit(key: string) {
  const tool = entry.value(key);
  functionName.value = tool.name;
  functionDescription.value = tool.description;
  toolMethodBody.value = tool.body;
  parameters.value = tool.parameters;
  editingTool.value = key;
}

function onRemove(key: string) {
  remove(key);
  Notify.create({
    message: 'Tool removed',
    color: 'positive',
  });
}

function onSave() {
  if (functionName.value && functionDescription.value) {
    saveTool();
    Notify.create({
      message: 'Tool saved',
      color: 'positive',
    });
  } else {
    Notify.create({
      message: 'Name and description are required',
      color: 'negative',
    });
  }
}

function onUpdate() {
  if (functionName.value && functionDescription.value) {
    update(editingTool.value as string, {
      name: functionName.value,
      description: functionDescription.value,
      body: toolMethodBody.value,
      parameters: parameters.value,
    });
    Notify.create({
      message: 'Tool updated',
      color: 'positive',
    });
  } else {
    Notify.create({
      message: 'Name and description are required',
      color: 'negative',
    });
  }
}

function onReset() {
  reset();
  editingTool.value = undefined;
}

onMounted(() => {
  initEditor();
  mountDrawerList.value = true;
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
