<script setup lang="ts">
const route = useRoute();
const mobileMenuOpen = ref(false);

const path = computed(() => {
  if (!route.path || route.path === "/docs" || route.path === "/docs/") return "/docs";
  return route.path;
});

// Fetch page content
const { data: page, error } = await useAsyncData(`content-${path.value}`, () => {
  return queryCollection("docs").path(path.value).first();
});

// Fetch dynamic collection navigation
const { data: navigation } = await useAsyncData("docs-navigation", () => {
  return queryCollectionNavigation("docs");
});

const searchQuery = ref("");

// Curated menu items to ensure menu is ALWAYS fully populated & interactive
const staticMenuItems = [
  {
    category: "Overview",
    items: [
      { title: "Documentation Hub", path: "/docs", icon: "i-heroicons-home" },
    ],
  },
  {
    category: "Components",
    items: [
      { title: "PP (Pretty Print)", path: "/docs/components/pp", icon: "i-heroicons-code-bracket" },
      { title: "DownloadFilesButton", path: "/docs/components/download-files-button", icon: "i-heroicons-arrow-down-tray" },
    ],
  },
  {
    category: "Composables & Utilities",
    items: [
      { title: "useApi", path: "/docs/composables/use-api", icon: "i-heroicons-globe-alt" },
      { title: "useFormattedProperties", path: "/docs/composables/use-formatted-properties", icon: "i-heroicons-sparkles" },
      { title: "useFileDownloader & downloadZip", path: "/docs/composables/use-file-downloader", icon: "i-heroicons-document-arrow-down" },
    ],
  },
  {
    category: "Patterns & Demos",
    items: [
      { title: "Authentication & Login Flow", path: "/docs/patterns/authentication-login", icon: "i-heroicons-lock-closed" },
      { title: "Sample Login Page Demo", path: "/login", icon: "i-heroicons-arrow-right-end-on-rectangle" },
      { title: "Sample Dashboard Demo", path: "/dashboard", icon: "i-heroicons-squares-2x2" },
    ],
  },
];

// Helper to filter static items
const filteredStaticItems = computed(() => {
  if (!searchQuery.value) return staticMenuItems;
  const q = searchQuery.value.toLowerCase();

  return staticMenuItems
    .map((group) => {
      const filtered = group.items.filter((item) =>
        item.title.toLowerCase().includes(q),
      );
      if (filtered.length > 0) {
        return { ...group, items: filtered };
      }
      return null;
    })
    .filter(Boolean) as typeof staticMenuItems;
});
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
    <!-- Header with Mobile Menu Toggle Button -->
    <header class="border-b border-gray-800 bg-gray-900/90 backdrop-blur sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Mobile Toggle Button -->
          <button
            type="button"
            class="md:hidden p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white border border-gray-700 focus:outline-none"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="sr-only">Toggle Sidebar Menu</span>
            <span class="text-lg font-bold">☰ Menu</span>
          </button>

          <NuxtLink to="/docs" class="flex items-center gap-2 text-sky-400 font-bold text-lg hover:text-sky-300 transition-colors">
            <span class="text-xl">&lt;/&gt;</span>
            <span>The Usuals Docs</span>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/dashboard" class="text-xs text-gray-400 hover:text-gray-200 transition-colors">
            Dashboard
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex w-full">
      <!-- Desktop Permanent Left Side Navigation Menu -->
      <aside class="w-64 border-r border-gray-800/80 py-6 pr-6 hidden md:block shrink-0">
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search docs..."
            class="w-full px-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <nav class="space-y-6 text-sm">
          <div v-for="group in filteredStaticItems" :key="group.category" class="space-y-1.5">
            <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
              {{ group.category }}
            </div>
            <NuxtLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
              :class="[
                route.path === item.path || (item.path === '/docs' && (route.path === '/docs' || route.path === '/docs/'))
                  ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/80'
              ]"
            >
              <span>{{ item.title }}</span>
            </NuxtLink>
          </div>
        </nav>
      </aside>

      <!-- Mobile Slide-over Drawer Menu -->
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 flex md:hidden">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="mobileMenuOpen = false" />
        <aside class="relative w-72 bg-gray-950 border-r border-gray-800 p-6 flex flex-col h-full z-10 overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="font-bold text-sky-400 text-sm">&lt;/&gt; Docs Menu</div>
            <button type="button" class="text-gray-400 hover:text-white text-sm" @click="mobileMenuOpen = false">
              ✕ Close
            </button>
          </div>

          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search docs..."
              class="w-full px-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <nav class="space-y-6 text-sm flex-1">
            <div v-for="group in filteredStaticItems" :key="group.category" class="space-y-1.5">
              <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                {{ group.category }}
              </div>
              <NuxtLink
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
                :class="[
                  route.path === item.path || (item.path === '/docs' && (route.path === '/docs' || route.path === '/docs/'))
                    ? 'bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/80'
                ]"
                @click="mobileMenuOpen = false"
              >
                <span>{{ item.title }}</span>
              </NuxtLink>
            </div>
          </nav>
        </aside>
      </div>

      <!-- Main Content Renderer Area -->
      <main class="flex-1 py-8 md:pl-10 min-w-0">
        <div v-if="page" class="prose prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-a:text-sky-400">
          <ContentRenderer :value="page" />
        </div>
        <div v-else-if="error || !page" class="p-6 rounded-xl border border-rose-900/50 bg-rose-950/20 text-rose-300">
          <h2 class="text-base font-bold">Document Not Found</h2>
          <p class="text-xs text-rose-400 mt-1">The requested documentation page could not be located.</p>
          <NuxtLink to="/docs" class="inline-block mt-4 text-xs underline text-sky-400">Return to Documentation Hub</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>
