import createCli from './createCli.js'
import createInitCommand from '@sharpcli/init'
import createInstallCommand from '@sharpcli/install'
import createLintCommand from '@sharpcli/lint'
import createCommitCommand from '@sharpcli/commit'
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
  createLintCommand(program)
  createCommitCommand(program)

  program.parse(process.argv)
}
