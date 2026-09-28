// Declarative SSR-friendly data fetching — the Nuxt 4 `createUseFetch` pattern.
// This is the useFetch counterpart to the imperative `$api` plugin:
//   - useApi -> page/setup-time data (returns { data, status, refresh, ... })
//   - $api   -> event handlers / mutations (imperative)
// They are independent; useApi does not depend on $api.
//
// Function form is required so useRuntimeConfig()/useUserSession() run in setup
// context (a static object literal would call them at import time and throw).

export const useApi: typeof useFetch = createUseFetch((callerOptions = {}) => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  const {
    session,
    fetch: fetchSession,
    clear: clearSession,
  } = useUserSession();

  return {
    // In function form the factory's options override the caller's, so honor a
    // per-call baseURL override (e.g. local "/api/" routes) instead of clobbering it.
    // When ENABLE_PROXY is set, the default base routes through the same-origin
    // server proxy (/api/proxy) instead of the external API.
    baseURL: (callerOptions.baseURL ??
      (config.public.enableProxy
        ? "/api/proxy"
        : config.public.apiBase)) as string,

    // Per-call `auth: true` opts a request into the bearer token.
    // Set headers here (not as a factory `headers` object) so per-call headers
    // are augmented rather than clobbered by the shallow factory-options merge.
    async onRequest({ options }) {
      options.headers.set("Accept", "application/json");

      const { auth } = options as { auth?: boolean };
      if (!auth) return;

      // interceptors can run outside Nuxt context -> wrap composable calls
      if (!session.value) {
        await nuxtApp.runWithContext(() => fetchSession());
      }
      if (session.value?.token) {
        options.headers.set("Authorization", `Bearer ${session.value.token}`);
      }
    },

    // Auto-logout on 401, consistent with the $api plugin.
    async onResponseError({ response }) {
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
  };
});
