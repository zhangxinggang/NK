<template>
	<div id="app">
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>

<style>
	@import "./assets/css/main.css";
	@import "./assets/css/theme-default/color.css"; /*深色主题*/
</style>