module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/',
  configureWebpack: {
    devServer: {
      host: '192.168.56.17',
      disableHostCheck: true
    },
    devtool: 'source-map',
    resolve: {
      alias: {
        vuetifytb: '@lzhoucs/vuetify'
      }
    }
  },
  devServer: {
    proxy: { 
      '/api': { 
        target: 'http://localhost:4000/api',
        changeOrigin: true, 
        pathRewrite: { 
          '^/api': ''
        } 
      } 
    } 
  },
  outputDir: '../backend/public_built'
}