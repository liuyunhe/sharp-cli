const Controller = require('egg').Controller;

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
  // 项目模版查询
  async index() {
    const { ctx } = this;
    const res = ctx.model.Project.find({});
    ctx.body = res;
  }

  // 项目模版详情
  show() {
    const { ctx } = this;
    const id = ctx.params.id;
    const template = ADD_TEMPLATE.find(item => item.value === id);
    if (template) {
      ctx.body = template;
    } else {
      ctx.body = {};
    }
  }

  // 项目模版创建
  create() {
    const { ctx } = this;
    console.log(ctx.request.body);
    ctx.body = 'create';
  }

  // 项目模版更新
  update() {
    const { ctx } = this;
    ctx.body = 'update';
  }

  // 项目模版删除

  destroy() {
    const { ctx } = this;
    ctx.body = 'destroy';
  }
}

module.exports = ProjectController;
