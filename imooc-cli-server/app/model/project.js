/**
 * 创建并导出项目模型
 * 该函数使用Mongoose库定义一个项目模型，用于与MongoDB数据库交互
 * @param {Object} app - 应用程序实例，包含Mongoose库的引用
 * @returns {Object} - 返回定义好的项目模型
 */
module.exports = app => {
  // 获取Mongoose实例
  const mongoose = app.mongoose;
  // 定义Schema构造函数的引用
  const Schema = mongoose.Schema;

  // 定义项目模型的Schema
  const ProjectSchema = new Schema({
    // 项目名称字段，类型为字符串
    name: { type: String },
    // 项目值字段，类型为字符串
    value: { type: String },
    // 项目的npm名称字段，类型为字符串
    npmName: { type: String },
    // 项目版本字段，类型为字符串
    version: { type: String },
  });

  // 根据定义的Schema创建并返回项目模型
  return mongoose.model('project', ProjectSchema);
};
