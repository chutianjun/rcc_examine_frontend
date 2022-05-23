// 引入axios
import axios from "axios";
//配置文件
import config from "@/config";

//对环境判断,如果是生产环境,就拿pro
// console.log(process.env.NODE_ENV)
const baseURL = process.env.NODE_ENV === 'development' ? config.baseURL.dev : config.baseURL.pro
console.log(process.env.NODE_ENV,baseURL)
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
            if(!config.headers.Authorization ){
                config.headers.Authorization  = window.localStorage.getItem('examine_Authorization')
            }
            return config
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

// 添加响应拦截器
        instance.interceptors.response.use(function (response) {
            // 对响应数据做点什么
            const {code}=response
            //token过期
            if(code===205)
            {
                // window.localStorage.removeItem('examine_Authorization')
            }

            return response.data;
        }, function (error) {
            console.log(error)
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
