import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import quickpickle from 'quickpickle';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['relay'],
      },
    }),
    quickpickle({
      worldConfig: {
        playwright: {
          launchOptions: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          },
        },
      },
    }),
  ],
  test: {
    include: ['tests/**/*.feature'],
    setupFiles: ['./tests/setup.js'],
    testTimeout: 60000,
    hookTimeout: 30000,
  },
});
