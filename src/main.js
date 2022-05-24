import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from "@/router/router_index";

//方式1.全局引入
// import iView from "iview";
//挂载iview
// Vue.use(iView, {
//     size: 'default'
// })


//方式2. 按需引入
import '@/plugins/iview'


//引入mock 拦截 api 请求,模拟数据
import '@/api/mock';

//引入公共函数
import '@/plugins/common'


//引入vuex
import store from '@/store'

//加入进度条显示
router.beforeEach((to, from, next) => {
    Vue.prototype.$LoadingBar.start();

    const token = window.localStorage.getItem('examine_Authorization')
    // //已登录
    if (token) {
        //已登录不能访问login
        if (to.name === 'Login') {
            next({name: 'Home'})
            return false;
        }
        next()
    }
    //未登录
    else {
        //未登录只能访问login
        if (to.name !== 'Login') {
            next({name: 'Login'})
            return false;
        }
        next()
    }
    next();
});

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from, next) => {
    Vue.prototype.$LoadingBar.finish();
});


Vue.config.productionTip = false

new Vue({
    store,//vuex
    router,
    render: h => h(App),
}).$mount('#app')
