import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: 'zh-CN',
	messages: {
		'zh-CN':zhCN
	}
})
//为了实现element插件的多语言切换
ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n;