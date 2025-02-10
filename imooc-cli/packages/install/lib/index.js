import Command from '@sharpcli/command'
import {
  log,
  makeList,
  Github,
  Gitee,
  getGitPlatform,
  makeInput
} from '@sharpcli/utils'

const PREV_PAGE = '${prev_page}'
const NEXT_PAGE = '${next_page}'
const SEARCH_MODE_REPO = 'search_repo'
const SEARCH_MODE_CODE = 'search_code'

class InstallCommand extends Command {
  get command() {
    return 'install'
  }

  get description() {
    return 'install project'
  }

  get options() {
    return [
      // ['-d, --dev', 'install dev dependencies'],
      // ['-g, --global', 'install global package'],
    ]
  }

  async action(params) {
    await this.generateGitAPI()
    await this.searchGitAPI()
  }

  async generateGitAPI() {
    let platform = getGitPlatform()
    if (!platform) {
      platform = await makeList({
        choices: [
          {
            name: 'Github',
            value: 'github'
          },
          {
            name: 'Gitee',
            value: 'gitee'
          }
        ],
        message: '请选择git平台'
      })
    }
    let gitAPI
    if (platform === 'github') {
      gitAPI = new Github()
    } else {
      gitAPI = new Gitee()
    }
    gitAPI.savePlatform(platform)
    await gitAPI.init()
    this.gitAPI = gitAPI
  }

  async searchGitAPI() {
    const platform = this.gitAPI.getPlatform()

    if (platform === 'github') {
      this.mode = await makeList({
        choices: [
          {
            name: '搜索仓库',
            value: SEARCH_MODE_REPO
          },
          {
            name: '搜索代码',
            value: SEARCH_MODE_CODE
          }
        ],
        message: '请选择搜索模式'
      })
    } else {
      this.mode = SEARCH_MODE_REPO
    }
    // 1. 收集搜索关键词和开发语言
    this.q = await makeInput({
      message: '请输入搜索关键词',
      validate(value) {
        if (value.length > 0) {
          return true
        } else {
          return '请输入搜索关键词'
        }
      }
    })
    this.language = await makeInput({
      message: '请输入开发语言'
    })
    log.verbose(
      'search key words',
      this.q,
      this.language,
      platform,
    )
    this.page = 1
    this.perPage = 10
    await this.doSearch()
  }
  async doSearch() {
    const platform = this.gitAPI.getPlatform()

    let count = 0
    let list = []
    let searchResult
    // 2. 生成搜索参数
    if (platform === 'github') {
      const params = {
        q: this.q + (this.language ? ` language:${this.language}` : ''),
        order: 'desc',
        sort: 'stars',
        per_page: this.perPage,
        page: this.page
      }
      log.verbose('search params', params)
      if (this.mode === SEARCH_MODE_REPO) { 
        searchResult = await this.gitAPI.searchRepositories(params)
        list = searchResult.items.map((item) => ({
          name: `${item.full_name}\n(${item.description})`,
          value: item.full_name
        }))
      } else {
        searchResult = await this.gitAPI.searchCode(params)
        list = searchResult.items.map((item) => ({
          name:
            item.repository.full_name + '\n' +
            (item.repository.description
              ? `(${item.repository.description})`
              : ''),
          value: item.repository.full_name
        }))
      }
      count = searchResult.total_count // 整体数据量
      log.verbose('searchResult.items.length', searchResult.items.length)
    }

    // 判断当前页面，已经是否到达最大页数
    if (
      (platform === 'github' && this.page * this.perPage < count) ||
      list.length > 0
    ) {
      list.push({
        name: '下一页',
        value: NEXT_PAGE
      })
    }
    if (this.page > 1) {
      list.unshift({
        name: '上一页',
        value: PREV_PAGE
      })
    }

    const keyword = await makeList({
      message:
        platform === 'github'
          ? `请选择要下载的项目（共${count}条数据）`
          : '请选择要下载的项目',
      choices: list
    })

    if (count > 0) {
      if (keyword === NEXT_PAGE) {
        await this.nextPage()
      } else if (keyword === PREV_PAGE) {
        await this.prevPage()
      } else {
        // 下载项目
        this.keyword = keyword
      }
    }
  }
  async nextPage() {
    this.page++
    await this.doSearch()
  }

  async prevPage() {
    this.page--
    await this.doSearch()
  }
}

function Install(instance) {
  return new InstallCommand(instance)
}
export default Install
