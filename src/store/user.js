import router from '@/router/router_index' //引入路由

export default {
    state: { //全局状态 变量

    },
    mutations: { //全局状态方法
        logout() //登出
        {
            window.localStorage.removeItem('examine_Authorization')
            window.localStorage.removeItem('employee_info')
            router.push({name: "Login"}) //路由跳转 login 登录页
        }
    }
}
