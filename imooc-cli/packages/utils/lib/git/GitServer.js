import path from 'node:path'
import { homedir } from 'node:os'
import fs from 'node:fs'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import { makePassword } from '../inquirer.js'
import log from '../log.js'

const TEMP_HOME = '.cli-imooc'
const TEMP_TOKEN = '.token'
const TEMP_PLATFORM = '.git_platform'

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN)
}

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM)
}

export function getGitPlatform() {
  const platformPath = createPlatformPath()
  if (pathExistsSync(platformPath)) {
    return fse.readFileSync(platformPath).toString().trim()
  } else {
    return null
  }
}

export default class GitServer {
  constructor() {}
  async init() {
    // 判断token是否录入
    const tokenPath = createTokenPath()
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString().trim()
    } else {
      this.token = await this.getToken()
      fs.writeFileSync(tokenPath, this.token)
    }
    log.verbose('token', this.token)
    log.verbose('token path', tokenPath, pathExistsSync(tokenPath))
  }
  async getToken() {
    const token = await makePassword({
      message: '请输入token信息'
    })
    return token
  }
  savePlatform(platform) {
    const platformPath = createPlatformPath()
    fs.writeFileSync(platformPath, platform)
    log.verbose('platform', platformPath, platform)
  }
}
