import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt((process.env.VITE_PORT as string) || "5173"),
    strictPort: true,
    host: true,
    origin: `http://0.0.0.0:${process.env.VITE_PORT || 5173}`,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
