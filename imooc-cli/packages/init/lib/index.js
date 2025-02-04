'use strict'

import Command from '@sharpcli/command'
import { log } from '@sharpcli/utils'
import createTemplate from './createTemplate.js'
import downloadTemplate from './downloadTemplate.js'
import installTemplate from './installTemplate.js'

/**
 * 初始化命令
 * 
 * sharp-cli init aaa -t project --tp template-react -f
 * 
 * 或
 * 
 * sharp-cli init 
 *
 * @class
 * @extends Command
 * @param {Object} instance - 命令行实例
 */
class InitCommand extends Command {
  /**
   * 获取初始化命令
   *
   * 此属性返回用于初始化的命令格式
   * 命令格式为 'init [name]'，其中 [name] 是一个可选参数
   *
   * @returns {string} 初始化命令的格式
   */
  get command() {
    return 'init [name]'
  }

  /**
   * 获取项目初始化描述
   *
   * 此方法用于返回项目初始化过程的简要描述它没有参数，也不依赖于外部输入，
   *
   * @returns {string} 项目初始化的描述
   */
  get description() {
    return 'init a project'
  }

  /**
   * 获取命令行选项说明
   *
   * 返回一个包含命令行选项的数组，每个元素都是一个选项的描述
   *
   * @returns {Array} 包含命令行选项说明的数组
   */
  get options() {
    return [
      ['-f, --force', 'overwrite target directory if it exists', false],
      ['-t, --type <type>', '项目类型 (值：project/page)'],
      ['--tp, --template <template>', '模版名称']
    ]
  }

  /**
   * 执行初始化操作
   *
   * 此函数用于执行某些初始化操作它接受一个包含名称和选项的对象数组作为参数，
   * 并在控制台输出初始化信息
   *
   * @param {Array} [name, opts] - 一个数组，包含初始化操作的名称和选项
   *   - name {string} - 初始化操作的名称
   *   - opts {Object} - 初始化操作的选项
   * @returns {undefined} 此函数不返回任何值
   */
  async action([name, opts]) {
    log.verbose('do init', name, opts)
    // 1.选择项目模板，生成项目信息
    const selectedTemplate = await createTemplate(name, opts)
    log.verbose('selectedTemplate', selectedTemplate)
    // 2.下载项目模板至缓存目录
    await downloadTemplate(selectedTemplate)
    // 3.安装项目模版至项目目录
    await installTemplate(selectedTemplate, opts)
  }
  preAction() {
    log.verbose('init preAction')
  }
  postAction() {
    log.verbose('init postAction')
  }
}

function Init(instance) {
  return new InitCommand(instance)
}

export default Init
