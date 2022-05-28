import axios from "@/api/axios";

/*
添加公司
 */
export const postAddCompany = (data) =>{
    return axios.request({
        url:'/api/company/add',
        method:'post',
        data
    })
}

/*
修改公司
 */
export const postEditCompany = (data) =>{
    return axios.request({
        url:'/api/company/edit',
        method:'post',
        data
    })
}

/*
获取公司详情
 */
export const getCompanyDetail = (params) => {
    return axios.request({
        url: '/api/company/detail',
        method: 'get',
        params
    })
}
