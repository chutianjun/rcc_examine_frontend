import axios from "@/api/axios";

/*
用户登录接口
 */
export const userLogin = (params) => {
    return axios.request({
        url: '/api/user/login',
        method: 'post',
        data: params
    })
}
