import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  css: {
    postcss: "./postcss.config.js",
  },

  define: {
    global: 'globalThis',
    process: {
      env: {
        II_URL: 'https://identity.internetcomputer.org/',
        CANISTER_ID_BACKEND: 'be2us-64aaa-aaaaa-qaabq-cai', // Dummy canister ID for local dev
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});