import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components": "/src/components",
      "@/pages": "/src/pages",
      "@/services": "/src/services",
      "@/hooks": "/src/hooks",
      "@/utils": "/src/utils",
      "@/types": "/src/types",
      "@/api": "/src/api",
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      '../tests/frontend/**/*.test.ts',
      '../tests/frontend/**/*.test.tsx',
    ],
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
});
