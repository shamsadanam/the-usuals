<script setup lang="ts">
// Password login flow (browser-egress model).
//
//   1. Browser POSTs credentials straight to the backend `/login`. The Node
//      process can't egress, so this MUST go through $api's external baseURL
//      (no `baseURL: "/api/"` override here).
//   2. Backend returns { token, user }. We hand that to our local seal route
//      POST /api/auth/session (baseURL "/api/") which writes the encrypted
//      http-only cookie via setUserSession().
//   3. fetchSession() refreshes the reactive useUserSession() state, then we
//      redirect into the guarded area.
definePageMeta({ layout: false });

const { loggedIn, fetch: fetchSession, clear: clearSession } = useUserSession();
const { $api } = useNuxtApp();

// Already sealed? Skip the form.
if (loggedIn.value) await navigateTo("/dashboard");

const form = reactive({ email: "", password: "" });
const pending = ref(false);
const errorMsg = ref("");

async function onSubmit() {
  pending.value = true;
  errorMsg.value = "";
  try {
    // Step 1 — hit the backend directly (external baseURL, no /api/ override).
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

    // Step 2 — seal into the encrypted cookie via the local Nitro route.
    await $api("/auth/session", {
      baseURL: "/api/",
      method: "POST",
      body: { user, token, loggedInAt: Date.now() },
    });

    // Step 3 — refresh reactive session state, then redirect.
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
