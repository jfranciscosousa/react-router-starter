import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    checker({
      enableBuild: false,
      eslint: {
        lintCommand: "lint",
        useFlatConfig: true,
      },
      typescript: true,
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
