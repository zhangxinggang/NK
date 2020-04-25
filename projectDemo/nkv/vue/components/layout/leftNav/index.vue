<!-- 侧边栏 -->
<template>
	<div class="sidebar">
		<div style="height:60px;line-height:60px;">
			<img :src='logo' style="height:3em;" />
		</div>
		<el-menu 
			class="sidebar-el-menu"
			:default-active="this.$route.path"
			background-color="#545c64"
			text-color="#bfcbd9"
			active-text-color="#20a0ff"
			unique-opened
			router
			>
		   <child-menu :dataList="menuConfig"></child-menu>
		</el-menu>
	</div>
</template>
<script>
	import logo from '@v/assets/images/system/logo.png';
	import menuConfig from '@v/config/menuConfig';
	import childMenu from './childMenu';
	export default {
		data() {
			return {
				logo:logo,
				menuConfig:menuConfig
			}
		},
		components:{
			'child-menu':childMenu
		}
	}
</script>

<style scoped>
	.sidebar{
		height:100%
	}
	.sidebar-menu{
		height: calc(100% - 60px);
	}
</style>
