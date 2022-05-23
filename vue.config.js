const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({

    transpileDependencies: true,
    devServer: {
        //ip地址
        host: '127.0.0.1',
        //端口号
        port: 8080,
        //代理设置
        proxy: {
            //首页
            '/apihome': {
                target: 'http://127.0.0.1:3000',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    //把apihome替换为 空
                    '^/apihome': ''
                }
            },
            //api访问
            '/api': {
                target: 'http://127.0.0.1:3000',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    //把 api 开头 替换为 /web/v1
                    '^/api': '/web/v1'
                }
            }
        }
    },
    //eslint配置
    lintOnSave: false
})
