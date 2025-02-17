import path from 'node:path'
import { homedir } from 'node:os'
import fs from 'node:fs'
import { pathExistsSync } from 'path-exists'
import fse from 'fs-extra'
import { execa } from 'execa'
import { makePassword } from '../inquirer.js'
import log from '../log.js'

const TEMP_HOME = '.cli-imooc'
const TEMP_TOKEN = '.token'
const TEMP_PLATFORM = '.git_platform'
const TEMP_OWN = '.git_own'
const TEMP_LOGIN = '.git_login'

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN)
}

function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM)
}

function createOwnPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_OWN)
}

function createLoginPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_LOGIN)
}

export function getGitPlatform() {
  const platformPath = createPlatformPath()
  if (pathExistsSync(platformPath)) {
    return fse.readFileSync(platformPath).toString().trim()
  } else {
    return null
  }
}

function getProjectPath(cwd, fullName) {
  const projectName = fullName.split('/')[1] // vuejs/vue => vue
  return path.resolve(cwd, projectName)
}

function getPackageJson(cwd, fullName) {
  const projectPath = getProjectPath(cwd, fullName)
  const pkgPath = path.resolve(projectPath, 'package.json')
  if (pathExistsSync(pkgPath)) {
    return fse.readJsonSync(pkgPath)
  }
  return null
}

/**
 * 从缓存中获取仓库类型
 *
 * user或org
 */
export function getGitOwn() {
  if (pathExistsSync(createOwnPath())) {
    return fs.readFileSync(createOwnPath()).toString()
  }
  return null
}
/**
 * 从缓存中获取仓库登录用户名
 *
 */
export function getGitLogin() {
  if (pathExistsSync(createLoginPath())) {
    return fs.readFileSync(createLoginPath()).toString()
  }
  return null
}

/**
 * 清除缓存文件
 *
 * 此函数负责清除应用中的缓存文件，包括平台、令牌、个人和登录信息
 */
export function clearCache() {
  const platform = createPlatformPath()
  const token = createTokenPath()
  const own = createOwnPath()
  const login = createLoginPath()
  fse.removeSync(platform)
  fse.removeSync(token)
  fse.removeSync(own)
  fse.removeSync(login)
}

export default class GitServer {
  constructor() {}

  /**
   * 异步初始化方法
   *
   * 本方法主要用于初始化过程中加载或获取token，并确保token被持久化
   * 以便于后续的使用
   */
  async init() {
    // 判断token是否录入
    const tokenPath = createTokenPath()
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString().trim()
    } else {
      this.token = await this.getToken()
      fs.writeFileSync(tokenPath, this.token)
    }
    log.verbose('token', tokenPath, this.token)
  }
  async getToken() {
    const token = await makePassword({
      message: '请输入token信息'
    })
    return token
  }
  savePlatform(platform) {
    this.platform = platform
    const platformPath = createPlatformPath()
    fs.writeFileSync(platformPath, platform)
    log.verbose('platform', platformPath, platform)
  }

  saveOwn(own) {
    this.own = own
    fs.writeFileSync(createOwnPath(), own)
  }

  saveLogin(login) {
    this.login = login
    fs.writeFileSync(createLoginPath(), login)
  }
  getPlatform() {
    return this.platform
  }

  getOwn() {
    return this.own
  }

  getLogin() {
    return this.login
  }

  cloneRepo(fullName, tag) {
    if (tag) {
      return execa('git', ['clone', this.getRepoUrl(fullName), '-b', tag])
    } else {
      return execa('git', ['clone', this.getRepoUrl(fullName)])
    }
  }

  installDependencies(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName)
    if (pathExistsSync(projectPath)) {
      return execa(
        'npm',
        ['install', '--registry=https://registry.npmmirror.com'],
        { cwd: projectPath }
      )
    }
    return null
  }

  async runRepo(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName)
    const pkg = getPackageJson(cwd, fullName)
    if (pkg) {
      const { scripts, bin, name } = pkg
      // if (bin) {
      //   await execa(
      //     'npm',
      //     ['install', '-g', name, '--registry=https://registry.npmmirror.com'],
      //     { cwd: projectPath, stdout: 'inherit' }
      //   )
      // }
      if (scripts && scripts.dev) {
        return execa('npm', ['run', 'dev'], {
          cwd: projectPath,
          stdout: 'inherit'
        })
      } else if (scripts && scripts.start) {
        return execa('npm', ['start'], { cwd: projectPath, stdout: 'inherit' })
      } else {
        log.warn('未找到启动命令')
      }
    }
  }

  getUser() {
    throw new Error('getUser must be implemented!')
  }

  getOrg() {
    throw new Error('getOrg must be implemented!')
  }

  createRepo() {
    throw new Error('createRepo must be implemented!')
  }
}
