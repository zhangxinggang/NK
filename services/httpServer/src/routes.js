import glob from 'glob'
import path from 'path'
import Router from 'koa-router'
import koaMountRoutes from 'koa-mount-routes'
import serve from 'koa-static-server'

const router = new Router();
export default class Routers {
	constructor(options) {
		options = options ? options : {};
		Object.assign(this, options);
	}
	formatterRootPath(item){
		!item.rootPath && (item.rootPath = '/');
		item.rootPath[0] != '/' && item.rootPath[0] != '\\' && (item.rootPath = '/' + item.rootPath);
	}
	staticRoutes(app){
		this.staticDirs=this.staticDirs || []
		this.staticDirs.map(item=>{
			this.formatterRootPath(item)
			app.use(serve(item))
		})
	}
	mountRoutes(app){
		this.mountRouteDirs=this.mountRouteDirs || []
		this.mountRouteDirs.map((item)=>{
			this.formatterRootPath(item)
			item.urlPrefix=item.rootPath
			delete item.rootPath
			koaMountRoutes(app,item['rootDir'],item);
		})
	}
	dynamicRoutes() {
		this.dynamicRouteDirs=this.dynamicRouteDirs || []
		this.dynamicRouteDirs.map((item) => {
			this.formatterRootPath(item)
			glob.sync(path.join(item.rootDir, '/**/*.js'))
				.filter((oneJs) => oneJs.indexOf('.{m}.') > 0)
				.map((filterRoute) => {
					let routeType = filterRoute.match(/\{(.+?)\}/g).filter((type) => type != '{m}');
					if (routeType.length > 1) {
						console.error(new Error(filterRoute + ',file name error,only allowed tow "{*}" format!'))
					} else {
						!routeType[0] && (routeType[0]='{get}');
						let method = routeType[0].replace(/\{|\}/g, '');
						let purifyRoute = '/' + path.relative(item.rootDir, filterRoute).replace(/\.\{(.+?)\}|\.js/g, '');
						let combinedRoute = path.join(item.rootPath || '',purifyRoute,item.ext || '').replace(/\\/g, '/');
						router[method](combinedRoute,async (ctx)=>{
							try{
								let result=await new Promise((resolve,reject)=>{
									ctx.success=resolve;
									ctx.error=reject;
									require(filterRoute)(ctx);
								})
								ctx.formatSuccess(result)
							}catch(err){
								ctx.throw(500,err)
								// ctx.formatError(err)
							}
						})
					}
				})
		})
		return router.routes();
	}
	routeIntercept(){
		router.all('*',(ctx)=>{
			ctx.throw(404,new Error('Not Found!'))
			// ctx.formatError([404,'Not Found!'])
		})
	}
	async standardResponse(ctx,next){
		const res = (ctx, data = [], status, msg) => {
			let returnInfo={
				data,
				meta: {
					status,
					msg
				}
			};
			ctx.response.body = returnInfo;
		}
		const success = (ctx, data, status = 200, message = 'success') => {
			res(ctx, data, status, message);
		}
		const error = (ctx, status, message) => {
			let eStatus=0;
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
				if(!message){
					eMessage=status
				}else{
					eStatus=status;
					eMessage=message || 'error';
				}
			}
			res(ctx,[], eStatus, eMessage);
		}
		ctx.formatSuccess = success.bind(null, ctx);
		ctx.formatError = error.bind(null, ctx);
		await next();
	}
}
