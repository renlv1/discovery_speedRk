const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',

  outputDir: process.env.VUE_APP_outputDir,

  assetsDir: 'static',

  filenameHashing: true, // 默认情况下，生成的静态文件在它们的文件名中包含了hash以便更好的控制缓存(这要求 index 的HTML文件是被Vue-cli 自动生成的， 否则就关闭)

  productionSourceMap: false,

  configureWebpack: (config) => {
    config.entry.app = ['babel-polyfill', './src/main.js'] //入口文件
  },

  chainWebpack: config => {
    // 路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@img', resolve('src/assets/img'))

    // 压缩images
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      }
    }
  }
}
