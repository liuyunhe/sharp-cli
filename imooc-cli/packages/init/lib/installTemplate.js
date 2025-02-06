import path from 'node:path'
import fse from 'fs-extra'
import ora from 'ora'
import { pathExistsSync } from 'path-exists'
import ejs from 'ejs'
import { glob } from 'glob'
import { log, makeInput, makeList } from '@sharpcli/utils'

/**
 * 根据目标路径和模板对象生成缓存文件路径
 *
 * @param {string} targetPath - 目标路径，用于定位缓存文件的位置
 * @param {Object} template - 模板对象，包含模板的npm名称等信息
 * @returns {string} 返回缓存文件的绝对路径
 */
function getCacheFilePath(targetPath, template) {
  // 使用path.resolve方法构建并返回缓存文件的绝对路径
  // 路径组成部分包括：目标路径、'node_modules'、模板的npm名称、'template'
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

/**
 * 根据目标路径和模板信息获取插件文件的路径
 * 此函数用于计算插件文件的绝对路径，以便在给定的目标路径和模板信息下定位到具体的插件文件
 * 它通过拼接目标路径、'node_modules'、模板的npm名称、'template'、'plugins'和'index.js'来构建最终路径
 * 
 * @param {string} targetPath - 目标路径，这是构建最终插件路径的起始点
 * @param {Object} template - 包含模板信息的对象，必须包含npmName属性，用于构建路径
 * @returns {string} 返回构建的插件文件的绝对路径
 */
function getPluginFilePath(targetPath, template) {
  // 使用path.resolve方法构建并返回缓存文件的绝对路径
  // 路径组成部分包括：目标路径、'node_modules'、模板的npm名称、'template'、'plugins'、'index.js'
  return path.resolve(targetPath, 'node_modules', template.npmName, 'plugins', 'index.js')
}

/**
 * 复制文件到指定目录
 *
 * 本函数用于将缓存文件夹中的模板文件复制到指定的安装目录中
 * 主要用于初始化项目或配置环境时，将预定义的模板文件复制到用户指定的位置
 *
 * @param {string} targetPath - 目标路径，用于确定缓存文件夹的位置
 * @param {object} template - 模板对象，包含模板的npm名称等信息，用于确定缓存文件夹的位置
 * @param {string} installDir - 安装目录，即目标目录，文件将被复制到此目录下
 */
function copyFile(targetPath, template, installDir) {
  // 获取缓存文件夹路径
  const originFile = getCacheFilePath(targetPath, template)
  // 读取缓存文件夹中的所有文件
  const fileList = fse.readdirSync(originFile)
  // 记录日志：显示缓存文件夹中的所有文件
  log.verbose('copyFile', fileList)
  // 创建一个加载指示器，显示正在复制模板文件
  const spinner = ora(`正在拷贝模板 ${template.npmName}`).start()
  // 遍历文件列表，将每个文件从缓存文件夹复制到目标目录
  fileList.forEach((file) => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)
  })
  // 加载指示器显示成功信息：模板文件复制完成
  spinner.succeed('模版拷贝完成')
}

/**
 * 使用EJS模板引擎渲染文件
 * 
 * @param {string} installDir - 文件搜索的根目录
 * @param {Object} template - 模板对象，包含忽略项和值
 * @param {string} name - 传递给模板的数据名称
 */
async function ejsRender(targetPath, installDir, template, name) {
  // 解构模板对象，获取忽略项数组和值，如果未提供则使用默认空数组
  const { ignore = [] } = template
  let data = {}
  // 执行插件
  const pluginPath = getPluginFilePath(targetPath, template)
  log.verbose('pluginPath', pluginPath)
  if (pathExistsSync(pluginPath)) {
    const pluginFn = (await import(`file://${pluginPath}`)).default
    log.verbose('pluginFn', pluginFn)
    const api = {
      makeList,
      makeInput
    }
    data = await pluginFn(api)
  }
  // 创建包含名称数据的对象，用于EJS模板渲染
  const ejsData = {
    data: {
      name,
      ...data
    }
  }
  // 使用glob函数异步获取安装目录下所有文件路径，忽略node_modules目录和其他指定的忽略项
  glob('**', {
    cwd: installDir,
    nodir: true,
    ignore: [...ignore, '**/node_modules/**']
  }).then((files) => {
    // 遍历每个文件路径
    files.map((file) => {
      // 解析文件的绝对路径
      const filePath = path.resolve(installDir, file)
      // 记录文件路径的日志信息
      log.verbose('ejsRenderFilePath', filePath)
      // 使用EJS模板引擎渲染文件，传入数据和回调函数处理错误或写入结果
      ejs.renderFile(filePath, ejsData, (err, result) => {
        if (err) {
          // 如果发生错误，记录错误信息
          log.error(err)
        } else {
          // 如果没有错误，将渲染结果写回文件
          fse.writeFileSync(filePath, result)
        }
      })
    })
  })
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
  // 使用ejs模板引擎渲染安装目录中的文件
  await ejsRender(targetPath, installDir, template, name)
}
