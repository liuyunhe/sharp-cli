/*
 * @文件说明: 项目模板控制器
 * @模块职责:
 * - 提供项目模板的RESTful API接口
 * - 代码中的ProjectController类有五个方法：index、show、create、update和destroy，
 * 分别对应RESTful的获取列表、获取单个、创建、更新和删除操作。
 * - 包含列表查询/详情查询/新增模板功能
 * - 更新和删除功能待实现（当前为占位逻辑）
 * @创建时间: 2023-03-15
 * @最后修改: 2025-03-31 (需定期更新)
 * @依赖模块:
 * - egg -> Controller基类
 * - app/model/Project -> 项目模板模型
 * @注意事项:
 * 1. show方法通过value字段查询，需确认模型字段设计
 * 2. create方法未做参数校验，需补充验证逻辑
 * 3. update/destroy方法需完善数据库操作
 */

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  // 项目模板查询
  async index() {
    const { ctx } = this;
    const res = await ctx.model.Project.find({});
    ctx.body = res;
  }

  // 项目模板查询
  async show() {
    const { ctx } = this;
    const id = ctx.params.id;
    const res = await ctx.model.Project.find({ value: id });
    if (res.length > 0) {
      ctx.body = res[0];
    } else {
      ctx.body = {};
    }
  }

  // 项目模板新增
  create() {
    const { ctx } = this;
    const body = ctx.request.body;
    console.log(body);
    ctx.model.Project.create(body);
    ctx.body = 'ok';
  }

  // 项目模板更新
  update() {
    this.ctx.body = 'update';
  }

  // 项目模板删除
  destroy() {
    this.ctx.body = 'destroy';
  }
}

module.exports = ProjectController;
