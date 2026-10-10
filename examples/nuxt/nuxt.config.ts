// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
  ],
  runtimeConfig: {
    // Nuxt only maps NUXT_ALLOWED_DOMAINS onto a key declared here.
    allowedDomains: "",
    apiTargetUrl: process.env.NUXT_API_TARGET_URL || "",
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "",
      enableProxy:
        process.env.ENABLE_PROXY === "true" ||
        process.env.NUXT_PUBLIC_ENABLE_PROXY === "true",
    },
  },
});
