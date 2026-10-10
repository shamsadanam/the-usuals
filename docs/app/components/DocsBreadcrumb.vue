<script setup lang="ts">
const props = defineProps<{
  path: string;
  title?: string;
}>();

const crumbs = computed(() => {
  const clean = props.path.replace(/^\/|\/$/g, "");
  if (!clean) return [];

  const segments = clean.split("/");
  const result: { label: string; to: string }[] = [];

  let accumulated = "";
  segments.forEach((seg, index) => {
    accumulated += `/${seg}`;
    const isLast = index === segments.length - 1;

    let label = seg;
    if (seg === "nuxt") label = "Nuxt";
    else if (seg === "components") label = "Components";
    else if (seg === "composables") label = "Composables";
    else if (seg === "patterns") label = "Patterns";
    else if (isLast && props.title) label = props.title;
    else {
      label = seg
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    result.push({
      label,
      to: accumulated,
    });
  });

  return result;
});
</script>

<template>
  <nav aria-label="Breadcrumbs" class="flex items-center gap-2 text-[13.5px] text-[#476582] dark:text-[#98989f] font-sans mb-5 overflow-x-auto whitespace-nowrap">
    <NuxtLink
      to="/"
      class="hover:text-[#3451b2] dark:hover:text-[#a8b1ff] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>Docs</span>
    </NuxtLink>

    <template v-for="(crumb, i) in crumbs" :key="crumb.to">
      <svg class="w-3.5 h-3.5 text-[#90a4ae] dark:text-[#6a6a71] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span
        v-if="i === crumbs.length - 1"
        class="text-[#213547] dark:text-[#dfdfd6] font-semibold truncate max-w-xs"
      >
        {{ crumb.label }}
      </span>
      <NuxtLink
        v-else
        :to="crumb.to"
        class="hover:text-[#3451b2] dark:hover:text-[#a8b1ff] transition-colors truncate max-w-xs cursor-pointer"
      >
        {{ crumb.label }}
      </NuxtLink>
    </template>
  </nav>
</template>
