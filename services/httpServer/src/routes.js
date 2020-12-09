const glob = require('glob')
const path = require('path')
const Router = require('koa-router')
const koaMountRoutes = require('koa-mount-routes')
const send = require('koa-send')
const {normalizeSafe} = require('upath')
class Routers {
	constructor(options) {
		options = options ? options : {};
		Object.assign(this, options);
	}
	staticServe(opts){
		opts = Object.assign({}, opts)
		opts.root = path.resolve(opts.rootDir)
		if (opts.index !== false) opts.index = opts.index || 'index.html'
		const rootPath = normalizeSafe(opts.rootPath ? opts.rootPath + "/" : "/")
		return async function serve (ctx, next) {
			let done = false
			if (ctx.method.toLowerCase() === 'head' || ctx.method.toLowerCase() === 'get') {
				try {
					done = await send(ctx, normalizeSafe(ctx.path.replace(rootPath, "/")), opts)
				} catch (err) {
					if (err.status !== 404) {
						throw err
					}
				}
			}
			if (!done) {
				await next()
			}
		}
	}
	formatterRootPath(item){
		!item.rootPath && (item.rootPath = '/');
		item.rootPath = normalizeSafe('/' + item.rootPath)
	}
	authRouteCheck(item,auth,cb){
		if((!auth && item.auth===false) || (auth && item.auth!=false)){
			this.formatterRootPath(item)
			cb()
		}
	}
	staticRoutes(app,auth){
		this.staticDirs=this.staticDirs || []
		this.staticDirs.map(item=>{
			this.authRouteCheck(item,auth,()=>{
				app.use(this.staticServe(item))
			})
		})
	}
	mountRoutes(app,auth){
		this.mountRouteDirs=this.mountRouteDirs || []
		this.mountRouteDirs.map((item)=>{
			this.authRouteCheck(item,auth,()=>{
				item.urlPrefix=item.rootPath
				delete item.rootPath
				koaMountRoutes(app,item['rootDir'],item);
			})
		})
	}
	dynamicRoutes(app,auth) {
		const router = new Router();
		this.dynamicRouteDirs=this.dynamicRouteDirs || []
		this.dynamicRouteDirs.map((item) => {
			this.authRouteCheck(item,auth,()=>{
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
		})
		router.stack.length>0 && (app.use(router.routes()))
	}
	routeIntercept(){
		const router = new Router();
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
module.exports=Routers