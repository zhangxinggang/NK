import services from './utils/services'
import logger from './utils/logger'
import { exec } from 'child_process'
import dotenv from 'dotenv'

let init=(config)=>{
	//环境变量
	dotenv.config();
	!process.env.NODE_ENV && (process.env.NODE_ENV='production');
	new logger(config).init();
	if(config.project){
		process.title=config.project.name || 'nk';
		if(/.*[\u4e00-\u9fa5]+.*$/.test(config.project.englishName)){
			console.error("config->project->englishName can't have chinese word!");
		}
	}
	if(config.jsdoc && config.jsdoc.start){
		exec('jsdoc -a all -c "./nks/doc/jsDoc/conf.js"',(error,stdout,stderr)=>{
			if(error){
				console.error(error);
				return;
			}
			console.info('js document 成功生成！')
		},{
			encoding:'utf8'
		});
	}
	process.on('uncaughtException', (e) => {
		console.error('uncaughtException:', e);
	});
	process.on('unhandledRejection', (e) => {
		console.error('unhandledRejection:', e);
	});
	process.on('rejectionHandled', (e) => {
		console.error('rejectionHandled:', e);
	})
}

export default function(config) {
	global.NKGlobal = {config};
	init(config);
	let allService = [];
	Object.keys(services).map((item) => {
		allService.push(new Promise((resolve, reject) => {
			let temp = item.split('');
			temp[0] = temp[0].toLowerCase();
			let serverName=temp.join('');
			let serverConf=config['services'][serverName];
			let server = new services[item](serverConf);
			resolve(server)
		}))
	})
	Promise.all(allService).then(function(services) {
		//配置文件指定任务
		services.map((server) => {
			server.start();
		})
	})
}
