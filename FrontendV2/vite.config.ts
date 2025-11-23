import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["insta.the1s.de"],
    port: 8101,
    watch: { usePolling: true },
    hmr: {
      host: "insta.the1s.de",
      port: 8101,
      protocol: "wss",
    },
  },
});
