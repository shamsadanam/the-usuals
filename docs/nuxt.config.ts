// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@vueuse/nuxt", "@nuxt/content"],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
  app: {
    head: {
      titleTemplate: "%s · The Usuals Docs",
      title: "The Usuals Documentation",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Reusable components, composables, and patterns for Vue 3 and Nuxt 4.",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", sizes: "any", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      ],
    },
  },
});
