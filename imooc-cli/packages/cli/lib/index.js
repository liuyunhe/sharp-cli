const commander = require('commander')

const { program } = commander

const pkg = require('../package.json')

const createInitCommand = require('@shepardliu/init')

// 导入日志记录器，用于全局日志输出
const { log,isDebug } = require('@shepardliu/utils')

// 引入semver模块用于解析和比较软件版本号
const semver = require('semver')

const chalk = require('chalk')

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

process.on('uncaughtException', (err) => {
  if (isDebug()) {
    console.log(err)
  } else { 
    log.error(err.message)
  }
})

module.exports = function (args) {
  log.success('shepard-cli version', pkg.version)
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .hook('preAction', preAction)

  // program
  //   .command('init [name]')
  //   .description('init project')
  //   .option('-f, --force', 'overwrite target directory if it exists', false)
  //   .action((name, opts) => {
  //     console.log('do init', name, opts)
  //   })
  createInitCommand(program)

  program.parse(process.argv)
}
