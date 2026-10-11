<script setup lang="ts">
// Guarded sample page. Visit it signed out to see the `?redirect=` round trip.
definePageMeta({ middleware: "logged-in" });

const { session, user, clear: clearSession } = useUserSession();
const { $api } = useNuxtApp();
const { auth } = useAppConfig();

async function logout() {
  // Best-effort backend logout, then drop the cookie client-side.
  try {
    await $api("/logout", { method: "POST", auth: true });
  } catch {
    // ignore — clear locally regardless
  }
  await clearSession();
  await navigateTo(auth.afterLogoutRoute);
}
</script>

<template>
  <div class="min-h-screen p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Dashboard</h1>
      <UButton color="neutral" variant="soft" @click="logout">Log out</UButton>
    </div>

    <p>Signed in as <strong>{{ user?.name ?? user?.email }}</strong>.</p>

    <UCard>
      <template #header>Session (from cookie)</template>
      <pre class="text-xs overflow-auto">{{ session }}</pre>
    </UCard>
  </div>
</template>
