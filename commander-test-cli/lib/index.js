#!/usr/bin/env node

const commander = require('commander');

// 获取commander单例
// const { program } = commander;

// 手动实例化commander
const program = new commander.Command();

const pkg = require('../package.json');

program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d, --debug', '是否开启调试模式', false)
  .option('-e, --envName <envName>', '获取环境变量名称')


// const options = program.opts();
// console.log(options)

// commander 注册命令
const clone = program.command('clone <source> [destination]')
  
clone
  .usage('<source> [destination] [options]')
  .description('clone a repository into a newly created directory')
  .option('-f, --force', '是否强制克隆', false)
  .action((source, destination, commandObj) => {
    console.log('do clone', source, destination, commandObj.force)
  })

const del = program.command('delete <path>')

del
  .usage('<path>')
  .description('delete a file or directory')
  .option('-r, --recursive', '是否递归删除', false)
  .action((path, commandObj) => {
    console.log('do delete', path, commandObj.recursive)
  })

// addCommand 注册子命令

const service = new commander.Command('service').description('service management')

service
  .command('start [port]')
  .description('start a service at some port')
  .option('-d, --debug', '是否开启调试模式', false)
  .action((port, commandObj) => {
    console.log('do service start', port, commandObj.debug)
  })
service
  .command('stop')
  .description('stop the specified service')
  .action(() => {
    console.log('do service stop')
  })

program.addCommand(service)

program
  .command('install [name]', 'install one or more packages', {
    executableFile: '../../yargs-test-cli'
  })
  .alias('i')

// 定义程序推荐命令及其参数和描述
program
  .argument('<command>', 'command to run') // 必需的命令参数，指定要执行的命令
  .argument('[options]', 'options for the command') // 可选的参数，为命令提供额外的选项
  .description('command description') // 命令的描述，说明命令的用途或作用
  .action((cmd, options) => {
    // 当命令执行时，执行此函数
    // 参数 cmd: 用户输入的命令
    // 参数 options: 用户输入的命令选项
    console.log('do test', cmd, options)
  })

// program.outputHelp();
program.parse(process.argv);
