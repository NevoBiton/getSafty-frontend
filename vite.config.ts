import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Set the limit to a higher value (in kB)
  },
});
