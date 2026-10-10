<script setup lang="ts">
const route = useRoute();
const colorMode = useColorMode();
const mobileMenuOpen = ref(false);

const path = computed(() => route.path.replace(/\/$/, "") || "/");

// Fetch page content
const { data: page, error } = await useAsyncData(`content-${path.value}`, () => {
  return queryCollection("docs").path(path.value).first();
});

// Close mobile drawer on route change
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  },
);

const tocLinks = computed(() => {
  // @ts-expect-error Nuxt Content collection property
  const links = page.value?.body?.toc?.links || page.value?.toc?.links;
  return Array.isArray(links) ? links : [];
});
</script>

<template>
  <div class="min-h-screen bg-[#ffffff] dark:bg-[#1b1b1f] text-[#213547] dark:text-[#dfdfd6] flex flex-col font-sans transition-colors duration-200">
    <!-- Header with Mobile Drawer Toggle & Actions -->
    <DocsHeader
      :mobile-menu-open="mobileMenuOpen"
      @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
    />

    <!-- Main 3-Column Layout Container -->
    <div class="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex-1 flex w-full gap-8 lg:gap-10 xl:gap-12 relative">
      <!-- Column 1: Left Desktop Navigation Sidebar -->
      <aside class="w-72 border-r border-[#e2e2e3] dark:border-[#2e2e32] py-8 pr-6 hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        <DocsSidebar />
      </aside>

      <!-- Mobile Navigation Slideover Drawer -->
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          @click="mobileMenuOpen = false"
        />

        <!-- Slideover Content -->
        <aside class="relative w-80 max-w-[85vw] bg-[#ffffff] dark:bg-[#161618] border-r border-[#e2e2e3] dark:border-[#2e2e32] p-6 flex flex-col h-full z-10 overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between mb-5 pb-4 border-b border-[#e2e2e3] dark:border-[#2e2e32]">
            <div class="flex items-center gap-2.5 font-bold text-[#213547] dark:text-[#dfdfd6] text-base font-sans">
              <span class="w-7 h-7 rounded-md bg-[#646cff]/10 text-[#3451b2] dark:text-[#a8b1ff] border border-[#646cff]/20 flex items-center justify-center font-mono text-xs font-bold">
                &lt;/&gt;
              </span>
              <span>Navigation</span>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-lg text-[#90a4ae] dark:text-[#98989f] hover:bg-[#f6f6f7] dark:hover:bg-[#202127] cursor-pointer"
              aria-label="Close menu"
              @click="mobileMenuOpen = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Mobile Theme Toggle -->
          <div class="mb-5 pb-4 border-b border-[#e2e2e3] dark:border-[#2e2e32] flex items-center justify-between">
            <span class="text-xs font-mono font-medium text-[#90a4ae] dark:text-[#98989f]">Theme Mode</span>
            <ClientOnly>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f6f6f7] dark:bg-[#202127] text-[#476582] dark:text-[#dfdfd6] border border-[#e2e2e3] dark:border-[#2e2e32] transition-colors cursor-pointer"
                :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
              >
                <svg v-if="colorMode.value === 'dark'" class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-4 h-4 text-[#476582]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span class="font-mono text-xs">{{ colorMode.value === 'dark' ? 'Dark' : 'Light' }}</span>
              </button>
              <template #fallback>
                <div class="h-7 w-16 rounded-lg bg-[#f6f6f7] dark:bg-[#202127] animate-pulse" />
              </template>
            </ClientOnly>
          </div>

          <DocsSidebar @item-click="mobileMenuOpen = false" />
        </aside>
      </div>

      <!-- Column 2: Center Main Content Area -->
      <main class="flex-1 py-8 min-w-0">
        <!-- Breadcrumbs -->
        <DocsBreadcrumb :path="path" :title="page?.title" />

        <!-- Document Content -->
        <article v-if="page" class="prose-docs">
          <ContentRenderer :value="page" />
          <DocsPagination :current-path="path" />
        </article>

        <!-- 404 / Missing Page State -->
        <div
          v-else-if="error || !page"
          class="p-8 rounded-2xl border border-[#e2e2e3] dark:border-[#2e2e32] bg-[#f6f6f7] dark:bg-[#202127]/60 shadow-xs max-w-xl mx-auto my-12 text-center"
        >
          <div class="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg">
            404
          </div>
          <h2 class="text-xl font-bold text-[#213547] dark:text-[#dfdfd6] font-sans">
            Document Not Found
          </h2>
          <p class="text-sm text-[#476582] dark:text-[#98989f] mt-2 leading-relaxed">
            The documentation topic you requested could not be located in the current collection.
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3451b2] dark:bg-[#5c73e7] hover:bg-[#3a5ccc] dark:hover:bg-[#646cff] text-white shadow-xs cursor-pointer transition-colors"
            >
              Return to Documentation Hub
            </NuxtLink>
          </div>
        </div>
      </main>

      <!-- Column 3: Right Desktop Table of Contents (TOC) -->
      <aside class="w-64 border-l border-[#e2e2e3] dark:border-[#2e2e32] py-8 pl-6 hidden xl:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        <DocsToc :links="tocLinks" />
      </aside>
    </div>
  </div>
</template>
