import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        env: {
          test: {
            plugins: [
              [
                'istanbul',
                {
                  include: ['src/**'],
                  extension: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx'],
                },
              ],
            ],
          },
        },
      },
    }),
  ],
  resolve: {
    alias: [{ find: '@tf/core', replacement: path.join(__dirname, '../core/src/index.ts') }],
  },
});
