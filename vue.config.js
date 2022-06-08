const {defineConfig} = require('@vue/cli-service')
//自定义配置文件
const {devServerConfig} = require('./env')

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: devServerConfig,
    //eslint配置
    lintOnSave: false
})
