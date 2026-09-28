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
    "@nuxt/content",
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      enableProxy: process.env.enableProxy,
      xxx: process.env.xxx,
    },
  },
});
