import createCli from './createCli.js'
import createInitCommand from '@sharpcli/init'
import createInstallCommand from '@sharpcli/install'
import './exception.js'

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
  createInstallCommand(program)

  program.parse(process.argv)
}
