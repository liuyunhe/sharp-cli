'use strict'

class Command {
  constructor(instance) {
    if (!instance) {
      throw new Error('command instance is required')
    }

    this.program = instance

    const cmd = this.program.command(this.command)

    cmd.description(this.description)

    cmd.hook('preAction', () => {
      this.preAction()
    })

    cmd.hook('postAction', () => {
      this.postAction()
    })

    if (this.options?.length > 0) {
      this.options.forEach((option) => {
        cmd.option(...option)
      })
    }

    cmd.action((...args) => {
      this.action(args)
    })
  }

  /**
   * 获取命令属性
   * 此属性应由子类实现，根据具体上下文返回相应的命令
   * @throws {Error} 抛出错误表示命令属性必须在子类中实现
   */
  get command() {
    // 抛出错误，命令必须实现
    throw new Error('command must be implemented')
  }

  /**
   * 获取描述信息
   *
   * 此属性访问器用于获取命令的描述信息由于每个命令的描述信息都是唯一的，
   * 因此需要在继承此类的子类中实现此方法，以提供具体命令的描述信息
   *
   * @throws {Error} 抛出错误，指示需要在子类中实现此方法
   */
  get description() {
    // 抛出错误，命令必须实现
    throw new Error('description must be implemented')
  }
  /**
   * 获取选项数组
   *
   * 该getter方法用于返回一个空的选项数组
   * 目前没有实现任何逻辑，但提供了一种可能在将来添加默认选项的方法
   *
   * @returns {Array} 返回一个空数组，表示当前没有可用的选项
   */
  get options() {
    return []
  }
  /**
   * 抽象方法action的getter
   * 此方法旨在强调子类必须覆盖此方法以提供具体实现
   * 如果尝试访问此属性而没有在子类中覆盖此方法，将抛出错误
   *
   * @throws {Error} 抛出错误以指示需要在子类中实现此方法
   */
  get action() {
    throw new Error('action must be implemented')
  }

  preAction() {
    // empty
  }

  postAction() {
    // empty
  }
}

export default Command
