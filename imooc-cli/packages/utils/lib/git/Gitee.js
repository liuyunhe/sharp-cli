import axios from 'axios'
import GitServer from './gitServer.js'
import log from '../log.js'

const BASE_URL = 'https://gitee.com/api/v5'

class Gitee extends GitServer {
  constructor() {
    super()
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 60000
    })
    this.service.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  get(url, params, headers) {
    return this.service({
      url,
      params: {
        ...params,
        access_token: this.token
      },
      method: 'get',
      headers
    })
  }

  post(url, data, headers) {
    return this.service({
      url,
      data,
      params: {
        access_token: this.token
      },
      method: 'post',
      headers
    })
  }

  searchRepositories(params) {
    return this.get('/search/repositories', params)
  }

  // example: https://gitee.com/api/v5/repos/zhijiantianya/ruoyi-vue-pro/tags
  getTags(fullName) {
    return this.get(`/repos/${fullName}/tags`)
  }

  getRepoUrl(fullName) {
    // https://gitee.com/imooc-project/commit-test.git
    return `https://gitee.com/${fullName}.git`
  }

  getUser() {
    return this.get('/user')
  }

  getOrg() {
    return this.get('/user/orgs')
  }

  getRepo(owner, repo) {
    return this.get(`/repos/${owner}/${repo}`).catch((err) => {
      return null
    })
  }

  async createRepo(name) {
    // 检查远程仓库是否存在，如果存在，则跳过创建
    const repo = await this.getRepo(this.login, name)
    if (!repo) {
      log.info('仓库不存在，开始创建')
      if (this.own === 'user') {
        return this.post('/user/repos', { name })
      } else if (this.own === 'org') {
        const url = 'orgs/' + this.login + '/repos'
        return this.post(url, { name })
      }
    } else {
      log.info('仓库存在，直接返回')
      return repo
    }
  }
}

export default Gitee
