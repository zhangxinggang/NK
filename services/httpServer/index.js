import Koa from 'koa'
import cors from 'koa2-cors'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import helmet from 'koa-helmet'
import proxy from 'koa-server-http-proxy'
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import favicon from 'koa-favicon'
import Routers from './src/routes'
import {verifyToken} from './src/authority'
import {private_pkcs1,certificate} from './src/diffieHellman.js'
const app = new Koa();
app.env = process.env.NODE_ENV;
export default class HttpServer {
	constructor(config){
		this.config = config;
		if(config.requireAlias){
			global.NKRequire=function(namespace,file){
				var dir=config.requireAlias[namespace];
				if(fs.existsSync(dir)){
					return require(path.join(dir,file));
				}else{
					console.error(new Error('at config->services->httpServer->requireAlias not found '+namespace+'!'))
				}
			}
		}
	}
	start(callback) {
		if (!this.config.start) {
			callback && callback()
			return false;
		}
		// app.context.onerror = errorHandler;
		NKGlobal.config.project && (app.use(favicon(NKGlobal.config.project.favIcon)));
		if(this.config.proxy){
			Object.keys(this.config.proxy).forEach((item)=>{
				let options=this.config.proxy[item];
				app.use(proxy(item,options))
			})
		}
		const routes=new Routers({...this.config.routes});
		app
			.use(compress({
				filter:function(content_type){
					return /text/i.test(content_type)
				},
				threshold:2048,
				flush:require('zlib').Z_SYNC_FLUSH
			}))
			.use(bodyParser())
			.use(helmet())
			.use(cors());
		app.use(routes.standardResponse).use(verifyToken);
		routes.staticRoutes(app);
		routes.mountRoutes(app);
		app.use(routes.dynamicRoutes());
		routes.routeIntercept();
		let conf_http=this.config.protocols.http;
		let conf_https=this.config.protocols.https;
		let services=[];
		if(conf_http && conf_http.start){
			services.push(new Promise((resolve,reject)=>{
				http.createServer(app.callback()).listen(conf_http.port,()=>{
					console.info(`[httpServer] started at port ${conf_http.port}`)
					resolve()
				});
			}))
		}
		if(conf_https && conf_https.start){
			services.push(new Promise((resolve,reject)=>{
				!conf_https.key && (conf_https.key={});
				!conf_https.cert && (conf_https.cert={});
				let options={
					key:conf_https.key.value || (conf_https.key.path && fs.readFileSync(conf_https.key.path)) || private_pkcs1,
					cert:conf_https.cert.value || (conf_https.cert.path && fs.readFileSync(conf_https.cert.path)) || certificate
				};
				https.createServer(options,app.callback()).listen(conf_https.port,()=>{
					console.info(`[httpsServer] started at port ${conf_https.port}`)
					resolve()
				})
			}))
		}
		Promise.all(services).then(()=>{
			console.info(`httpServer info : PID:${process.pid}  NODE_ENV : ${app.env}`);
			callback && callback()
		})
	}
}
