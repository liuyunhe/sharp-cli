import { homedir } from 'node:os'
import path from 'node:path'
import { log, makeList, makeInput, getLatestVersion } from '@sharpcli/utils'

const ADD_TEMPLATE = [
  {
    name: 'vue3模版',
    value: 'template-vue',
    npmName: '@sharpcli/template-vue',
    version: '1.0.0'
  },
  {
    name: 'react18模版',
    value: 'template-react',
    npmName: '@sharpcli/template-react',
    version: '1.0.0'
  }
]

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
function getAddTemplate() {
  return makeList({
    choices: ADD_TEMPLATE,
    message: '请选择项目模板'
  })
}

// 安装缓存目录
function makeTargetPath() {
  log.verbose('homedir', homedir())
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate')
}

export default async function createTemplate(name, opts) {
  const addType = await getAddType()
  log.verbose('addType', addType)
  if (addType === ADD_TYPE_PROJECT) {

    const addName = await getAddName()
    log.verbose('addName', addName)

    const addTemplate = await getAddTemplate(ADD_TEMPLATE)
    log.verbose('addTemplate', addTemplate)

    const selectedTemplate = ADD_TEMPLATE.find(
      (item) => item.value === addTemplate
    )
    log.verbose('selectedTemplate', selectedTemplate)

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
  }
}
