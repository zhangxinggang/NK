import path from 'path'
import { configure, getLogger } from 'log4js'

export default class Logger{
	constructor(config){
		config.logger=config.logger || {};
		config.communication=config.communication || {};
		this.loggerDir=config.logger.dir;
		let mailer=config.communication.mailer || {};
		mailer.start && (this.mailer=mailer[mailer.server]) && (this.mailer.defaultRecipients=mailer.defaultRecipients);
	}
	init(){
		//级别：OFF、FATAL、ERROR、WARN、INFO、DEBUG、ALL
		let appenders={
			stdout:{
				type:'console'
			},
			logFile:{
				type:'dateFile',
				filename : path.join(this.loggerDir,'log/'),
				pattern : "yyyy-MM-dd.log",
				alwaysIncludePattern: true,
				compress: false,
				encoding: 'utf-8'
			},
			errorFile: {
				type: 'dateFile',
				filename: path.join(this.loggerDir,'error/'),
				pattern : "yyyy-MM-dd.log",
				alwaysIncludePattern: true,
				compress: false,
				encoding: 'utf-8'
			}
		};
		let categories={
			default:{
				appenders:['stdout','logFile'],
				level:'info'
			},
			errorFile:{
				appenders: ['stdout','errorFile'],
				level: 'error',
			}
		};
		if(this.mailer){
			appenders.mailer={
				type: '@log4js-node/smtp',
				recipients:this.mailer.defaultRecipients,
				transport: 'SMTP',
				subject: '[notice] NK Info',
				sender:this.mailer.auth.user,
				SMTP:this.mailer
			};
			categories.mailer={
				appenders:['mailer'],
				level: 'error',
			}
		}
		configure({
			appenders:appenders,
			categories:categories
		});
		let consoleLog = getLogger('stdout');
		let errorLog=getLogger('errorFile');
		let mailLog=getLogger('mailer');
		console.error = errorLog.error.bind(errorLog);
		console.warn = consoleLog.warn.bind(consoleLog);
		console.info = consoleLog.info.bind(consoleLog);
		console.sendMail=mailLog.error.bind(mailLog);
	}
}