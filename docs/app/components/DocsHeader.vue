<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (val: boolean) => {
    colorMode.preference = val ? "dark" : "light";
  },
});

defineProps<{
  mobileMenuOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleMobileMenu"): void;
}>();
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-[#e2e2e3] dark:border-[#2e2e32] bg-[#ffffff]/85 dark:bg-[#1b1b1f]/85 backdrop-blur-md transition-colors"
  >
    <div class="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-4">
      <!-- Left: Mobile Menu Toggle & Brand Logo -->
      <div class="flex items-center gap-3">
        <!-- Mobile Drawer Toggle Button -->
        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#476582] dark:text-[#98989f] hover:bg-[#f6f6f7] dark:hover:bg-[#202127] focus:outline-none focus:ring-2 focus:ring-[#646cff]/40 cursor-pointer transition-colors"
          aria-label="Toggle navigation menu"
          @click="emit('toggleMobileMenu')"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Brand Logo -->
        <NuxtLink
          to="/"
          class="group flex items-center gap-2.5 text-[#213547] dark:text-[#dfdfd6] font-bold text-base sm:text-lg transition-transform hover:opacity-95"
        >
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#646cff] to-[#545cff] flex items-center justify-center text-white shadow-xs font-mono text-xs font-bold"
          >
            &lt;/&gt;
          </div>
          <div class="flex items-center gap-2">
            <span class="tracking-tight font-extrabold font-sans text-base sm:text-lg">The Usuals</span>
            <span
              class="hidden sm:inline-flex px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-[#646cff]/10 dark:bg-[#a8b1ff]/15 text-[#3451b2] dark:text-[#a8b1ff] border border-[#646cff]/20 dark:border-[#a8b1ff]/30"
            >
              Docs v1.0
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Quick Stack Indicator / Badge -->
        <span
          class="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[#f6f6f7] dark:bg-[#202127] text-[#476582] dark:text-[#98989f] border border-[#e2e2e3] dark:border-[#2e2e32] font-mono"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Nuxt 4 · Vue 3
        </span>

        <!-- GitHub Repository Link -->
        <a
          href="https://github.com/shamsadanam/the-usuals"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center p-2 rounded-lg text-[#476582] dark:text-[#98989f] hover:text-[#213547] dark:hover:text-[#dfdfd6] hover:bg-[#f6f6f7] dark:hover:bg-[#202127] border border-transparent hover:border-[#e2e2e3] dark:border-[#2e2e32] transition-all cursor-pointer"
          aria-label="GitHub repository"
          title="GitHub Repository"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>

        <!-- Light / Dark Mode Toggle Button -->
        <ClientOnly>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#476582] dark:text-[#dfdfd6] hover:text-[#213547] dark:hover:text-white bg-[#f6f6f7] dark:bg-[#202127] hover:bg-[#ebebef] dark:hover:bg-[#252529] border border-[#e2e2e3] dark:border-[#2e2e32] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#646cff]/40 shadow-xs"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="isDark = !isDark"
          >
            <!-- Sun icon when dark -->
            <svg
              v-if="isDark"
              class="w-4 h-4 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <!-- Moon icon when light -->
            <svg
              v-else
              class="w-4 h-4 text-[#476582]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <span class="hidden sm:inline font-mono text-xs text-[#476582] dark:text-[#98989f]">
              {{ isDark ? 'Dark' : 'Light' }}
            </span>
          </button>
          <template #fallback>
            <div class="h-8 w-16 rounded-lg bg-[#f6f6f7] dark:bg-[#202127] animate-pulse" />
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
