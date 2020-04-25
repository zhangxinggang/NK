import axios from "axios"
const ajax=(obj)=>{
	obj.method=obj.method || obj.type || 'get';
	axios(obj).then(response=>{
		if(typeof(obj.success)=='function'){
			if(response.data.meta.status!=0){
				obj.error(new Error(response.meta.message))
			}else{
				obj.success(response.data.data)
			}
		}
	}).catch((err)=>{
		if(typeof(obj.error)=='function'){
			obj.error(err)
		}
	})
}
export default ajax;