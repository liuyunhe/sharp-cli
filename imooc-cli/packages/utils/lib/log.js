import log from 'npmlog'
import isDebug from'./isDebug.js'

if (isDebug()) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

log.heading = 'sharp-cli' // 设置log前缀
log.addLevel('success', 2000, { fg: 'green',bg: 'black', bold: true }) // 自定义log级别

export default log