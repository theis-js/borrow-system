import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
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
