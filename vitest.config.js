import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [
      // Browser-facing utility tests need a DOM environment
      ["shared/**/*.test.js", "jsdom"],
    ],
    coverage: {
      provider: "v8",
      include: ["worker/**/*.js", "shared/site-utils.js", "it-services/scripts.js", "ai-and-automation/scripts.js"],
      exclude: ["**/*.test.js"],
    },
  },
});
