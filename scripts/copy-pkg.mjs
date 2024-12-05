/* eslint-disable node/prefer-global/process */
import fs from 'node:fs/promises'
import path from 'node:path'

const sourcePath = path.join(process.cwd(), 'package.json') // 根目录下的 package.json
const destPath = path.join(process.cwd(), 'dist', 'package.json') // 目标路径是 dist/package.json

async function copyPackageJson() {
  try {
    // 确保 dist 目录存在
    await fs.mkdir(path.join(process.cwd(), 'dist'), { recursive: true })

    // 复制文件
    await fs.copyFile(sourcePath, destPath)
    console.log('package.json copied to dist')
  }
  catch (err) {
    console.error('Error copying package.json:', err)
  }
}

copyPackageJson()
