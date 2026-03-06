import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@data": resolve(__dirname, "../../data"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router"],
          "assistant-ui": ["@assistant-ui/react"],
          markdown: ["react-markdown", "rehype-highlight"],
        },
      },
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [resolve(__dirname, "../..")],
    },
  },
});
