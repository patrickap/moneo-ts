import { defineConfig } from "oxlint";

export default defineConfig({
  env: {
    vitest: true,
  },
  ignorePatterns: ["dist/**", "node_modules/**"],
});
