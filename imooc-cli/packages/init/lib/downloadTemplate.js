import path from 'node:path'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import ora from 'ora'
import { execa } from 'execa'
import { printErrorLog, log } from '@sharpcli/utils'

/**
 * 获取缓存目录路径
 * 
 * 该函数用于根据给定的目标路径，构建并返回缓存目录的绝对路径
 * 主要用途是在于将缓存目录定位到目标路径下的node_modules目录中
 * 
 * @param {string} targetPath - 目标路径，表示缓存目录的父目录
 * @returns {string} 返回缓存目录的绝对路径
 */
function getCacheDir(targetPath) {
  return path.resolve(targetPath, 'node_modules')
}

/**
 * 创建缓存目录
 * 如果目标路径下的缓存目录不存在，则创建该目录及其所有父目录
 * 
 * @param {string} targetPath - 目标路径，用于确定缓存目录的位置
 */
function makeCacheDir(targetPath) {
  // 获取缓存目录路径
  const cacheDir = getCacheDir(targetPath)
  // 检查缓存目录是否已存在
  if (!pathExistsSync(cacheDir)) {
    // 创建缓存目录,路径下任何目录不存在都会创建
    fse.mkdirpSync(cacheDir)
  }
}

/**
 * 异步函数：下载并添加模板
 * 该函数通过npm安装指定版本的模板到目标路径
 * 
 * @param {string} targetPath 目标路径，即在哪里执行安装命令
 * @param {Object} template 包含模板信息的对象，必须有npmName和version属性
 */
async function downloadAddTemplate(targetPath, template) {
  // 从模板对象中解构出npm名称和版本
  const { npmName, version } = template
  // 定义安装命令为npm
  const installCommand = 'npm'
  // 定义安装参数，包括安装命令和具体模块名与版本
  const installArgs = [
    'install', // 安装命令
    `${npmName}@${version}` // 模块名
  ]
  // 设置当前工作目录为安装命令执行的目录
  const cwd = targetPath
  // 在日志中输出安装参数，用于调试
  log.verbose('installArgs', installArgs)
  // 在日志中输出当前工作目录，用于调试
  log.verbose('cwd', cwd)
  // 执行安装命令，并将输出和错误信息捕获
  const subprocess = execa(installCommand, installArgs, { cwd })
  // 等待安装命令执行完成
  await subprocess
}

/**
 * 异步函数：下载模板
 * 
 * 该函数用于下载并缓存用户选择的模板
 * 它接受一个包含目标路径和模板信息的对象作为参数
 * 没有返回值，但在下载过程中会使用 ora 库显示进度，并处理下载错误
 * 
 * @param {Object} selectedTemplate - 包含用户选择的模板信息和目标路径的对象
 * @param {string} selectedTemplate.targetPath - 用于保存模板的路径
 * @param {string} selectedTemplate.template - 模板的名称或URL
 */
export default async function downloadTemplate(selectedTemplate) {
  // 解构获取目标路径和模板信息
  const { targetPath, template } = selectedTemplate

  // 创建缓存目录，确保目标路径存在
  makeCacheDir(targetPath)

  // 开始下载模板的加载指示器
  const spin = ora('正在下载模板...').start()

  try {
    // 异步下载模板，如果下载成功，更新加载指示器状态
    await downloadAddTemplate(targetPath, template)
    spin.succeed('模板下载成功')
  } catch (e) {
    // 如果下载失败，更新加载指示器状态并打印错误日志
    spin.fail('模板下载失败')
    printErrorLog(e)
  }
}
