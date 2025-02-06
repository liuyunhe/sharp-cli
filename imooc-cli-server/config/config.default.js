/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1738723244791_6931';

  // add your middleware config here
  config.middleware = [];

  // 配置安全设置
  config.security = {
    // 配置CSRF保护
    csrf: {
      // 禁用CSRF保护
      enable: false,
    },
  };

  // 配置MongoDB数据库连接
  config.mongoose = {
    // 数据库连接URL
    url: 'mongodb://liuyh:123456@127.0.0.1:27017/sharpcli',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
