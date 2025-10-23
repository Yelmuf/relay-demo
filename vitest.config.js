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
      explodeTags: [
        { tag: '@focus', name: 'only' },
      ],
    }),
  ],
  test: {
    include: ['**/*.feature'],
    setupFiles: ['./tests/setup.js'],
    testTimeout: 60000,
  },
});
