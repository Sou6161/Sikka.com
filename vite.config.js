import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This exposes the server to your network
    port: 5173, // Default Vite port, change if needed
    proxy: {
      "/api": {
        target: "https://api.tokeninsight.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
