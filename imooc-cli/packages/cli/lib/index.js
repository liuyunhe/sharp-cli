const commander = require('commander')

const { program } = commander

const pkg = require('../package.json')

const createInitCommand = require('@shepardliu/init')

const { log } = require('@shepardliu/utils')

module.exports = function (args) { 
  log.success('version', pkg.version)
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
  
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