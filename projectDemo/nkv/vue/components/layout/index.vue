<template>
	<el-container>
		<el-aside width="200px">
			<layout-leftNav />
		</el-aside>
		<el-container>
			<el-header>
				<layout-header />
			</el-header>
			<el-main>
				<router-view></router-view>
			</el-main>
			<el-footer>
				<layout-footer />
			</el-footer>
		</el-container>
	</el-container>
</template>
<script>
	import header from './header'
	import leftNav from './leftNav'
	import footer from './footer'
	export default{
		name:'layout',
		data(){
			return {}
		},
		components:{
			'layout-header':header,
			'layout-leftNav':leftNav,
			'layout-footer':footer
		}
	}
</script>