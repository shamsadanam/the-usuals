<script setup lang="ts">
const examples = [
  { title: "Login", path: "/login" },
  { title: "Guarded dashboard", path: "/dashboard" },
];
</script>

<template>
  <main class="mx-auto max-w-xl p-8 space-y-4">
    <h1 class="text-xl font-bold">Nuxt examples</h1>
    <ul class="list-disc pl-5 space-y-1">
      <li v-for="example in examples" :key="example.path">
        <NuxtLink :to="example.path" class="underline">{{ example.title }}</NuxtLink>
      </li>
    </ul>
  </main>
</template>
