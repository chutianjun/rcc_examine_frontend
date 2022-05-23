import Vue from 'vue'
//判断某个值是否为空
function isBlank(data)
{
    if(
        data == null ||
        data === 'null' ||
        data === '' ||
        data === undefined ||
        data ==='undefined' ||
        data === 'unknown'
    )
    {
        return true
    }
    else
    {
        return false
    }
}
Vue.prototype.isBlank=isBlank
