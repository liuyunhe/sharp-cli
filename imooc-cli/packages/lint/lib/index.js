import path from 'node:path'
import { ESLint } from 'eslint'
import { execa } from 'execa'
import ora from 'ora'
import jest from 'jest'
import Mocha from 'mocha'
import Command from '@sharpcli/command'
import { log, printErrorLog, makeList } from '@sharpcli/utils'
import vueConfig from './eslint/vueConfig.js'

class LintCommand extends Command {
  get command() {
    return 'lint'
  }

  get description() {
    return 'lint project'
  }

  get options() {
    return []
  }

  extractESLint(resultText, type) {
    const problems = /[0-9]+ problems/
    const warnings = /([0-9]+) warnings/
    const errors = /([0-9]+) errors/
    switch (type) {
      case 'problems':
        return resultText.match(problems)[0].match(/[0-9]+/)[0]
      case 'warnings':
        return resultText.match(warnings)[0].match(/[0-9]+/)[0]
      case 'errors':
        return resultText.match(errors)[0].match(/[0-9]+/)[0]
      default:
        return null
    }
  }

  parseESLintResult(resultText) {
    const problems = this.extractESLint(resultText, 'problems')
    const errors = this.extractESLint(resultText, 'errors')
    const warnings = this.extractESLint(resultText, 'warnings')
    return {
      problems: +problems || 0,
      errors: +errors || 0,
      warnings: +warnings || 0
    }
  }

  async action() {
    log.verbose('lint')
    // 1. eslint
    // 准备工作，安装依赖
    // "devDependencies": {
    //   "eslint-config-airbnb-base": "^15.0.0",
    //   "eslint-plugin-vue": "^9.32.0"
    // }
    const spinner = ora('正在安装依赖').start()
    try {
      await execa('npm', ['install', '-D', 'eslint-plugin-vue'])
      await execa('npm', ['install', '-D', 'eslint-config-airbnb-base'])
    } catch (e) {
      printErrorLog(e)
    } finally {
      spinner.stop()
    }
    log.info('正在执行eslint检查')
    // 执行工作，eslint
    const cwd = process.cwd()
    const eslint = new ESLint({
      cwd,
      overrideConfig: vueConfig
    })
    const results = await eslint.lintFiles(['src/**/*.js', 'src/**/*.vue'])
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)
    console.log(resultText)
    const eslintResult = this.parseESLintResult(resultText)
    log.verbose('eslintResult', eslintResult)
    log.success(
      'eslint检查完毕',
      '错误: ' + eslintResult.errors,
      '，警告: ' + eslintResult.warnings
    )
    // 2. jest
    log.info('自动执行jest测试')
    await jest.run('test')
    log.success('jest测试执行完毕')
    // 3. mocha
    log.info('自动执行mocha测试')
    const mochaInstance = new Mocha()
    mochaInstance.addFile(path.resolve(cwd, '__tests__/mocha_test.js'))
    mochaInstance.run(() => {
      log.success('mocha测试执行完毕')
    })
  }
}

function Lint(instance) {
  return new LintCommand(instance)
}

export default Lint
