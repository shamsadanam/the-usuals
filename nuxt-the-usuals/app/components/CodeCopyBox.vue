<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  code: string;
  lang?: string;
  title?: string;
}>();

const { copy, copied } = useClipboard({ source: () => props.code });

const handleCopy = async () => {
  await copy(props.code);
};
</script>

<template>
  <div class="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden font-mono text-xs my-4 shadow-lg">
    <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 text-gray-400 font-sans">
      <span class="text-xs font-medium text-gray-300">{{ title || lang || 'Code' }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-gray-800 hover:bg-gray-700 hover:text-white border border-gray-700/80 transition-colors"
        :class="{ 'text-emerald-400 border-emerald-500/40': copied }"
        @click="handleCopy"
      >
        <span v-if="copied" class="font-bold">✓</span>
        <span>{{ copied ? "Copied" : "Copy Code" }}</span>
      </button>
    </div>
    <div class="p-4 overflow-x-auto text-gray-200 leading-relaxed whitespace-pre font-mono">
      <code>{{ code }}</code>
    </div>
  </div>
</template>
