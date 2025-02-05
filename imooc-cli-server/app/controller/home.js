const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '<div>11111</div>';
  }
}

module.exports = HomeController;
