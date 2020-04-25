import Vue from 'vue'
import App from './App'
import router from './router'
import i18n from './locale'
import './plugins/element'
import './plugins/iconfont'

Vue.config.productionTip = process.env.NODE_ENV=='development'?true:false;

new Vue({
	el: '#app',
	router,
	i18n,
	render: h => h(App)
}).$mount('#app')
