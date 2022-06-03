// 引入axios
import axios from "axios";
//配置文件
import config from "@/config";

import store from '@/store/index' //vuex全局状态管理

// import vue from 'vue' //引入 vue ,要用 它 原型 上的 方法 $nextTick

import {Message} from "iview"; //消息提示框


//对环境判断,如果是生产环境,就拿pro
// console.log(process.env.NODE_ENV)
const baseURL = process.env.NODE_ENV === 'development' ? config.baseURL.dev : config.baseURL.pro

console.log(process.env.NODE_ENV, baseURL)

let MessageTip=false;
class HttpRequest {
    //构造方法
    constructor(baseURL) {
        this.baseURL = baseURL
    }

    getInsideConfig() {
        const config = {
            baseURL: this.baseURL,
            header: {}
        }
        return config
    }

//    拦截器
    interceptors(instance) {
        // 添加请求拦截器
        instance.interceptors.request.use(function (config) {
            //请求头加入token信息
            if (!config.headers.Authorization) {
                config.headers.Authorization = window.localStorage.getItem('examine_Authorization')
            }
            return config
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

// 添加响应拦截器
        instance.interceptors.response.use((response) => {
            // 对响应数据做点什么
            const {code,msg} = response.data
            //token过期, 跳转login登录页 重新 登录
            if (code === 205) {

                //设置一个变量,控制只弹出一次
                if(!MessageTip)
                {
                    Message.error('抱歉,您的登录信息已过期,请重新登录,3秒后即将自动跳转登录页!') //直接调用message 的方式
                    MessageTip=true

                    // 方式1 起不到延迟的效果
                    // vue.prototype.$nextTick(function(){
                    //     vue.prototype.$Message.error('抱歉,您的登录信息已过期,请重新登录,即将自动跳转登录页!')
                    // })

                    //方式2. 延迟两秒跳转
                    setTimeout(() => {
                        store.commit("logout")
                    }, 3000)

                    //token如果失效,这里将消息改造一下,或者让后端直接改也行,这种方式还是不行,
                    // 有时候, 我们会请求多次, 不可能让每个 接口 都弹出 token 失效的信息
                    // response.data.msg='抱歉,您的登录信息已过期,请重新登录,2秒后即将自动跳转登录页!'
                }

                return Promise.reject(msg) // 这种方式会抛出异常
            }
            else
            {
                return response.data;
            }

        }, (error) => {
            // console.log(error)
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    }

    request(options) {
        const instance = axios.create()
        options = {
            ...this.getInsideConfig(), ...options
        }
        // console.log(options)
        this.interceptors(instance)
        //此处调用接口
        return instance(options)
    }
}

export default new HttpRequest(baseURL)
