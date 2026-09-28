---
title: "Authentication & Login Flow"
description: "Pattern documentation for implementing browser-egress authentication, encrypted session cookies, and route guards in Nuxt 4."
---

# Authentication & Login Flow

This pattern demonstrates how to implement secure, production-grade user authentication in a Nuxt 4 application using `nuxt-auth-utils`, an imperative `$api` plugin, and route middleware guards.

## Key Architectural Concepts

1. **Browser-Egress Authentication**:
   - The browser POSTs credentials directly to the backend API (`/login`).
   - Avoids passing credentials through intermediate server functions unnecessarily.
2. **Encrypted HTTP-Only Session Cookie**:
   - On successful backend login (`{ token, user }`), the client sends the session payload to local Nitro endpoint `/api/auth/session` to seal an encrypted HTTP-only cookie via `useUserSession()`.
3. **Route Guard Middleware**:
   - `logged-in.ts` middleware verifies `session.value` before granting access to protected routes like `/dashboard`.
4. **Auto-Attaching Bearer Interceptor**:
   - `$api` plugin injects `Authorization: Bearer <token>` when requests set `{ auth: true }` and automatically logs out on `401` status responses.

---

## 1. Login Form Implementation (`app/pages/login.vue`)

```vue
<script setup lang="ts">
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
    // 1. Post credentials directly to backend
    const res = await $api<{ status_code: number; data?: { token: string; user: any } }>("/login", {
      method: "POST",
      body: { ...form }
    });

    if (res.status_code !== 200) {
      errorMsg.value = "Login failed.";
      await clearSession();
      return;
    }

    const { token, user } = res.data ?? {};

    // 2. Write session into encrypted HTTP-only cookie
    await $api("/auth/session", {
      baseURL: "/api/",
      method: "POST",
      body: { user, token, loggedInAt: Date.now() }
    });

    // 3. Refresh session state & redirect to dashboard
    await fetchSession();
    await navigateTo("/dashboard");
  } catch (e) {
    errorMsg.value = "Something went wrong.";
    await clearSession();
  } finally {
    pending.value = false;
  }
}
</script>
```

---

## 2. Route Guard Middleware (`app/middleware/logged-in.ts`)

```ts
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, session, fetch: fetchSession } = useUserSession();

  if (!session.value) await fetchSession();
  if (!loggedIn.value) return navigateTo("/login");
});
```

To guard any protected page, add `definePageMeta({ middleware: "logged-in" })` at the top of the Vue component.

---

## 3. Imperative `$api` Plugin (`app/plugins/api.ts`)

```ts
export default defineNuxtPlugin((nuxtApp) => {
  const { session, fetch: fetchSession, clear: clearSession } = useUserSession();
  const config = useRuntimeConfig();

  const baseURL = config.public.enableProxy
    ? "/api/proxy"
    : (config.public.apiBase as string);

  const api = $fetch.create({
    baseURL,
    headers: { Accept: "application/json" },

    async onRequest({ options }) {
      const { auth } = options as { auth?: boolean };
      if (!auth) return;

      if (!session.value) {
        await nuxtApp.runWithContext(() => fetchSession());
      }
      if (session.value?.token) {
        options.headers.set("Authorization", `Bearer ${session.value.token}`);
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(async () => {
          await clearSession();
          await navigateTo("/");
        });
      }
    }
  });

  return { provide: { api } };
});
```

---

## Live Demos

You can test this auth pattern live in the application:
- **[Sample Login Page](/login)**
- **[Sample Guarded Dashboard](/dashboard)**
