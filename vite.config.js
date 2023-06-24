import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { ViteAliases } from "vite-aliases";

export default defineConfig({
  // build.outDir and publicDir are relative to the `root`
  root: "src",
  envDir: "../",
  build: {
    outDir: "../dist",
  },
  publicDir: "../public",
  plugins: [react({}), ViteAliases({ prefix: "@" })],
});
