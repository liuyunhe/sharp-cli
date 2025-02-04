import path from 'node:path'

import { program } from 'commander'

import { dirname } from 'dirname-filename-esm'

// 引入semver模块用于解析和比较软件版本号
import semver from 'semver'

import chalk from 'chalk'

import fse from 'fs-extra'

import { log } from '@sharpcli/utils'

// import pkg from '../package.json'

const __dirname = dirname(import.meta)

log.verbose('__dirname', __dirname)

log.verbose('process.cwd()', process.cwd())

// console.log('import.meta',import.meta)

const pkgPath = path.resolve(__dirname, '../package.json')

const pkg = fse.readJsonSync(pkgPath)

const LOWEST_NODE_VERSION = '18.0.0'

/**
 * 检查当前Node.js版本是否满足最低要求
 *
 * 该函数首先记录当前Node.js版本信息，然后判断该版本是否大于等于预定义的最低Node.js版本
 * 如果当前版本不满足要求，函数将抛出错误，提示用户需要的最低Node.js版本
 */
function checkNodeVersion() {
  // 记录当前Node.js版本信息
  log.verbose('node version', process.version)
  // 判断当前Node.js版本是否大于等于最低要求版本，如果不是，则抛出错误
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(
      chalk.red(
        `shepard-cli 需要Node.js版本${LOWEST_NODE_VERSION}以上，当前版本为${process.version}`
      )
    )
  }
}

function preAction(opts) {
  checkNodeVersion()
}

export default function createCli() {
  log.success('shepard-cli version', pkg.version)

  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .hook('preAction', preAction)
  
  program.on('option:debug', function () {
    if (program.opts().debug) {
      log.verbose('开启调试模式')
    }
  })

  program.on('command:*', function (obj) {
    log.error('未知的命令:' + obj[0])
  })

  return program
}
