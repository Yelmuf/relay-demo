import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import quickpickle from "quickpickle";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["relay"],
      },
    }),
    quickpickle({
      worldConfig: {
        slowMo: 200,
        headless: false,
      },
    }),
  ],
  test: {
    browser: {
      name: "Chrome",
      ui: true,
    },
    include: ["tests/**/*.feature"],
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 60000,
    hookTimeout: 30000,
  },
});
