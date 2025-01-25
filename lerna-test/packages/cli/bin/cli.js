#!/usr/bin/env node

import cli from '../src/cli.js';
import chalk from 'chalk';
import a from '@shepardliu/lerna-test-a'
import b from '@shepardliu/lerna-test-b'
console.log(cli)
console.log(chalk.red('hello world'))
console.log(chalk.blue('hello world123'))
console.log(chalk.yellow('hello world123'))
// eslint-disable-next-line no-unused-expressions
cli().parse(process.argv.slice(2));
console.log(chalk.blue(a()))
console.log(chalk.blue(b()))
