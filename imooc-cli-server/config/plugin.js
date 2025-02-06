/**
 * 导出mongoose配置对象
 * 该对象用于定义mongoose中间件的相关配置
 */
exports.mongoose = {
  // 启用mongoose中间件的开关，设置为true表示启用
  enable: true,
  // 指定mongoose中间件的包名
  package: 'egg-mongoose',
};
