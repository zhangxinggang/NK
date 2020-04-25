// 配置需要展示在侧边栏的项，目前只支持2级，多级需要修改路由部分、面包屑部分
const menuConfig = [
	{
		name: '系统',
		key: '/system',
		icon: 'el-icon-s-tools',
		children: [
			{
				name: '组织管理',
				key: '/system/org',
				icon:'el-icon-grape'
			},{
				name:'角色管理',
				key:'/system/role',
				icon:'el-icon-help'
			},{
				name: '用户列表',
				key: '/system/user',
				icon:'el-icon-user-solid'
			}
		]
	},
	{
		name: '组件',
		key: '/tool',
		icon: 'el-icon-s-grid',
		children: [
			{
				name: '富文本',
				key: '/tools/braftEditor',
				icon:'el-icon-document'
			}
		]
	}
];

export default menuConfig;