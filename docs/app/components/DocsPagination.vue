<script setup lang="ts">
import { useDocsNav } from "../composables/useDocsNav";

const props = defineProps<{
  currentPath: string;
}>();

const { getSurround } = useDocsNav();
const surround = computed(() => getSurround(props.currentPath));
</script>

<template>
  <div
    v-if="surround.prev || surround.next"
    class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 mt-12 border-t border-[#e2e2e3] dark:border-[#2e2e32] font-sans"
  >
    <!-- Previous Link Card -->
    <div v-if="surround.prev" class="flex flex-col">
      <NuxtLink
        :to="surround.prev.path"
        class="group p-4 rounded-xl border border-[#e2e2e3] dark:border-[#2e2e32] hover:border-[#646cff]/40 dark:hover:border-[#a8b1ff]/40 bg-[#f6f6f7]/60 dark:bg-[#202127]/60 hover:bg-[#f6f6f7] dark:hover:bg-[#202127] transition-all flex flex-col gap-1.5 cursor-pointer"
      >
        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#90a4ae] dark:text-[#98989f] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors">
          <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </div>
        <div class="text-base font-bold text-[#213547] dark:text-[#dfdfd6] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors truncate">
          {{ surround.prev.title }}
        </div>
      </NuxtLink>
    </div>
    <div v-else />

    <!-- Next Link Card -->
    <div v-if="surround.next" class="flex flex-col sm:items-end">
      <NuxtLink
        :to="surround.next.path"
        class="group p-4 rounded-xl border border-[#e2e2e3] dark:border-[#2e2e32] hover:border-[#646cff]/40 dark:hover:border-[#a8b1ff]/40 bg-[#f6f6f7]/60 dark:bg-[#202127]/60 hover:bg-[#f6f6f7] dark:hover:bg-[#202127] transition-all flex flex-col sm:items-end gap-1.5 w-full cursor-pointer"
      >
        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#90a4ae] dark:text-[#98989f] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors">
          <span>Next</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div class="text-base font-bold text-[#213547] dark:text-[#dfdfd6] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors truncate">
          {{ surround.next.title }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
