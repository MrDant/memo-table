// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  ssr: false, // Mode SPA pour GitHub Pages
  app: {
    buildAssetsDir: '/_nuxt/'
  },
  tailwindcss: {
    exposeConfig: false,
    viewer: false,
    config: {
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app/**/*.vue",
        "./error.vue",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
  }
})
