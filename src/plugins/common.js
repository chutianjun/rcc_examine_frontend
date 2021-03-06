import Vue from 'vue'

/**
 * 判断某个值 是否 为空
 * @param data
 * @returns {boolean}
 */
function isFull(data) {
    if (
        data == null ||
        data === undefined ||
        data === 'null' ||
        data === 'undefined' ||
        data === 'unknown' ||
        data === '{}'   ||
        data === '[]'   ||
        (typeof data == 'string' && data.trim() == '') ||   //空的字符串
        (data.toString() == '[object Object]'  && JSON.stringify(data)=='{}') ||  //空对象
        (Array.isArray(data) && data.length==0)  //空数组
    ) {
        return false
    }
    else {
        return true
    }
}

/**
 *
 * @param data
 */
function parseToJson(data)
{
    let jsonResult='';
    try {
        let jsonResult=JSON.parse(data)
        return jsonResult
    }catch (e)
    {
        console.log(e)
    }
    return jsonResult
}

Vue.prototype.isFull = isFull
Vue.prototype.parseToJson = parseToJson


/*
数组添加删除指定 索引 元素方法
 */
Array.prototype.remove=function(dx)
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
}
