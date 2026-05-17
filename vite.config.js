import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  // build.outDir and publicDir are relative to the `root`
  root: "src",
  envDir: "../",
  build: {
    outDir: "../dist",
  },
  publicDir: "../public",
  plugins: [react({})],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@components": path.resolve(import.meta.dirname, "src/components"),
      "@hooks": path.resolve(import.meta.dirname, "src/hooks"),
      "@layouts": path.resolve(import.meta.dirname, "src/layouts"),
      "@pages": path.resolve(import.meta.dirname, "src/pages"),
      "@context": path.resolve(import.meta.dirname, "src/context"),
      "@loaders": path.resolve(import.meta.dirname, "src/loaders"),
      "@login": path.resolve(import.meta.dirname, "src/pages/login"),
    },
  },
});
