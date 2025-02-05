const { Controller } = require('egg');

const ADD_TEMPLATE = [
  {
    name: 'vue3模版',
    value: 'template-vue',
    npmName: '@sharpcli/template-vue',
    version: '1.0.0',
  },
  {
    name: 'react18模版',
    value: 'template-react',
    npmName: '@sharpcli/template-react',
    version: '1.0.0',
  },
  {
    name: 'vue-element-admin模版',
    value: 'template-vue-element-admin',
    npmName: '@sharpcli/template-vue-element-admin',
    version: '1.0.0',
  },
];

class ProjectController extends Controller {
  async template() {
    const { ctx } = this;
    ctx.body = ADD_TEMPLATE;
  }
  async create() {
    const { ctx } = this;
    ctx.body = 'hi, create';
  }
}

module.exports = ProjectController;
