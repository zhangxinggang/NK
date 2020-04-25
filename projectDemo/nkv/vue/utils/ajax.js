import axios from 'axios'
import {message} from 'antd'
export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{
        let promise;
        if(type.toLowerCase()=='get'){
            promise=axios.get(url,{
                params:data
            })
        }else{
            promise=axios.post(url,data)
        }
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{
            message.error('请求出错了：'+error.message)
        })
    })
}