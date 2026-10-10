<script setup lang="ts">
// Browser-egress login flow. See docs/content/nuxt/4.patterns/1.authentication-login.md
definePageMeta({ layout: false });

const { loggedIn, fetch: fetchSession, clear: clearSession } = useUserSession();
const { $api } = useNuxtApp();

if (loggedIn.value) await navigateTo("/dashboard");

const form = reactive({ email: "", password: "" });
const pending = ref(false);
const errorMsg = ref("");

async function onSubmit() {
  pending.value = true;
  errorMsg.value = "";
  try {
    const res = await $api<{
      status_code: number;
      data?: { token: string; user: Record<string, unknown> };
      message?: string;
    }>("/login", { method: "POST", body: { ...form } });

    if (res.status_code !== 200) {
      errorMsg.value = res.message ?? "Login failed.";
      await clearSession();
      return;
    }

    const { token, user } = res.data ?? {};

    await $api("/auth/session", {
      baseURL: "/api/",
      method: "POST",
      body: { user, token, loggedInAt: Date.now() },
    });

    await fetchSession();
    await navigateTo("/dashboard");
  } catch (e) {
    errorMsg.value =
      (e as { data?: { message?: string } })?.data?.message ??
      "Something went wrong. Try again.";
    await clearSession();
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-lg font-semibold">Sign in</h1>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Email" name="email">
          <UInput
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full"
          />
        </UFormField>

        <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

        <UButton
          type="submit"
          block
          :loading="pending"
          :disabled="pending"
        >
          Sign in
        </UButton>
      </form>
    </UCard>
  </div>
</template>
