import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, ".", "");
    return {
        plugins: [react()],
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
