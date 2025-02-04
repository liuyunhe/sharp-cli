import path from 'node:path'
import fse from 'fs-extra'
import ora from 'ora'
import { pathExistsSync } from 'path-exists'
import { log } from '@sharpcli/utils'

function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template)
  const fileList = fse.readdirSync(originFile)
  log.verbose('copyFile', fileList)
  const spinner = ora(`正在拷贝模板 ${template.npmName}`).start()
  fileList.forEach((file) => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)
  })
  spinner.succeed('模版拷贝完成')
}

/**
 * 异步函数，用于安装选定的模板到指定路径
 *
 * @param {Object} selectedTemplate - 包含模板信息的对象，包括目标路径、模板路径和模板名称
 * @param {Object} opts - 选项对象
 * @param {boolean} opts.force - 是否强制安装模板，如果目标目录已存在且force为true，则会删除现有目录并重新安装
 */
export default async function installTemplate(selectedTemplate, opts) {
  // 解构赋值，获取force选项，默认为false
  const { force = false } = opts
  // 解构赋值，获取模板的目标路径、模板路径和名称
  const { targetPath, template, name } = selectedTemplate
  // 获取当前工作目录
  const rootDir = process.cwd()
  // 确保目标路径的目录存在
  fse.ensureDirSync(targetPath)
  // 构建安装目录的绝对路径
  const installDir = path.resolve(`${rootDir}/${name}`)
  // 检查安装目录是否已存在
  if (pathExistsSync(installDir)) {
    // 如果强制安装选项为true
    if (force) {
      // 删除现有的安装目录
      fse.removeSync(installDir)
      // 确保安装目录重新创建
      fse.ensureDirSync(installDir)
    } else {
      // 如果安装目录已存在且不强制安装，则记录错误信息并返回
      log.error(`当前目录下已存在${installDir}文件夹`)
      return
    }
  } else {
    // 如果安装目录不存在，则创建它
    fse.ensureDirSync(installDir)
  }
  // 复制模板文件到安装目录
  copyFile(targetPath, template, installDir)
}
