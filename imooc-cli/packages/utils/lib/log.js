const log = require('npmlog')

if (process.argv.includes('--debug') || process.argv.includes('-d')) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

log.heading = 'sharp' // 设置log前缀
log.addLevel('success', 2000, { fg: 'green',bg: 'black', bold: true }) // 自定义log级别

module.exports = log