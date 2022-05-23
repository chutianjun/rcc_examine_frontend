const {defineConfig} = require('@vue/cli-service')
//自定义配置文件
const {proxyConfig}=require('./env')

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        //ip地址
        // host: '127.0.0.1',
        //端口号
        // port: 8080,
        //代理设置
        proxy:proxyConfig
    },
    //eslint配置
    lintOnSave: false
})
