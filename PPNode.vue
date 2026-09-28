<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { computed, ref } from "vue";

interface Props {
  value: unknown;
  label?: string | number;
}

const props = defineProps<Props>();

const isOpen = ref(false);

const isBranch = computed(
  () => props.value !== null && typeof props.value === "object",
);

const entries = computed(() =>
  isBranch.value ? Object.entries(props.value as object) : [],
);

const badge = computed(() => {
  if (Array.isArray(props.value)) return `Array (${props.value.length})`;
  const keys = entries.value.length;
  return `Object (${keys} key${keys === 1 ? "" : "s"})`;
});

const primitive = computed(() => {
  const value = props.value;
  if (value === undefined) return { text: "undefined", cls: "text-rose-400" };
  if (value === null) return { text: "null", cls: "text-rose-400 font-medium" };
  if (typeof value === "string") {
    return { text: JSON.stringify(value), cls: "text-emerald-400" };
  }
  if (typeof value === "boolean") {
    return { text: String(value), cls: "text-purple-400 font-medium" };
  }
  return { text: String(value), cls: "text-amber-400" };
});

const { copy, copied } = useClipboard();

const handleCopy = async (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  try {
    await copy(JSON.stringify(props.value, null, 2));
  } catch (err) {
    console.error("Error copying data:", err);
  }
};

const onToggle = (e: Event) => {
  isOpen.value = (e.target as HTMLDetailsElement).open;
};
</script>

<template>
  <details
    v-if="isBranch"
    class="group/node font-mono text-xs"
    :open="isOpen"
    @toggle.stop="onToggle"
  >
    <summary
      class="group/row flex items-center gap-2 cursor-pointer list-none rounded px-1.5 py-1 hover:bg-gray-800/60 select-none [&::-webkit-details-marker]:hidden"
    >
      <span
        class="text-gray-500 transition-transform duration-200 inline-block shrink-0"
        :class="{ 'rotate-90': isOpen }"
      >&gt;</span>
      <span v-if="typeof label === 'number'" class="text-amber-400 shrink-0">[{{ label }}]</span>
      <span v-else-if="label !== undefined" class="text-sky-300 font-medium truncate">{{ label }}</span>
      <span
        class="px-2 py-0.5 text-[10px] rounded-full bg-gray-800/90 text-sky-300 border border-gray-700/60 shrink-0"
      >
        {{ badge }}
      </span>
      <button
        type="button"
        class="ml-auto shrink-0 px-2 py-0.5 text-[10px] font-sans font-medium rounded-md bg-gray-800 hover:bg-gray-700 hover:text-white border border-gray-700/80 transition-opacity focus:outline-none focus:ring-2 focus:ring-sky-500/40 opacity-0 group-hover/row:opacity-100 focus:opacity-100"
        :class="copied ? 'text-emerald-400 opacity-100' : 'text-gray-400'"
        @click="handleCopy"
      >
        {{ copied ? "✓ Copied" : "Copy" }}
      </button>
    </summary>

    <!-- Children mount only when open, so large payloads stay cheap until explored. -->
    <div v-if="isOpen" class="ml-2 border-l border-gray-800 pl-3">
      <PPNode
        v-for="[key, child] in entries"
        :key="key"
        :value="child"
        :label="Array.isArray(value) ? Number(key) : key"
      />
      <div v-if="entries.length === 0" class="px-1.5 py-1 text-gray-500">
        {{ Array.isArray(value) ? "[]" : "{}" }}
      </div>
    </div>
  </details>

  <div v-else class="flex gap-2 px-1.5 py-1 pl-6 font-mono text-xs leading-relaxed">
    <span v-if="typeof label === 'number'" class="text-amber-400 shrink-0">[{{ label }}]</span>
    <span v-else-if="label !== undefined" class="text-sky-300 font-medium shrink-0">{{ label }}:</span>
    <span class="break-all" :class="primitive.cls">{{ primitive.text }}</span>
  </div>
</template>
