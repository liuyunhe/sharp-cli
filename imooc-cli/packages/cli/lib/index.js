import createCli from './createCli.js'

import createInitCommand from '@shepardliu/init'

// 导入日志记录器，用于全局日志输出
import { log, isDebug } from '@shepardliu/utils'


process.on('uncaughtException', (err) => {
  if (isDebug()) {
    console.log(err)
  } else {
    log.error(err.message)
  }
})

export default function (args) {
 
  const program =  createCli()
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
