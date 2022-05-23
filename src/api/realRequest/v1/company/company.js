import axios from "@/api/axios";

export const getBase = (params) => {
    //这是自己定义的 axios封装
    return axios.request({
        //如果要通过这种方式,必须要设置代理
        url: '/apihome',
        // url:'http://localhost:3000',
        method: 'get',
        params
    })
}

//这里是用的mock 模拟数据
export const getData = (params) => {
    return axios.request({
        url: '/home/getData',
        method: 'get',
        params
    })
}

/*
获取公司列表
 */
export const companyList = (params) => {
    return axios.request({
        url: '/api/company/list',
        method: 'get',
        params
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


/*
获取公司联系人
 */
export const getCompanyContact = (params) => {
    return axios.request({
        url: '/api/company/contact_list',
        method: 'get',
        params
    })
}

/*
获取所有员工
 */
export const getAllEmployee = (params) => {
    return axios.request({
        url: '/api/company/get_employees',
        method: 'get',
        params
    })
}

/*
添加公司联系人
 */
export const companyAddContact = (data) =>{
    return axios.request({
        url:'/api/company/add_contact',
        method:'post',
        data
    })
}


/**
 * 添加跟进任务
 */
export const companyAddFollow = (data) =>{
    return axios.request({
        url:'/api/company/add_follow',
        method:'post',
        data
    })
}

/*
获取跟进任务列表
 */
export const getFollowupList = (params) => {
    return axios.request({
        url: '/api/company/follow_task_list',
        method: 'get',
        params
    })
}

/*
删除跟进
 */
export const delFollow = (data) =>{
    return axios.request({
        url:'/api/company/del_follow',
        method:'post',
        data
    })
}


/*
获取跟进任务详情
 */
export const getFollowSimple = (params) => {
    return axios.request({
        url: '/api/company/get_follow',
        method: 'get',
        params
    })
}


/*
修改跟进任务
 */
export const postEditFollow = (data) =>{
    return axios.request({
        url:'/api/company/edit_follow',
        method:'post',
        data
    })
}

/*
跟进任务批量完成
 */

export const postFollowBatchDonw = (data) =>{
    return axios.request({
        url:'/api/company/task_batch_done',
        method:'post',
        data
    })
}

/**
 * 删除公司
 * @param data
 * @returns {*}
 */
export const postDelCompany = (data) =>{
    return axios.request({
        url:'/api/company/del',
        method:'post',
        data
    })
}
