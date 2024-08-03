import { ref, Ref } from 'vue';
import * as monaco from 'monaco-editor';
// @ts-ignore
import { constrainedEditor } from 'constrained-editor-plugin';
import { CustomParameter, CustomTool } from '../models/tool';
import { useToolsStore } from '../stores/tools-store';

export function useToolsLab() {
  const restrictions = ref([] as any[]);
  const functionName = ref('myCustomToolMethod');
  const functionDescription = ref('');
  const toolMethodBody = ref('\t// Enter the content for the function here');
  const parameters: Ref<CustomParameter[]> = ref([]);
  const { add: AddTool } = useToolsStore();

  function useParameters() {
    if (!parameters.value.length) return '';
    return parameters.value.reduce((acc, param) => {
      acc += `${acc ? ',' : ''}${param.name}`;
      return acc;
    }, '');
  }

  function toolMethodWrapper(body: string) {
    return `function ${functionName.value}(${useParameters()}){\n${body}\n}`;
  }

  function execute() {
    try {
      const argsNames = parameters.value.map((param) => param.name) as string[];
      const argsValues = parameters.value.map(
        (param) => param.value
      ) as string[];
      const fn = new Function(...argsNames, toolMethodBody.value);
      return fn.call(null, ...argsValues);
    } catch (e) {
      console.error(e);
    }
  }

  function initEditor() {
    const javascriptEditorContainer = document.getElementById('javascript');
    try {
      const currentCode = toolMethodWrapper(toolMethodBody.value);
      const lastLine = currentCode.split('\n').length;
      if (javascriptEditorContainer) {
        const javascriptEditor = monaco.editor.create(
          javascriptEditorContainer,
          {
            value: currentCode,
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
          }
        );

        const constrainedInstance = constrainedEditor(monaco);
        const model = javascriptEditor.getModel();
        constrainedInstance.initializeIn(javascriptEditor);
        restrictions.value.push({
          range: [2, 1, lastLine, 1],
          allowMultiline: true,
        });

        constrainedInstance.addRestrictionsTo(model, restrictions.value);

        javascriptEditor.onDidChangeModelContent(() => {
          const newContent = javascriptEditor.getValue();
          const firstBracketIdx = newContent.indexOf('\n');
          const lastBracketIdx = newContent.lastIndexOf('\n');
          toolMethodBody.value = newContent.substring(
            firstBracketIdx + 1,
            lastBracketIdx
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function addParameter(name: string, description: string) {
    parameters.value.push({ name, description, value: '' });
  }

  function removeParameter(index: number) {
    parameters.value.splice(index, 1);
  }

  function saveTool() {
    const newTool: CustomTool = {
      name: functionName.value,
      description: functionDescription.value,
      parameters: parameters.value,
      body: toolMethodBody.value,
    };
    AddTool(newTool);
  }

  return {
    functionName,
    functionDescription,
    parameters,
    saveTool,
    initEditor,
    execute,
    addParameter,
    removeParameter,
  };
}
