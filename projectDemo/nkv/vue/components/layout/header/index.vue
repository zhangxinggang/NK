<!-- 顶部导航 -->
<template>
	<div class="header">
		<div class="header-left">
			<layout-breadcrumb />
		</div>
		<div class="header-right">
			<span class="logout">退出登录</span>
		</div>
	</div>
</template>
<script>
	import breadcrumb from './breadcrumb';
	export default {
		data() {
			return {}
		},
		components:{
			'layout-breadcrumb':breadcrumb
		}
	}
</script>

<style scoped>
	.header{
		display: flex;
		justify-content: space-between;
		height:100%;
	}
	.header-right {
		margin-right: 20px;
		font-size: 16px;
		float: right;
		cursor: pointer;
		font-weight: 600;
	}
</style>
