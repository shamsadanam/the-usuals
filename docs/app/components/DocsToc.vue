<script setup lang="ts">
export interface TocLink {
  id: string;
  text: string;
  depth?: number;
  children?: TocLink[];
}

const props = defineProps<{
  links?: TocLink[];
}>();

const activeId = ref<string>("");
const domLinks = ref<TocLink[]>([]);

const extractHeadingsFromDom = () => {
  if (typeof document === "undefined") return;
  const elements = Array.from(document.querySelectorAll("main h2, main h3"));
  const collected: TocLink[] = [];
  let currentH2: TocLink | null = null;

  elements.forEach((el, index) => {
    if (!el.id) {
      el.id = el.textContent
        ? el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        : `heading-${index}`;
    }

    const item: TocLink = {
      id: el.id,
      text: (el.textContent || "").replace(/^#\s*/, "").trim(),
      depth: el.tagName.toLowerCase() === "h2" ? 2 : 3,
    };

    if (item.depth === 2) {
      currentH2 = { ...item, children: [] };
      collected.push(currentH2);
    } else if (currentH2) {
      currentH2.children = currentH2.children || [];
      currentH2.children.push(item);
    } else {
      collected.push(item);
    }
  });

  domLinks.value = collected;
};

const resolvedLinks = computed(() => {
  if (props.links && props.links.length > 0) {
    return props.links;
  }
  return domLinks.value;
});

onMounted(() => {
  nextTick(() => {
    extractHeadingsFromDom();
  });

  const handleScroll = () => {
    const headings = Array.from(document.querySelectorAll("main h2, main h3"));
    if (headings.length === 0) return;

    const scrollY = window.scrollY;
    let current = "";

    for (const el of headings) {
      const top = (el as HTMLElement).getBoundingClientRect().top + scrollY;
      if (scrollY >= top - 120) {
        current = el.id;
      }
    }

    if (!current && headings.length > 0) {
      current = headings[0].id;
    }
    activeId.value = current;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});

const route = useRoute();
watch(
  () => route.path,
  () => {
    nextTick(() => {
      extractHeadingsFromDom();
    });
  },
);

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    activeId.value = id;
    window.history.pushState(null, "", `#${id}`);
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div v-if="resolvedLinks.length > 0" class="flex flex-col space-y-6 text-sm font-sans">
    <div>
      <div class="flex items-center gap-1.5 text-xs font-bold text-[#90a4ae] dark:text-[#6a6a71] uppercase tracking-wider font-mono mb-3">
        <svg class="w-3.5 h-3.5 text-[#646cff] dark:text-[#a8b1ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h7" />
        </svg>
        <span>On this page</span>
      </div>

      <nav class="space-y-1">
        <template v-for="link in resolvedLinks" :key="link.id">
          <button
            type="button"
            class="group w-full text-left py-1.5 px-2 rounded-md transition-all truncate block text-[13.5px] cursor-pointer"
            :class="[
              activeId === link.id
                ? 'text-[#3451b2] dark:text-[#a8b1ff] font-semibold bg-[#646cff]/10 dark:bg-[#a8b1ff]/12'
                : 'text-[#476582] dark:text-[#98989f] hover:text-[#213547] dark:hover:text-[#dfdfd6] hover:bg-[#f6f6f7] dark:hover:bg-[#202127]/50'
            ]"
            @click="scrollToHeading(link.id)"
          >
            {{ link.text }}
          </button>

          <!-- Nested H3 headings -->
          <div v-if="link.children && link.children.length > 0" class="pl-2.5 space-y-0.5 border-l border-[#e2e2e3] dark:border-[#2e2e32] ml-2 my-0.5">
            <button
              v-for="sub in link.children"
              :key="sub.id"
              type="button"
              class="w-full text-left py-1 px-2 rounded transition-all truncate block text-[12.5px] cursor-pointer"
              :class="[
                activeId === sub.id
                  ? 'text-[#3451b2] dark:text-[#a8b1ff] font-medium'
                  : 'text-[#90a4ae] dark:text-[#6a6a71] hover:text-[#213547] dark:hover:text-[#dfdfd6]'
              ]"
              @click="scrollToHeading(sub.id)"
            >
              {{ sub.text }}
            </button>
          </div>
        </template>
      </nav>
    </div>

    <!-- Quick Utilities -->
    <div class="pt-4 border-t border-[#e2e2e3] dark:border-[#2e2e32] space-y-2.5 text-sm text-[#476582] dark:text-[#98989f]">
      <button
        type="button"
        class="inline-flex items-center gap-2 hover:text-[#3451b2] dark:hover:text-[#a8b1ff] transition-colors cursor-pointer"
        @click="scrollToTop"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span>Back to top</span>
      </button>

      <div>
        <a
          href="https://github.com/shamsadanam/the-usuals"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 hover:text-[#3451b2] dark:hover:text-[#a8b1ff] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>
