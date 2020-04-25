import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@v/components/layout'

const constantRouterMap = [{
		path:'/',
		redirect:'/home'
	},{
		path:'/',
		component:Layout,
		name:'系统',
		children:[
			{
				path: '/home',
				component: () => import('@v/page/home')
			},{
				path: '/system/org',
				name:'组织管理',
				component: () => import('@v/page/system/org')
			},{
				path: '/system/role',
				name:'角色管理',
				component: () => import('@v/page/system/role')
			},{
				path: '/system/user',
				name:'用户列表',
				component: () => import('@v/page/system/user')
			}
		]
	},{
		path: '/login',
		component: () => import('@v/page/system/login/index'),
		hidden: true
	},{
		path: '/swiper',
		component: () => import('@v/page/demo/swiper'),
		hidden: true
	},{
		path: '*',
		redirect: '/404'
	}
]

export default new Router({
	scrollBehavior: () => ({x: 0, y: 0}),
	routes: constantRouterMap
})
