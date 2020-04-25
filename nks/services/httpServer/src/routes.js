import glob from 'glob'
import path from 'path'
import Router from 'koa-router'
import koaMountRoutes from 'koa-mount-routes'
import serve from 'koa-static'
import webpack from "webpack"
import merge from 'webpack-merge'
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware'

const codePage={};
const router = new Router();
export default class Routers {
	constructor(options) {
		options = options ? options : {};
		Object.assign(this, options);
		this.staticAuthorityRouteArr=[];
	}
	staticAuthorityRoutes(app){
		this.staticAuthorityRouteArr.map((item)=>{
			app.use(serve(item.rootDir))
		})
	}
	mountRoutes(app){
		if(this.mountRouteDirs){
			this.mountRouteDirs.map((item)=>{
				koaMountRoutes(app,item['rootDir'],item);
			})
		}
	}
	dynamicRoutes() {
		this.routeDirs.map((item) => {
			!item.prefix && (item.prefix = '/');
			item.prefix[0] != '/' && item.prefix[0] != '\\' && (item.prefix = '/' + item.prefix);
			glob.sync(path.join(item.dir, '/**/*.js'))
				.filter((oneJs) => oneJs.indexOf('.{m}.') > 0)
				.map((filterRoute) => {
					let routeType = filterRoute.match(/\{(.+?)\}/g).filter((type) => type != '{m}');
					if (routeType.length > 1) {
						console.error(new Error(filterRoute + ',file name error,only allowed tow "{*}" format!'))
					} else {
						!routeType[0] && (routeType[0]='{get}');
						let method = routeType[0].replace(/\{|\}/g, '');
						let purifyRoute = '/' + path.relative(item.dir, filterRoute).replace(/\.\{(.+?)\}|\.js/g, '');
						let combinedRoute = path.join(item.prefix || '',purifyRoute,item.ext || '').replace(/\\/g, '/');
						router[method](combinedRoute,async (ctx)=>{
							try{
								let result=await new Promise((resolve,reject)=>{
									ctx.success=resolve;
									ctx.error=reject;
									require(filterRoute)(ctx);
								})
								ctx.formatSuccess(result)
							}catch(err){
								ctx.formatError(err)
							}
						})
					}
				})
		})
		router.all('*',(ctx)=>{
			ctx.formatError([404,'Not Found!'])
		})
		return router.routes();
	}
	staticNoAuthorityRoutes(app){
		if(this.staticDirs && this.staticDirs.start==true){
			this.staticDirs.rootDirs=this.staticDirs.rootDirs || [];
			this.staticDirs.rootDirs.map((item,index)=>{
				if(typeof(item)=='string'){
					this.staticDirs.rootDirs[index]={
						rootDir:item
					}
				}else if(typeof(item)=='object'){
					if(item['authority']==true){
						let floderName=item.rootDir.split(path.sep);
						//node_modules 一定是没有权限的
						if(!floderName.includes('node_modules')){
							this.staticAuthorityRouteArr.push(item);
							this.staticDirs.rootDirs.splice(index,1);
						}
					}
				}
			})
			//系统代码页面
			let systemViewPath=path.join(__dirname,'../../viewServer/system');
			glob.sync(path.join(systemViewPath,'./assets/codePage/*.html')).map((item)=>{
				let code=path.basename(item,'.html');
				codePage[code]='/'+path.relative(systemViewPath,item).replace(/\\/g,'/')
			});
			//系统默认的静态路径
			this.staticDirs.rootDirs.push({
				rootDir:systemViewPath
			});
			this.staticDirs.rootDirs.map((item)=>{
				app.use(serve(item.rootDir))
			})
			///public 路由下面的默认没有权限
			NKGlobal.config.services.httpServer.security.noAuthorityRoutes.push('/public/*');
		}
	}
	viewsRoutes(app){
		//webpack静态路由
		if(this.staticDirs && this.staticDirs.start==true && this.staticDirs.viewDirs && this.staticDirs.viewDirs.webpack && this.staticDirs.viewDirs.webpack.start==true){
			let viewDirs=this.staticDirs.viewDirs;
			const myConf=require(path.join(__dirname,'../../viewServer/webpack/conf.js'));
			Object.assign(myConf,viewDirs.webpack);
			let extraConf=viewDirs.webpack.extraConf;
			if(extraConf){
				if(typeof(extraConf)=='string'){
					extraConf=require(extraConf);
				}else if(typeof(extraConf)!='object'){
					console.error(new Error('config->httpServer->routers->staticDirs->viewDirs->webpack->extraConf throw error，it must be path string or object!'));
					return;
				}
				myConf['entry']=extraConf['entry'];
				myConf['output']=extraConf['output'];
				delete extraConf['entry'];
				delete extraConf['output'];
			}
			let webpackConfig=require(myConf.webpackConfig);
			webpackConfig=merge(webpackConfig,extraConf);
			if(app.env=='production'){
				console.log('webpack building ......')
				webpack(webpackConfig,(err,stats)=>{
					if (err || stats.hasErrors()) {
					    console.error(err);
					    return;
					}else{
						console.log("webpack successful construction！");
					}
				});
				//加入静态目录中
				app.use(serve(webpackConfig.output.path));
			}else{
				const compiler=webpack(webpackConfig);
				app.use(devMiddleware(compiler,{
					noInfo: false,
					quiet: false,
					hot: true,
					lazy: false,
					watchOptions:{
					    aggregateTimeout: 300,
					    pool: true
					},
					publicPath:webpackConfig.output.publicPath || '/',
					stats: { colors: true, chunks: false }
				}));
				app.use(hotMiddleware(compiler));
			}
		}
	}
	async standardResponse(ctx,next){
		const res = (ctx, data = [], status, message) => {
			let returnInfo={
				data,
				meta: {
					status,
					message
				}
			};
			let accept=ctx.request.header.accept;
			let resStatus=ctx.response.status;
			if(accept && codePage[resStatus]){
				if(accept.includes('text/html')){
					ctx.redirect(codePage[resStatus])
				}else{
					ctx.response.body = returnInfo;
				}
			}else{
				ctx.response.body = returnInfo;
			}
		}
		const success = (ctx, data, status = 0, message = 'SUCCESS') => {
			res(ctx, data, status, message);
		}
		const error = (ctx, status, message) => {
			let eStatus=1;
			let eMessage=null;
			if(Object.prototype.toString.call(status)=='[object Array]'){
				eStatus = status[0];
				if(Object.prototype.toString.call(status[1])=='[object Error]'){
					eMessage = status[1].message;
				}else{
					eMessage = status[1];
				}
			}else if(Object.prototype.toString.call(status)=='[object Error]'){
				console.error(status)
				eMessage=status.message;
			}else if(Object.prototype.toString.call(status)=='[object Object]'){
				eStatus=status['status'] || eStatus;
				if(Object.prototype.toString.call(status['message'])=='[object Error]'){
					eMessage=status['message'].message;
				}else{
					eMessage=status['message'];
				}
			}else{
				eStatus=status;
				eMessage=message || 'ERROR';
			}
			res(ctx,[], eStatus, eMessage);
		}
		ctx.formatSuccess = success.bind(null, ctx);
		ctx.formatError = error.bind(null, ctx);
		await next();
	}
}
