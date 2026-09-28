<script setup lang="ts">
const route = useRoute();

const tools = [
  {
    name: "Overview",
    path: "/docs",
    description: "Documentation hub and repository overview",
    icon: "i-heroicons-home",
  },
  {
    name: "PP (Pretty Print)",
    path: "/docs/pp",
    description: "Collapsible JSON & debug data tree component",
    icon: "i-heroicons-code-bracket",
    type: "Component",
  },
  {
    name: "DownloadFilesButton",
    path: "/docs/download-files-button",
    description: "Single file & ZIP archive downloader button",
    icon: "i-heroicons-arrow-down-tray",
    type: "Component",
  },
  {
    name: "useApi",
    path: "/docs/use-api",
    description: "SSR fetch wrapper with proxy & auth token support",
    icon: "i-heroicons-globe-alt",
    type: "Composable",
  },
  {
    name: "useFormattedProperties",
    path: "/docs/use-formatted-properties",
    description: "Object formatter for Start Case labels & dates",
    icon: "i-heroicons-sparkles",
    type: "Composable",
  },
  {
    name: "useFileDownloader & downloadZip",
    path: "/docs/use-file-downloader",
    description: "Client-side file and ZIP archive download utilities",
    icon: "i-heroicons-document-arrow-down",
    type: "Utility / Composable",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
    <!-- Header -->
    <header class="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/docs" class="flex items-center gap-2 text-sky-400 font-bold text-lg hover:text-sky-300 transition-colors">
            <span class="text-xl">&lt;/&gt;</span>
            <span>The Usuals Docs</span>
          </NuxtLink>
          <span class="px-2 py-0.5 text-xs rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-mono">v1.0.0</span>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/dashboard" class="text-xs text-gray-400 hover:text-gray-200 transition-colors">
            Dashboard
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Body Layout -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex w-full">
      <!-- Sidebar Navigation -->
      <aside class="w-64 border-r border-gray-800/80 py-6 pr-6 hidden md:block shrink-0">
        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Tools & Patterns
        </div>
        <nav class="space-y-1">
          <NuxtLink
            v-for="tool in tools"
            :key="tool.path"
            :to="tool.path"
            class="flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors"
            :class="[
              route.path === tool.path
                ? 'bg-sky-500/10 text-sky-400 font-medium border border-sky-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
            ]"
          >
            <span class="truncate">{{ tool.name }}</span>
            <span v-if="tool.type" class="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 shrink-0 font-mono">
              {{ tool.type[0] }}
            </span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 py-6 md:pl-8 min-w-0">
        <!-- Mobile navigation selector -->
        <div class="md:hidden mb-6">
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-2">Select Documentation Tool</label>
          <select
            :value="route.path"
            class="w-full bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-200 p-2.5"
            @change="(e) => navigateTo((e.target as HTMLSelectElement).value)"
          >
            <option v-for="tool in tools" :key="tool.path" :value="tool.path">
              {{ tool.name }} {{ tool.type ? `(${tool.type})` : '' }}
            </option>
          </select>
        </div>

        <slot />
      </main>
    </div>
  </div>
</template>
