export default {
  entry: 'src/index.js',
  plugins: function() {
    return [
      ['./plugins/imooc-build-plugin.js', { a: 1, b: 2 }],
      function(api, options) {
        console.log('this is anonymous plugin', options);
      },
    ];
  },
  hooks: [
    // ['start', (context) => {
    //   console.log('start', context);
    // }],
    // ['plugin', (context) => {
    //   console.log('testHook', context.webpackConfig?.toConfig());
    // }],
  ],
};
