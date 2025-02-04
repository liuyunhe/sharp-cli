'use strict'

import Command from '@sharpcli/command'
import { log } from '@sharpcli/utils'
import createTemplate from './createTemplate.js'


class InitCommand extends Command {

  /**
   * 获取初始化命令
   *
   * 此属性返回用于初始化的命令格式
   * 命令格式为 'init <name>'，其中 <name> 是一个占位符
   *
   * @returns {string} 初始化命令的格式
   */
  get command() {
    return 'init <name>'
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
      ['-p, --preview', '是否开启预览模式', false]
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
  action([name, opts]) {
    log.verbose('do init', name, opts)
    createTemplate(name, opts)
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
