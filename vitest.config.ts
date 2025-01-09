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
    onConsoleLog(log) {
      // HACK suppress moment.js deprecation warning from test file
      // 'test/plugins/toArray.test.ts > toArray plugin > should handle invalid dates gracefully'
      if (log.includes('Non RFC2822/ISO date formats are discouraged'))
        return false
      return true
    },
  },
})
