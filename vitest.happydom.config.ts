import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["relay"],
      },
    }),
  ],
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    setupFiles: ["./tests/setup.happydom.ts"],
    testTimeout: 60000,
    hookTimeout: 30000,
    globals: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
