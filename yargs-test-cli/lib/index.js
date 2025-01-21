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
  .fail((msg, err, yargs) => {
    if (err) throw err // preserve stack
    console.error(msg)
    yargs.showHelp()
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
        describe: 'the name to say hello to'
      })
    },
    function (argv) {
      console.log('argv', argv)
      console.log('hello', argv.name, argv.options || '', 'welcome to yargs!')
    }
  )
  .group(['debug'], 'Dev Options:')
  .help().argv