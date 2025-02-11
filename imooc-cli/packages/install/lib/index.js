import ora from 'ora'
import Command from '@sharpcli/command'
import {
  log,
  makeList,
  Github,
  Gitee,
  getGitPlatform,
  makeInput,
  printErrorLog
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
    log.verbose('full_name', this.keyword)
    await this.selectTags()
    log.verbose('selected_tag', this.selectedTag)
    await this.downloadRepo()
    await this.installDependencies()
    await this.runRepo()
  }

  /**
   * 异步生成GitAPI实例
   *
   * 此函数负责根据用户选择的Git平台创建相应的GitAPI实例（Github或Gitee）
   * 它首先检查是否有已选择的平台，如果没有，则提示用户选择一个平台
   * 根据用户的选择，创建对应平台的API实例，保存平台信息，并进行初始化
   */
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

  /**
   * 异步执行Git API搜索
   *
   * 此函数首先确定当前的平台（GitHub或其他），然后根据平台选择搜索模式
   * 在GitHub平台上，用户可以选择搜索仓库或搜索代码；对于其他平台，仅搜索仓库
   * 之后，收集用户输入的搜索关键词和开发语言，记录搜索的关键信息，并执行搜索
   */
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
    log.verbose('search key words', this.q, this.language, platform)
    this.page = 1
    this.perPage = 10
    await this.doSearch()
  }

  /**
   * 执行搜索操作
   * 此函数根据当前设置的参数，调用GitAPI来搜索相关的项目或代码
   * 它处理两个平台（GitHub和Gitee）的搜索逻辑，并根据搜索结果生成一个列表
   * 如果有更多页面的结果，它还会在列表中添加“下一页”和/或“上一页”选项
   * 最后，如果搜索结果不为空，它会提示用户选择要下载的项目
   */
  async doSearch() {
    const platform = this.gitAPI.getPlatform()

    let count = 0
    let list = []
    let searchResult
    // 2. 生成搜索参数
    if (platform === 'github') {
      // github
      const params = {
        q: this.q + (this.language ? ` language:${this.language}` : ''),
        order: 'desc',
        // sort: 'stars',
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
            item.repository.full_name +
            '\n' +
            (item.repository.description
              ? `(${item.repository.description})`
              : ''),
          value: item.repository.full_name
        }))
      }
      count = searchResult.total_count // 整体数据量
      log.verbose('searchResult.items.length', searchResult.items.length)
    } else {
      // gitee
      const params = {
        q: this.q,
        order: 'desc',
        // sort: 'stars_count',
        per_page: this.perPage,
        page: this.page
      }
      if (this.language) {
        params.language = this.language // 注意输入格式：JavaScript
      }
      log.verbose('search params', params)
      searchResult = await this.gitAPI.searchRepositories(params)
      count = 9999999
      list = searchResult.map((item) => ({
        name: `${item.full_name}(${item.description})`,
        value: item.full_name
      }))
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

    if (count > 0) {
      const keyword = await makeList({
        message:
          platform === 'github'
            ? `请选择要下载的项目（共${count}条数据）`
            : '请选择要下载的项目',
        choices: list
      })

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

  /**
   * 异步选择标签
   * 此函数用于初始化或重置标签选择的分页参数，并调用doSelectTags函数获取标签列表
   * 为什么需要异步：因为此函数内部调用了异步操作doSelectTags，使用await确保标签数据被正确处理
   */
  async selectTags() {
    let tagsList
    this.tagPage = 1
    this.tagPerPage = 30
    tagsList = await this.doSelectTags()
  }

  /**
   * 异步执行选择标签的操作
   * 此函数根据当前平台获取标签列表，并让用户选择一个标签
   * 如果平台是GitHub，还会处理分页逻辑
   */
  async doSelectTags() {
    const platform = this.gitAPI.getPlatform()
    let tagsListChoices = []
    if (platform === 'github') {
      const params = {
        page: this.tagPage,
        per_page: this.tagPerPage
      }
      const tagsList = await this.gitAPI.getTags(this.keyword, params)
      tagsListChoices = tagsList.map((item) => ({
        name: item.name,
        value: item.name
      }))
      // log.verbose('tagsListChoices', tagsListChoices)
      if (tagsList.length > 0) {
        tagsListChoices.push({
          name: '下一页',
          value: NEXT_PAGE
        })
      }
      if (this.tagPage > 1) {
        tagsListChoices.unshift({
          name: '上一页',
          value: PREV_PAGE
        })
      }
    } else {
      const tagsList = await this.gitAPI.getTags(this.keyword)
      tagsListChoices = tagsList.map((item) => ({
        name: item.name,
        value: item.name
      }))
    }
    if (tagsListChoices.length === 0) {
      this.selectedTag = ''
      return
    }
    const selectedTag = await makeList({
      message: '请选择tag',
      choices: tagsListChoices
    })

    if (selectedTag === NEXT_PAGE) {
      await this.nextTags()
    } else if (selectedTag === PREV_PAGE) {
      await this.prevTags()
    } else {
      this.selectedTag = selectedTag
    }
  }

  async nextTags() {
    this.tagPage++
    await this.doSelectTags()
  }

  async prevTags() {
    this.tagPage--
    await this.doSelectTags()
  }

  /**
   * 异步下载仓库函数
   * 此函数负责发起仓库下载请求，并使用 ora 库显示下载过程的加载动画
   */
  async downloadRepo() {
    const spinner = ora(
      `正在下载: ${this.keyword}(${this.selectedTag || 'latest'})`
    ).start()
    try {
      await this.gitAPI.cloneRepo(this.keyword, this.selectedTag)
      spinner.stop()
      log.success(`下载成功: ${this.keyword}(${this.selectedTag || 'latest'})`)
    } catch (e) {
      spinner.stop()
      printErrorLog(e)
    }
  }

  /**
   * 异步安装依赖函数
   *
   * 此函数负责调用gitAPI安装项目依赖，并通过ora库创建一个加载指示器来提升用户体验
   * 它会根据安装结果输出成功或错误信息，并确保在任何情况下加载指示器能够正确停止
   */
  async installDependencies() {
    const spinner = ora(
      `正在安装依赖: ${this.keyword}(${this.selectedTag || 'latest'})`
    ).start()
    try {
      const ret = await this.gitAPI.installDependencies(
        process.cwd(),
        this.keyword,
        this.selectedTag
      )
      spinner.stop()
      if (!ret) {
        log.error(
          `依赖安装失败: ${this.keyword}(${this.selectedTag || 'latest'})`
        )
      } else {
        log.success(
          `依赖安装成功: ${this.keyword}(${this.selectedTag || 'latest'})`
        )
      }
    } catch (e) {
      spinner.stop()
      printErrorLog(e)
    }
  }

  /**
   * 异步执行启动项目操作
   */
  async runRepo() {
    await this.gitAPI.runRepo(process.cwd(), this.keyword)
  }
}

function Install(instance) {
  return new InstallCommand(instance)
}
export default Install
