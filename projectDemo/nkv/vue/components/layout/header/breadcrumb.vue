<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
				<span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.name }}</span>
				<a style="color:#97a8be;" v-else @click.prevent="handleLink(item)">{{ item.name }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>
	import * as sspathToRegexp from 'path-to-regexp'

	export default {
		data() {
			return {
				levelList: null
			}
		},
		watch: {
			$route() {
				this.getBreadcrumb()
			}
		},
		created() {
			this.getBreadcrumb()
		},
		methods: {
			getBreadcrumb() {
				this.levelList= this.$route.matched.filter(item => item.name);
			},
			pathCompile(path) {
				const {
					params
				} = this.$route
				var toPath = pathToRegexp.compile(path)
				return toPath(params)
			},
			handleLink(item) {
				const {
					redirect,
					path
				} = item
				if (redirect) {
					this.$router.push(redirect)
					return
				}
				this.$router.push(this.pathCompile(path))
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.app-breadcrumb.el-breadcrumb {
		display: inline-block;
		font-size: 14px;
		line-height: inherit;
		margin-left: 10px;

		.no-redirect {
			color: #97a8be;
			cursor: text;
		}
	}
</style>
