const chokidar = require('chokidar');
const path = require('path');
const cp = require('child_process');
const { getConfigFile } = require('../utils');
const log = require('../utils/log');

let child;

function runServer(args = {}) {
  const { config = '', customWebpackPath = '', stopBuild = false } = args;
  // 启动子进程的方式
  const scriptPath = path.resolve(__dirname, './DevService.js');
  child = cp.fork(scriptPath, [
    '--port 8080',
    '--config ' + config,
    '--customWebpackPath ' + customWebpackPath,
    '--stop-build ' + stopBuild,
  ]);

  child.on('exit', code => {
    if (code) {
      process.exit(code);
    }
  });
}

function onChange() {
  log.verbose('onChange', 'config file changed!');
  child.kill();
  runServer();
}

function runWatcher() {
  // 启动配置监听服务
  const configPath = getConfigFile();
  chokidar.watch(configPath)
    .on('change', onChange)
    .on('error', error => {
      console.error('file watch error!', error);
      process.exit(1);
    });
}

module.exports = function(opts, cmd) {
  log.verbose('startServer', opts);
  // 1. 通过子进程启动webpack-dev-server服务
  // 1.1 子进程启动可以避免主进程受到
  // 1.2 子进程启动可以方便重启，解决配置修改后无法重启
  runServer(opts);

  // 2. 监听配置修改
  runWatcher();
};
