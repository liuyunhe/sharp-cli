'use strict'

import log from './log.js'
import isDebug from './isDebug.js'
import { makeList, makeInput, makePassword } from './inquirer.js'
import { getLatestVersion } from './npm.js'
import request from './request.js'
import Github from './git/Github.js'
import Gitee from './git/Gitee.js'
import {
  getGitPlatform,
  getGitOwn,
  getGitLogin,
  clearCache
} from './git/gitServer.js'
import { initGitServer, initGitType, createRemoteRepo } from './git/GitUtils.js'

export function printErrorLog(e, type) {
  if (isDebug()) {
    log.error(type, e)
  } else {
    log.error(type, e.message)
  }
}

export {
  log,
  isDebug,
  makeList,
  makeInput,
  makePassword,
  getLatestVersion,
  request,
  Github,
  Gitee,
  getGitPlatform,
  getGitOwn,
  getGitLogin,
  clearCache,
  initGitServer,
  initGitType,
  createRemoteRepo
}
