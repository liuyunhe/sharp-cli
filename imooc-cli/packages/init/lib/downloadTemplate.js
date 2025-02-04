import path from 'node:path'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import { execa } from 'execa'
import { printErrorLog, log } from '@sharpcli/utils'

function getCacheDir(targetPath) {
  return path.resolve(targetPath, 'node_modules')
}

function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath)
  if (!pathExistsSync(cacheDir)) {
    // 创建缓存目录,路径下任何目录不存在都会创建
    fse.mkdirpSync(cacheDir)
  }
}

async function downloadAddTemplate(targetPath, template) {
  const { npmName, version } = template
  const installCommand = 'npm'
  const installArgs = [
    'install', // 安装命令
    `${npmName}@${version}` // 模块名
  ]
  const cwd = targetPath
  log.verbose('installArgs', installArgs)
  log.verbose('cwd', cwd)
  const subprocess = execa(installCommand, installArgs, { cwd })
  await subprocess
}

export default async function downloadTemplate(selectedTemplate) {
  const { targetPath, template } = selectedTemplate
  makeCacheDir(targetPath)
  const spin = ora('正在下载模板...').start()
  try {
    await downloadAddTemplate(targetPath, template)
    spin.succeed('模板下载成功')
  } catch (e) {
    spin.fail('模板下载失败')
    printErrorLog(e)
  }
}
