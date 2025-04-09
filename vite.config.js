import { defineConfig } from "vite";
import reactJsxPlugin from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [reactJsxPlugin(), tailwindcss()],
  server: {
    port: 8080,
  },
  build: {
    sourcemap: true,
    minify: false,
  },
});
