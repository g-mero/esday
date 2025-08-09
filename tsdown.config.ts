import { readdirSync } from 'node:fs'
import type { Options } from 'tsdown'

// tsdown.config.ts

function snakeToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function generateConfig(): Options[] {
  const nodeOpt: Options = {
    target: 'es2020',
    platform: 'node',
    clean: true,
    dts: true,
    entry: ['src/index.ts', 'src/plugins/*/index.ts', 'src/locales/*.ts'],
    outDir: 'dist/',
    treeshake: true,
  }

  // 生成 browser 环境的 iife 格式配置
  const browserEntries = [
    { entry: 'src/browser.ts', name: 'esday', dir: '' },
    ...readdirSync('src/plugins').map((dir) => ({
      entry: `src/plugins/${dir}/index.ts`,
      name: `${dir}Plugin`,
      dir: 'plugins',
    })),
    ...readdirSync('src/locales')
      .filter((f) => f.endsWith('.ts'))
      .map((f) => ({
        entry: `src/locales/${f}`,
        name: snakeToCamel(`locale-${f.replace('.ts', '')}`),
        dir: 'locales',
      })),
  ]

  const browserOpts: Options[] = browserEntries.map((item) => ({
    target: 'es2020',
    platform: 'browser',
    format: 'iife',
    clean: false,
    dts: false,
    entry: [item.entry],
    name: item.name,
    outputOptions: {
      name: item.name,
      dir: undefined,
      file: `./dist/browser/${item.dir}/${item.name}.min.js`,
    },
    treeshake: true,
    minify: true,
  }))

  return [nodeOpt, ...browserOpts]
}

export default generateConfig()
