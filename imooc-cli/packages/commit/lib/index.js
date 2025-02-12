import path from 'node:path'
import fs from 'node:fs'
import fse from 'fs-extra'
import Command from '@sharpcli/command'
import {
  log,
  printErrorLog,
  initGitServer,
  initGitType,
  makeList
} from '@sharpcli/utils'

const CACHE_DIR = '.cli-imooc'
const FILE_GIT_PLATFORM = '.git_platform'

class CommitCommand extends Command {
  get command() {
    return 'commit'
  }

  get description() {
    return 'commit project'
  }

  get options() {
    return []
  }

  async action() {
    log.verbose('commit')
    this.createRemoteRepo()
  }

  // 阶段1：创建远程仓库
  async createRemoteRepo() {
    // 1. 实例化Git对象
    this.gitAPI = await initGitServer()
    console.log(this.gitAPI)
    return
    // 2. 仓库类型选择
    await initGitType(this.gitAPI)
    // 3. 创建远程仓库
    // 获取项目名称
    const dir = process.cwd()
    const pkg = fse.readJsonSync(path.resolve(dir, 'package.json'))
    this.name = pkg.name
    await createRemoteRepo(this.gitAPI, this.name)
    // 4. 生成.gitignore
    const gitIgnorePath = path.resolve(dir, '.gitignore')
    if (!fs.existsSync(gitIgnorePath)) {
      log.info('.gitignore不存在，开始创建')
      fs.writeFileSync(
        gitIgnorePath,
        `.DS_Store
          node_modules
          /dist


          # local env files
          .env.local
          .env.*.local

          # Log files
          npm-debug.log*
          yarn-debug.log*
          yarn-error.log*
          pnpm-debug.log*

          # Editor directories and files
          .idea
          .vscode
          *.suo
          *.ntvs*
          *.njsproj
          *.sln
          *.sw?`
      )
      log.success('.gitignore创建成功')
    }
  }
}

function Commit(instance) {
  return new CommitCommand(instance)
}

export default Commit
