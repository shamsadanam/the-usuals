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
  <div
    class="rounded-xl border border-[#e2e2e3] dark:border-[#2e2e32] bg-[#161618] text-[#dfdfd6] overflow-hidden font-mono my-6 shadow-xs"
  >
    <!-- Code Box Header -->
    <div
      class="flex items-center justify-between px-4 py-2.5 bg-[#f6f6f7] dark:bg-[#202127] border-b border-[#e2e2e3] dark:border-[#2e2e32] text-[#476582] dark:text-[#98989f] font-sans"
    >
      <div class="flex items-center gap-2.5">
        <div class="flex items-center gap-1.5 opacity-60">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
        </div>
        <span class="text-xs font-semibold text-[#213547] dark:text-[#dfdfd6] font-mono ml-1">
          {{ title || lang || "Code" }}
        </span>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-white dark:bg-[#2e2e32] hover:bg-[#f6f6f7] dark:hover:bg-[#38383e] text-[#213547] dark:text-[#dfdfd6] border border-[#e2e2e3] dark:border-[#414853] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#646cff]/40"
        :class="{ 'text-[#3451b2] dark:text-[#a8b1ff] border-[#646cff]/40 dark:border-[#a8b1ff]/40 bg-[#646cff]/10 dark:bg-[#a8b1ff]/15': copied }"
        :title="copied ? 'Copied to clipboard' : 'Copy code to clipboard'"
        @click="handleCopy"
      >
        <svg v-if="copied" class="w-3.5 h-3.5 text-[#3451b2] dark:text-[#a8b1ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-3.5 h-3.5 text-[#90a4ae] dark:text-[#98989f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </div>

    <!-- Code Content -->
    <pre class="p-4 sm:p-5 overflow-x-auto text-[#dfdfd6] leading-relaxed whitespace-pre font-mono text-[14.5px] m-0 bg-transparent! border-0! shadow-none!"><code>{{ code }}</code></pre>
  </div>
</template>
