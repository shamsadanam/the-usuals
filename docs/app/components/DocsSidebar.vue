<script setup lang="ts">
import { useDocsNav, type DocCategory } from "../composables/useDocsNav";

const route = useRoute();
const { categories } = useDocsNav();

const searchQuery = ref("");

const emit = defineEmits<{
  (e: "itemClick"): void;
}>();

const filteredCategories = computed<DocCategory[]>(() => {
  if (!searchQuery.value.trim()) return categories;
  const q = searchQuery.value.trim().toLowerCase();

  return categories
    .map((group) => {
      const filtered = group.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)),
      );
      if (filtered.length > 0) {
        return { ...group, items: filtered };
      }
      return null;
    })
    .filter(Boolean) as DocCategory[];
});

const isItemActive = (itemPath: string) => {
  const currentPath = route.path.replace(/\/$/, "") || "/";
  const targetPath = itemPath.replace(/\/$/, "") || "/";
  return currentPath === targetPath;
};
</script>

<template>
  <div class="flex flex-col h-full font-sans">
    <!-- Search filter input -->
    <div class="mb-5 relative">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#90a4ae] dark:text-[#6a6a71]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter docs..."
          class="w-full pl-9 pr-8 py-2 text-sm bg-[#f6f6f7] dark:bg-[#202127] border border-[#e2e2e3] dark:border-[#2e2e32] rounded-lg text-[#213547] dark:text-[#dfdfd6] placeholder-[#90a4ae] dark:placeholder-[#6a6a71] focus:outline-none focus:ring-2 focus:ring-[#646cff]/40 focus:border-[#646cff] transition-all font-sans"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#90a4ae] hover:text-[#213547] dark:hover:text-[#dfdfd6] cursor-pointer"
          @click="searchQuery = ''"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation Groups -->
    <nav class="space-y-6 flex-1 overflow-y-auto pr-1">
      <div
        v-for="group in filteredCategories"
        :key="group.category"
        class="space-y-1.5"
      >
        <div class="flex items-center justify-between px-2.5 py-1 text-xs font-bold text-[#90a4ae] dark:text-[#6a6a71] uppercase tracking-wider font-mono">
          <span>{{ group.category }}</span>
          <span class="text-xs font-normal text-[#90a4ae] dark:text-[#6a6a71] font-sans">
            {{ group.items.length }}
          </span>
        </div>

        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all cursor-pointer"
              :class="[
                isItemActive(item.path)
                  ? 'bg-[#646cff]/10 dark:bg-[#a8b1ff]/12 text-[#3451b2] dark:text-[#a8b1ff] font-semibold border-l-2 border-[#3451b2] dark:border-[#a8b1ff] pl-2.5 shadow-xs'
                  : 'text-[#476582] dark:text-[#98989f] hover:text-[#213547] dark:hover:text-[#dfdfd6] hover:bg-[#f6f6f7] dark:hover:bg-[#202127]/60 border-l-2 border-transparent'
              ]"
              @click="emit('itemClick')"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <svg
                  v-if="item.path === '/'"
                  class="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <svg
                  v-else-if="item.type === 'Component'"
                  class="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <svg
                  v-else-if="item.type === 'Composable'"
                  class="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <svg
                  v-else-if="item.type === 'Utility'"
                  class="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="truncate">{{ item.title }}</span>
              </div>

              <span
                v-if="item.badge"
                class="text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 transition-colors"
                :class="[
                  isItemActive(item.path)
                    ? 'bg-[#646cff]/15 dark:bg-[#a8b1ff]/20 text-[#3451b2] dark:text-[#a8b1ff]'
                    : 'bg-[#f6f6f7] dark:bg-[#202127] text-[#90a4ae] dark:text-[#98989f] group-hover:bg-[#ebebef] dark:group-hover:bg-[#252529]'
                ]"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div
        v-if="filteredCategories.length === 0"
        class="py-8 text-center text-[#90a4ae] dark:text-[#6a6a71] text-sm"
      >
        No documentation pages match your search.
      </div>
    </nav>
  </div>
</template>
