import {log} from '@sharpcli/utils'

const ADD_TEMPLATE = [
  {
    name: 'vue3模版',
    npmName: '@sharpcli/template-vue',
    version: '1.0.1'
  },
  {
    name: 'react18模版',
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

export default function createTemplate(name, opts) {
  log.verbose('createTemplate', name, opts);
  return 'Hello from a';
}