import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["admin.insta.the1s.de"],
    port: 8103,
    watch: { usePolling: true },
    hmr: {
      host: "admin.insta.the1s.de",
      port: 8103,
      protocol: "wss",
    },
  },
});
