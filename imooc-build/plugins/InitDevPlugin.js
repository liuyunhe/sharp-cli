const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = function(api, options) {
  const { getWebpackConfig } = api;
  const config = getWebpackConfig();
  const dir = process.cwd();

  // 获取构建模式
  const mode = 'development';
  config.mode(mode);

  // 设置entry
  config.entry('index')
    .add(path.resolve(dir, './src/index.js'));

  // 设置output
  config.output
    .filename('js/[name].js')
    .path(path.resolve(dir, './dist'));

  // 设置loader
  config.module
    .rule('css')
      .test(/\.css$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .end()
      .use('css-loader')
        .loader('css-loader');

  config.module
    .rule('asset')
      .test(/\.(png|svg|jpg|jpeg|gif)$/i)
      .type('asset')
      .parser({
        dataUrlCondition: {
          maxSize: 8 * 1024,
        },
      });
  config.module.rule('asset').set('generator', {
    filename: 'images/[name].[hash:6][ext]',
  });

  config.plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin, [{
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css',
    }]);

  config.plugin('HtmlWebpackPlugin')
    .use(HtmlWebpackPlugin, [{
      filename: 'index.html',
      template: path.resolve(dir, './public/index.html'),
      chunks: ['index'],
    }]);

  config.plugin('CleanPlugin')
    .use(CleanWebpackPlugin, []);

  config.optimization
    .usedExports(true);

  config.watch(true);
};
