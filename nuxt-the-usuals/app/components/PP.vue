<!--
/**
 * @fileoverview PP (Pretty Print) Component - A debug utility component for displaying formatted data.
 * This component renders any data structure as a collapsible, pretty-printed JSON view.
 * 
 * @component
 * 
 * Props:
 * @prop {any} data - The data to be pretty-printed. Can be any serializable value.
 * @prop {boolean} [open=true] - Whether the details element should be open by default.
 * 
 * Computed Properties:
 * @computed prettyData - Converts the data prop into a pretty-printed JSON string.
 *                        Handles primitives and complex objects gracefully with error handling.
 *                        Returns a formatted JSON string or error message.
 */
-->

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  data: any;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: true,
});

const prettyData = computed(() => {
  // Handle primitives (string, number, boolean, null, undefined) gracefully
  if (
    typeof props.data === "string" ||
    typeof props.data === "number" ||
    typeof props.data === "boolean" ||
    props.data === null ||
    props.data === undefined
  ) {
    return JSON.stringify(props.data, null, 2); // the “2” adds indentation;
  }

  // Handle objects/arrays
  try {
    // JSON.stringify(value, replacer, space)
    // The '2' is for 2-space indentation (pretty-printing)
    return JSON.stringify(props.data, null, 2);
  } catch (e) {
    console.error("Error pretty printing data:", e);
    return "Error: Cannot stringify data.";
  }
});
</script>

<template>
  <div class="my-4 w-full">
    <ClientOnly>
      <details class="mt-8" :open="props.open">
        <summary class="cursor-pointer text-sm text-gray-500">
          Debug Data
        </summary>
        <pre
          class="font-monospace small overflow-auto rounded bg-[#333] p-16 text-white"
          style="max-height: 24rem; white-space: pre"
        >
        {{ prettyData }}
      </pre
        >
      </details>
    </ClientOnly>
  </div>
</template>
