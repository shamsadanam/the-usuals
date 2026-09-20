// Provides `$api`, a pre-configured $fetch instance (baseURL + auth header +
// global 401 logout). The instance is built once here instead of rebuilding
// options on every call like the `useLiveFetch` composable does.
//
// Usage:
//   const { $api } = useNuxtApp()
//   await $api('/profile', { auth: true })            // client-side requests
//   await useFetch('/courses', { $fetch: $api })      // SSR-safe data fetching
//
// Note: interceptors run OUTSIDE the Nuxt context, so any composable-backed
// call (fetchSession/clearSession/navigateTo) must be wrapped in
// nuxtApp.runWithContext(). Reading `session.value` is a plain ref read and
// needs no wrapping.
export default defineNuxtPlugin((nuxtApp) => {
  const {
    session,
    fetch: fetchSession,
    clear: clearSession,
  } = useUserSession();
  const config = useRuntimeConfig();

  // When ENABLE_PROXY is set, route requests through the same-origin server
  // proxy (/api/proxy) instead of hitting the external API directly.
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
      // if 401 (e.g. token invalidated by login from another device) then logout
      if (
        response.status === 401 ||
        (response._data as { message?: string })?.message === "Unauthenticated"
      ) {
        await nuxtApp.runWithContext(async () => {
          await clearSession();
          await navigateTo("/");
        });
      }
    },
  });

  return { provide: { api } };
});
