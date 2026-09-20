# Session-seal route — implementation guide

`server/api/auth/session.post.ts` is a **thin Nitro route that seals an
already-authenticated payload into the encrypted `nuxt-auth-utils` cookie**. It
does not talk to the backend.

## Why this exists (the constraint)

In the target deployment the **Node/Nitro process (PM2) cannot egress to the
upstream backend** — only the browser can reach it. The normal nuxt-auth-utils
flow (server calls the auth API, then `setUserSession`) is therefore impossible.

Flow instead:

```
browser  ──POST /login (or GET /staff?token=…)──►  backend API   (browser can reach it)
browser  ◄──── { user, token } ─────────────────  backend API
browser  ──POST /api/auth/session { user, token }─►  THIS route  (seals cookie)
THIS route ── setUserSession(event, …) ──────────►  encrypted http-only cookie
```

The cookie is then the single source of truth read everywhere via
`useUserSession()` — login state, the bearer token for authed requests, and
route-guard checks.

## Prerequisites

1. Module enabled in `nuxt.config.ts`:

   ```ts
   export default defineNuxtConfig({
     modules: ["nuxt-auth-utils"],
   });
   ```

2. Session secret in `.env` (required by nuxt-auth-utils, 32+ chars):

   ```
   NUXT_SESSION_PASSWORD="a-long-random-string-at-least-32-characters"
   ```

3. (Recommended) Augment the session type so `session.user` / `session.token`
   are typed. Add `types/auth.d.ts`:

   ```ts
   declare module "#auth-utils" {
     interface User {
       // shape returned by your backend
       id: number;
       name: string;
       is_password_change_required?: boolean;
       [key: string]: unknown;
     }
     interface UserSessionData {
       token: string;
       loggedInAt: number;
     }
   }
   export {};
   ```

## The route contract

- **Method:** `POST /api/auth/session`
- **Body (all optional, whitelisted):** `{ user?, token?, loggedInAt? }`
- **Behavior:** `setUserSession` **deep-merges** with the existing cookie — so
  posting only `{ user }` (profile/password update) keeps the existing token.
- **Never** spread raw `body` into the session; only the three known keys pass.

## Client usage patterns

All calls hit the route with `baseURL: "/api/"` so they reach the Nitro route,
not the external backend. Pair with the `$api` plugin (`app/plugins/api.ts`).

### 1. Password login

```js
const { session, fetch: fetchSession, clear: clearSession } = useUserSession();
const { $api } = useNuxtApp();

// Browser hits backend directly (Node can't egress).
const res = await $api("/login", { method: "POST", body: { ...formData } });

if (res.status_code === 200) {
  const { token, user } = res.data ?? {};
  await $api("/auth/session", {
    baseURL: "/api/",
    method: "POST",
    body: { user, token, loggedInAt: Date.now() },
  });
  await fetchSession();            // refresh useUserSession() state
  await navigateTo("/dashboard");
} else {
  await clearSession();
}
```

### 2. Magic-link / token redirect

```js
const { token } = useRoute().query;
const { clear, fetch: fetchSession } = useUserSession();
await clear();                     // drop any stale session first

await useApi("/staff", {
  method: "GET",
  headers: { Authorization: `Bearer ${token}` },
  onResponse: async ({ response }) => {
    if (response._data?.status_code === 200) {
      const user = response._data?.data ?? {};
      const { $api } = useNuxtApp();
      await $api("/auth/session", {
        baseURL: "/api/",
        method: "POST",
        body: { user, token, loggedInAt: Date.now() },
      });
      await fetchSession();
      await navigateTo("/dashboard");
    }
  },
});
```

### 3. Re-seal after profile / password update (partial merge)

```js
const res = await $api("/user", { method: "POST", auth: true, body: formData });
if (res.status_code === 200) {
  // Only `user` — token is preserved by the deep-merge.
  await $api("/auth/session", {
    baseURL: "/api/",
    method: "POST",
    body: { user: res.data },
  });
}
```

Do this after a password change too, so flags like
`is_password_change_required` clear in the cookie that the `logged-in`
middleware reads.

### 4. Logout — no route call needed

Clearing is a client op; just drop the cookie:

```js
const { clear: clearSession } = useUserSession();
await $api("/logout", { method: "POST", auth: true });
await clearSession();
await navigateTo("/");
```

## How the rest of the app consumes the sealed cookie

- **`app/plugins/api.ts`** — `onRequest` reads `session.value.token` and sets
  `Authorization: Bearer …` for any `$api(url, { auth: true })` call.
  `onResponseError` clears the session and redirects on `401` /
  `Unauthenticated`.
- **Route middleware** (e.g. `logged-in`) — reads `loggedIn` / `session.user`;
  calls `await fetch()` first if `session.value` is empty (cold load).
- **Components / stores** — `const { session, loggedIn } = useUserSession()`.

## Gotchas

- Always `await fetchSession()` after sealing — `useUserSession()` reactive
  state does not update until you refetch.
- Interceptors in the `$api` plugin run **outside** Nuxt context; wrap
  `fetchSession()` / `clearSession()` / `navigateTo()` in
  `nuxtApp.runWithContext(...)`. Reading `session.value` is a plain ref read and
  needs no wrapping.
- `Date.now()` for `loggedInAt` is set on the **client** before POSTing.
