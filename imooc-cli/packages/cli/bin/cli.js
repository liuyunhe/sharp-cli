#!/usr/bin/env node

import importLocal from 'import-local'
import { log } from '@sharpcli/utils'
import entry from '../lib/index.js'
// import { fileURLToPath } from 'node:url'
import { filename } from 'dirname-filename-esm'

// console.log(fileURLToPath(import.meta.url),import.meta.url)

// const __filename = fileURLToPath(import.meta.url)

const __filename = filename(import.meta)

log.verbose('__filename', __filename)

if (importLocal(__filename)) {
  log.info('cli', '使用本地 sharp-cli 版本')
} else {
  entry(process.argv.slice(2)) // process.argv.slice(2) 去掉前两个参数
}
