import { homedir } from 'node:os'
import path from 'node:path'
import {
  log,
  makeList,
  makeInput,
  getLatestVersion,
  request,
  printErrorLog
} from '@sharpcli/utils'

// const ADD_TEMPLATE = [
//   {
//     name: 'vue3模版',
//     value: 'template-vue',
//     npmName: '@sharpcli/template-vue',
//     version: '1.0.0'
//   },
//   {
//     name: 'react18模版',
//     value: 'template-react',
//     npmName: '@sharpcli/template-react',
//     version: '1.0.0'
//   },
//   {
//     name: 'vue-element-admin模版',
//     value: 'template-vue-element-admin',
//     npmName: '@sharpcli/template-vue-element-admin',
//     version: '1.0.0'
//   }
// ]

const ADD_TYPE_PROJECT = 'project'
const ADD_TYPE_PAGE = 'page'
const ADD_TYPE = [
  {
    name: '项目',
    value: ADD_TYPE_PROJECT
  },
  {
    name: '页面',
    value: ADD_TYPE_PAGE
  }
]
const TEMP_HOME = '.cli-imooc'

// 通过api获取项目模版
async function getTemplateFromAPI() {
  try {
    const data = await request({
      url: '/v1/project',
      method: 'GET'
    })
    log.verbose('getTemplateFromAPI', data)
    return data
  } catch (error) {
    printErrorLog(error, '获取模版失败')
    return null
  }
}
async function addTemplateFromAPI() {
  try {
    const data = await request({
      url: '/v1/project',
      method: 'POST',
      data: {
        name: 'test',
        value: 'test',
        npmName: '@sharpcli/template-test',
        version: '1.0.0'
      }
    })
    log.verbose('addTemplateFromAPI', data)
    return data
  } catch (error) {
    printErrorLog(error, '新增模版失败')
    return null
  }
}

// 获取创建类型
function getAddType() {
  return makeList({
    message: '请选择初始化类型',
    choices: ADD_TYPE,
    defaultValue: ADD_TYPE_PROJECT
  })
}

// 获取项目名称
function getAddName() {
  return makeInput({
    message: '请输入项目名称',
    defaultValue: '',
    validate(v) {
      if (v.length > 0) {
        return true
      }
      return '项目名称必须输入'
    }
  })
}

// 选择项目模板
function getAddTemplate(ADD_TEMPLATE) {
  return makeList({
    choices: ADD_TEMPLATE,
    message: '请选择项目模板'
  })
}

// 选择所在团队
function getAddTeam(ADD_TEMPLATE) {
  return makeList({
    choices: ADD_TEMPLATE.map((item) => ({
      name: item,
      value: item
    })),
    message: '请选择团队'
  })
}

// 安装缓存目录
function makeTargetPath() {
  log.verbose('homedir', homedir())
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate')
}


/**
 * 创建项目模版
 * 
 * 此函数用于根据用户提供的参数和选项创建一个项目模版，它首先尝试从API获取模版，
 * 如果模版不存在，则抛出错误然后，它根据用户是否提供了类型和名称进行不同的处理，
 * 并最终确定要使用的模版。如果模版类型不受支持，则抛出错误。
 * 
 * @param {string} name - 项目名称
 * @param {Object} opts - 包含额外选项的对象，如类型和模版
 * @returns {Object} 返回一个包含项目类型、名称、选定的模版和目标路径的对象
 */
export default async function createTemplate(name, opts) {
  // 获取模版
  const ADD_TEMPLATE = await getTemplateFromAPI()
  if (!ADD_TEMPLATE) {
    throw new Error('项目模版不存在')
  }
  const { type = null, template = null } = opts
  let addType, addName, addTemplate
  if (type) {
    addType = type
  } else {
    addType = await getAddType()
  }
  log.verbose('addType', addType)
  if (addType === ADD_TYPE_PROJECT) {
    if (name) {
      addName = name
    } else {
      addName = await getAddName()
    }
    log.verbose('addName', addName)

    if (template) {
      addTemplate = template
    } else {
      // 获取团队列表
      let teamList = ADD_TEMPLATE.map((item) => item.team)
      teamList = [...new Set(teamList)]
      const addTeam = await getAddTeam(teamList)
      log.verbose('addTeam', addTeam)
      addTemplate = await getAddTemplate(ADD_TEMPLATE.filter((template) => template.team === addTeam))
    }
    log.verbose('addTemplate', addTemplate)

    const selectedTemplate = ADD_TEMPLATE.find(
      (item) => item.value === addTemplate
    )
    if (!selectedTemplate) {
      throw new Error(`项目模板${addTemplate}不存在`)
    }
    // log.verbose('selectedTemplate', selectedTemplate)

    const latestVersion = await getLatestVersion(selectedTemplate.npmName)
    log.verbose('latestVersion', latestVersion)

    selectedTemplate.version = latestVersion

    const targetPath = makeTargetPath()

    return {
      type: addType,
      name: addName,
      template: selectedTemplate,
      targetPath
    }
  } else {
    throw new Error(`创建的项目类型${addType}不支持`)
  }
}
