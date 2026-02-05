import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [
      react(),
      // Eliminar console.log/debug/info/warn solo en producción
      // Mantener console.error para debugging en producción
      mode === "production" &&
        removeConsole({
          includes: ["log", "debug", "info", "warn"],
        }),
    ].filter(Boolean),

    // Path aliases - @/ apunta a src/
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Server config
    server: {
      port: 5173,
      host: true,
      open: true,
    },

    // Build config
    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["lucide-react"],
          },
        },
      },
    },

    // Environment variables prefix
    envPrefix: "VITE_",
  };
});
