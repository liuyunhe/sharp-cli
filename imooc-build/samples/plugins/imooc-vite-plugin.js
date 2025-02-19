const { createServer, build, preview } = require('vite');

module.exports = async function() {
  const server = await createServer({
    configFile: './vite.config.js',
  })
  await server.listen()

  server.printUrls()

  // await build({
  //   root: './',
  // });
  //
  // const previewServer = await preview({
  //   // 任何有效的用户配置项，将加上 `mode` 和 `configFile`
  //   preview: {
  //     port: 8080,
  //     open: true
  //   }
  // })
  //
  // previewServer.printUrls()
};
