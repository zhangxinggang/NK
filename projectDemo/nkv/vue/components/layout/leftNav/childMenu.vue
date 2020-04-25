<template>
	<div class="menu-tree">
		<label v-for="list in dataList" :key="list.key">
			<el-submenu :index="list.key" v-if="list.children">
				<template slot="title">
					<i :class="list.icon"></i>
					<span>{{list.name}}</span>
				</template>
				<label>
					<child-menu :dataList="list.children"></child-menu>
				</label>
			</el-submenu>
			<el-menu-item v-else :index="list.key">
				<i :class="list.icon"></i>
				<span slot="title">{{list.name}}</span>
			</el-menu-item>
		</label>
	</div>
</template>

<script>
	export default {
		name: 'childMenu',
		props: ['dataList']
	}
</script>
