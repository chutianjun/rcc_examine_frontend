//引入vue
import Vue from 'vue'
//引入vue-router
import VueRouter from "vue-router";

//挂载VueRouter
Vue.use(VueRouter)

//定义路由
const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: 'main/welcome'
    },
    //首页
    {
        path: '/main',
        name: 'Main',
        component: () => import("@/views/common/mainPage"),
        children: [
            {
                path: 'welcome',
                name: 'Welcome',
                component: () => import("@/views/main/welcome")
            }
        ]
    },
    //login登录页
    {
        path:'/login',
        name:'Login',
        component:()=>import('@/views/user/userLogin')
    },
    {
        //公司列表
        path: '/company',
        name: 'Company',
        component: () => import("@/views/common/mainPage"),
        children: [
            {
                path: 'list',
                name: 'companyList',
                component: () => import('@/views/company/companyList')
            },
            //公司详情页
            {
                path: 'detail',
                name: 'companyDetail',
                component: () => import('@/views/company/companyDetail'),
                children: [
                    //跟进记录相关子组件
                    {
                        path: 'follow',
                        name: 'companyFollow',
                        component: () => import('@/views/company/component/companyFollowUpRecord')
                    }
                ]
            },

        ]
    },
    {
        path: '*', // 访问不存在的页面,重定向页面地址
        redirect: 'main/welcome'
    }
];

//处理 重复点击路由的报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


const Routers = new VueRouter({
    mode: 'history',
    routes
});

export default Routers

