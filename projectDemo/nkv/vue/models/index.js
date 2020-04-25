import uriObj from '@v/config/uris'
import ajax from './main.js'
let models=Object.create(null);
Object.keys(uriObj).map((item)=>{
    models[item]=(obj)=>{
        Object.assign(obj,uriObj[item]);
        ajax(obj)
    }
})
export default models;