import path from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'dev/*'],
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      esday: `${path.resolve(__dirname, 'src')}`,
    },
    coverage: {
      exclude: [...configDefaults.exclude, 'dev/**', 'scripts/**'],
      reporter: ['text', 'json', 'html'],
    },
    browser: {
      headless: true,
      enabled: false,
      provider: 'playwright',
      screenshotFailures: false,
      instances: [{ browser: 'firefox' }, { browser: 'chromium' }, { browser: 'webkit' }],
    },
    onConsoleLog(log) {
      // HACK suppress moment.js deprecation warning from test file
      // 'test/plugins/toArray.test.ts > toArray plugin > should handle invalid dates gracefully'
      if (log.includes('Non RFC2822/ISO date formats are discouraged')) return false
      return true
    },
  },
})
