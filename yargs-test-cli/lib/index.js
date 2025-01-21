#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const cli = yargs(hideBin(process.argv))

cli
  .scriptName('yargs-test-cli')
  .usage('Usage: $0 <command> [arguments] [options]')
  .demandCommand(
    1,
    'You need at least one command before moving on.Press --help for a list of available commands.'
  )
  .strict()
  .recommendCommands()
  .fail((msg, err, yargs) => {
    console.error(msg)
    // yargs.showHelp()
  })
  .alias('h', 'help')
  .alias('v', 'version')
  .wrap(cli.terminalWidth())
  .epilog('copyright 2025')
  .options({
    debug: {
      type: 'boolean',
      describe: 'debug mode',
      default: false,
      alias: 'd'
    }
  })
  .option('registry', {
    type: 'string',
    describe: 'Define global registry',
    alias: 'r'
  })
  .option('ci', {
    type: 'boolean',
    describe: 'CI mode',
    hidden: true,
    alias: 'c'
  })
  /*
   * hello <name> [others]
   * yargs-test-cli hello aaa
   * yargs-test-cli hello aaa -o bbb
   */
  .command(
    'hello <name> [others]',
    'welcome ter yargs!',
    (yargs) => {
      yargs.positional('name', {
        type: 'string',
        default: 'Shepard',
        describe: 'the name to say hello to'
      })
      yargs.option('others', {
        type: 'string',
        describe: 'the name to say hello to',
        alias: 'o'
      })
    },
    function (argv) {
      console.log('argv', argv)
      console.log(
        'hello',
        argv.name,
        argv.others ? 'and ' + argv.others + ' !' : '!',
        'welcome to yargs!'
      )
    }
  )
  /*
   * init [name]
   * yargs-test-cli init aaa -d -r npm
   */
  .command(
    'init [name]',
    'init project',
    (yargs) => {
      yargs.option('name', {
        type: 'string',
        describe: 'the name of the project',
        alias: 'n'
      })
    },
    (argv) => {
      console.log(argv)
    }
)
  /*
   * list
   * yargs-test-cli list -a
   * yargs-test-cli ls -a
   * yargs-test-cli la -a
   * yargs-test-cli ll -a
   * yargs-test-cli list --all
  */
  .command({
    command: 'list',
    desc: 'list files',
    aliases: ['ls','la','ll'],
    builder: (yargs) => {
      yargs.option('all', {
        type: 'boolean',
        describe: 'show all files',
        alias: 'a'
      })
    },
    handler: (argv) => {
      console.log('list files',argv)
    }
  })
  .group(['debug'], 'Dev Options:')
  .help().argv