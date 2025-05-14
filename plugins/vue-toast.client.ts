// ~/plugins/vue-toast.client.ts
import { defineNuxtPlugin } from "#app";
import VueToast from "vue-toast-notification";
// importe o tema que preferir:
import "vue-toast-notification/dist/theme-sugar.css";

export default defineNuxtPlugin((nuxtApp) => {
  // aqui você pode passar opções globais, como posição, duração etc.
  nuxtApp.vueApp.use(VueToast, {
    position: "top-right",
    duration: 3000,
    
  });
});
