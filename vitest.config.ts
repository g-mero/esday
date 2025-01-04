import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'esday': `${path.resolve(__dirname, 'src')}`,
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    browser: {
      headless: true,
      enabled: false,
      provider: 'playwright',
      instances: [
        { browser: 'firefox' },
        { browser: 'chromium' },
        { browser: 'webkit' },
      ],
    },
  },
})
