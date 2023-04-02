import { defineConfig } from "vite";
export default defineConfig({
  build: {
    outDir: "./docs",
  },
  base: "./",
  assetsInclude: ["**/*.glb"],
});
