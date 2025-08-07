import type { Options } from 'tsdown'
// tsdown.config.ts
import { defineConfig } from 'tsdown'

function generateConfig(): Options {
  return {
    target: 'es2020',
    platform: 'browser',
    format: 'esm',
    clean: true,
    dts: true,
    entry: ['src/index.ts', 'src/plugins/*/index.ts', 'src/locales/*.ts'],
    outDir: 'dist/',
    treeshake: true,
  }
}

export default defineConfig([generateConfig()])
