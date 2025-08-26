import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './app/e2e',
  workers: 1
});
