// 导入日志记录器，用于全局日志输出
import { log, isDebug } from '@shepardliu/utils'

function printErrorLog(err, type) {
  if (isDebug()) {
    log.error(type, err)
  } else {
    log.error(type, err.message)
  }
}

process.on('uncaughtException', (e) => printErrorLog(e, 'error'))

process.on('unhandledRejection', (e) => printErrorLog(e, 'promise'))
