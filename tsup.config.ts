// tsup.config.ts
import { defineConfig, type Options } from 'tsup'

function generateConfig(jsx: boolean): Options {
  return {
    target: 'esnext',
    platform: 'browser',
    format: 'esm',
    clean: true,
    dts: !jsx,
    entry: ['src/index.ts', 'src/plugins/*/index.ts', 'src/locales/*.ts'],
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
  }
}

export default defineConfig([generateConfig(false)])
