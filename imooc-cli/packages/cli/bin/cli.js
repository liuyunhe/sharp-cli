#!/usr/bin/env node

const importLocal = require('import-local')
const { log } = require('@shepardliu/utils')
const entry = require('../lib/index')

if (importLocal(__filename)) { 
  log.info('cli', '使用本地 sharp-cli 版本')
}else {
  entry(process.argv.slice(2)) // process.argv.slice(2) 去掉前两个参数
}