import Vue from 'vue'
import ElementUI from 'element-ui'
import elementUiObj from './vendor'
import 'element-ui/lib/theme-chalk/index.css'
Object.keys(elementUiObj).forEach((key)=>{
	Vue.use(elementUiObj[key])
})
Vue.prototype.$msgbox = ElementUI.MessageBox
Vue.prototype.$message = ElementUI.Message