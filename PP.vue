<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { computed, ref, watch } from "vue";

// Define component props
interface Props {
  data: unknown;
  open?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  open: true,
  title: "Debug Data",
});

const isOpen = ref(props.open);

watch(
  () => props.open,
  (newVal) => {
    isOpen.value = newVal;
  },
);

const onToggle = (e: Event) => {
  const target = e.target as HTMLDetailsElement | null;
  if (target) {
    isOpen.value = target.open;
  }
};

const stringify = (value: unknown): string => {
  if (value === undefined) return "undefined";
  try {
    return JSON.stringify(value, null, 2) ?? "undefined";
  } catch (e) {
    console.error("Error pretty printing data:", e);
    return '{\n  "error": "Cannot stringify data"\n}';
  }
};

const typeBadge = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return `Array (${value.length})`;
  if (typeof value === "object") {
    const keys = Object.keys(value as object).length;
    return `Object (${keys} key${keys === 1 ? "" : "s"})`;
  }
  return typeof value;
};

const highlight = (jsonStr: string): string => {
  if (!jsonStr) return "";

  const escaped = jsonStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const jsonRegex =
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

  return escaped.replace(jsonRegex, (match) => {
    let cls = "text-amber-400"; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = "text-sky-300 font-medium"; // key
      } else {
        cls = "text-emerald-400"; // string
      }
    } else if (/true|false/.test(match)) {
      cls = "text-purple-400 font-medium"; // boolean
    } else if (/null/.test(match)) {
      cls = "text-rose-400 font-medium"; // null
    }
    return `<span class="${cls}">${match}</span>`;
  });
};

const prettyData = computed(() => stringify(props.data));
const dataTypeBadge = computed(() => typeBadge(props.data));
const highlightedJson = computed(() => highlight(prettyData.value));

const treeEntries = computed(() => {
  const data = props.data;
  if (data === null || typeof data !== "object") return null;
  const entries = Object.entries(data);
  if (entries.length === 0) return null;
  const isArray = Array.isArray(data);
  return entries.map(([key, value]) => ({
    key,
    value,
    label: isArray ? Number(key) : key,
  }));
});

const { copy, copied } = useClipboard({ source: prettyData });

const handleCopy = async (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  await copy(prettyData.value);
};
</script>

<template>
  <div class="my-4 w-full">
    <UContainer>
      <ClientOnly>
        <details
          class="group rounded-xl border border-gray-800 bg-gray-950 shadow-lg overflow-hidden font-sans"
          :open="isOpen"
          @toggle="onToggle"
        >
          <summary
            class="flex items-center justify-between cursor-pointer list-none px-4 py-3 bg-gray-900/90 hover:bg-gray-800/80 text-gray-200 transition-colors select-none [&::-webkit-details-marker]:hidden border-b border-gray-800/80"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <!-- Chevron icon -->
              <span
                class="text-xs text-gray-400 font-mono transition-transform duration-200 inline-block shrink-0"
                :class="{ 'rotate-90': isOpen }"
              >&gt;</span>

              <!-- Code brackets icon -->
              <span class="text-xs text-sky-400 font-mono font-bold shrink-0"
                >&lt;/&gt;</span
              >

              <!-- Title -->
              <span class="font-semibold text-xs text-gray-200 truncate">{{
                title
              }}</span>

              <!-- Type badge -->
              <span
                class="px-2 py-0.5 text-[10px] font-mono rounded-full bg-gray-800/90 text-sky-300 border border-gray-700/60 shrink-0"
              >
                {{ dataTypeBadge }}
              </span>
            </div>

            <div class="flex items-center gap-2 shrink-0 ml-2">
              <!-- Copy button -->
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white border border-gray-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                :title="copied ? 'Copied to clipboard' : 'Copy JSON'"
                @click="handleCopy"
              >
                <span v-if="copied" class="text-emerald-400 text-xs font-bold font-mono">✓</span>
                <span :class="{ 'text-emerald-400 font-semibold': copied }">
                  {{ copied ? "Copied" : "Copy" }}
                </span>
              </button>
            </div>
          </summary>

          <div
            v-if="treeEntries"
            class="p-3 bg-gray-950 space-y-1 max-h-[32rem] overflow-auto"
          >
            <PPNode
              v-for="entry in treeEntries"
              :key="entry.key"
              :value="entry.value"
              :label="entry.label"
              class="rounded-lg border border-gray-800 bg-gray-900/40 p-1"
            />
          </div>

          <div v-else class="p-4 bg-gray-950 overflow-x-auto">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <pre
              class="font-mono text-xs leading-relaxed text-gray-300 max-h-96 overflow-y-auto whitespace-pre focus:outline-none"
              v-html="highlightedJson"
            ></pre>
          </div>
        </details>

        <template #fallback>
          <div
            class="rounded-xl border border-gray-800 bg-gray-950 p-4 font-mono text-xs text-gray-500"
          >
            Loading debug data...
          </div>
        </template>
      </ClientOnly>
    </UContainer>
  </div>
</template>
