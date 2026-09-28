---
title: "PP (Pretty Print)"
description: "Collapsible interactive tree viewer component for inspecting complex data payloads."
---

# PP (Pretty Print Component)

`PP.vue` is a debug utility component for displaying formatted data structures in Vue 3 / Nuxt 4 apps. It renders any data structure (objects, arrays, primitives) as an interactive, collapsible tree with type badges and one-click JSON copying.

## Features

- **Collapsible Tree View**: Expand and collapse individual object and array nodes.
- **Type Badges**: Visual indicators for `Array (N)` or `Object (N keys)`.
- **Color-Coded Primitives**: Color highlights for strings, numbers, booleans, null, and undefined.
- **Copy to Clipboard**: One-click copying of full JSON payload or individual sub-trees.
- **SSR Safe**: Wrapped in `<ClientOnly>` to prevent hydration mismatches.

## Usage Example

```vue
<script setup lang="ts">
const sampleData = {
  user: { id: 101, name: "Shamsad", role: "developer" },
  active: true,
  items: ["nuxt", "vue", "tailwind"]
};
</script>

<template>
  <PP :data="sampleData" title="User Debug Payload" :open="true" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `unknown` | *required* | The object, array, or primitive data payload to format. |
| `open` | `boolean` | `true` | Initial expanded state of the details container. |
| `title` | `string` | `"Debug Data"` | Header title label displayed in the toolbar. |
