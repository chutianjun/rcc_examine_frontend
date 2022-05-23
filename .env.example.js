// eslint-disable-next-line no-unused-vars
//env 文件里 是一些 本地和 线上环境 不同的 配置项,
//所以单独抽离出来,并且忽略掉了,方便 根据不同环境来配置
exports.proxyConfig = {
    //首页
    '/apihome': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            //把apihome替换为 空
            '^/apihome': ''
        }
    },
    //api访问
    '/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            //把 api 开头 替换为 /web/v1
            '^/api': '/web/v1'
        }
    }
}

exports.baseURL = {
    //本地开发环境url,本地用的是 node 服务器的代理,来访问api
    dev: 'http://localhost:8080',
    //生产环境url
    pro: 'http://rcc.thisyang.top',
}



