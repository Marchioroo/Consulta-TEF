export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],

  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Cal+Sans&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
          rel: "stylesheet",
        },
      ],
    },
  },

  vite: {
    server: {
      proxy: {
        "/instalador-tef": {
          target: "https://operacaodtef.linxsaas.com.br",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/instalador-tef/, ""),
        },
      },
    },
  },

  layout: "default",
  modules: ["@nuxt/image", "@nuxt/scripts", "@nuxt/ui", "@nuxt/content"],

  compatibilityDate: "2025-05-08",
});
