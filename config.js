const path = require('path');
const NKSPath = path.join(__dirname, 'nks');
module.exports = {
	services: {
		rtmpServer: {
			start: true,
			port: 1935,
			chunk_size: 60000,
			gop_cache: true,
			ping: 60,
			ping_timeout: 30
		},
		rtspServer: {
			start: true,
			port: 554
		},
		tcpServer: {
			start: true,
			port: 8087
		},
		udpServer: {
			start: true,
			port: 41234
		},
		httpServer: {
			start: true,
			protocols: {
				http: {
					start: true,
					port: 8081
				},
				https: {
					start: true,
					port: 8080,
					//key cert 默认读取path，如果没有path，会获取value字符串，如果都不设置，那么会是使用系统默认值开启https
					// key:{
					// 	path:path.join(__dirname,'../cert/2_www.saybeauty.cn.key'),
					// },
					// cert:{
					// 	path:path.join(__dirname,'../cert/1_www.saybeauty.cn_bundle.crt'),
					// 	value:''
					// }
				}
			},
			homePage_url: '/webpack/main.html#/login',
			autoRunTask: {
				start: true,
				rootDirs: [path.join(__dirname, './projectDemo/background/tasks')]
			},
			security: {
				secret: 'zxgLN',
				tokenExpiresIn: '8h',
				noAuthorityRoutes: [
					'/assets/*',
					'/NKBiz/services/system/account/*',
					'/webpack/main.html#/login',
					'/mountRouter/*'
				]
			},
			routes: {
				routeDirs: [{
					prefix: '/NKBiz',
					dir: path.join(__dirname, './projectDemo/background')
				}],
				mountRouteDirs: [{
					rootDir:path.join(__dirname,'./projectDemo/background/mountRouter'),
					urlPrefix: '/mountRouter'
				}],
				staticDirs: {
					start: true,
					rootDirs: [
						path.join(__dirname,'./projectDemo/nkv/public'),
						{
							authority: false,
							rootDir:path.join(__dirname,'./projectDemo/nkv/vue/assets') //npm list --depth=0 -global查询所有模块的版本号
						}
					],
					viewDirs: {
						webpack: {
							start: true,
							extraConf: path.join(__dirname, './webpackProjectConf.js')
						}
					}
				}
			},
			requireAlias: {
				"NK": path.join(NKSPath, "./services/httpServer/src")
			},
			proxy: {
				'/NKWeather': {
					target: 'http://wthrcdn.etouch.cn/weather_mini',
					//本地请求：http://127.0.0.1+port+/NKWeather?citykey=101010100等于访问http://wthrcdn.etouch.cn/weather_mini?citykey=101010100
					// pathRewrite: {
					// 	'^/api': ''
					// },
					changeOrigin: true, // target是域名的话，需要这个参数，
					secure: false, // 设置支持https协议的代理
				}
			}
		}
	},
	storage: {
		orm: {
			start:false,
			engine: 'mysql',
			entities: [path.join(NKSPath, '/system/entities')],
			mysql: {
				insecureAuth: true,
				host: '127.0.0.1',
				user: 'root',
				password: 'zxg540752013',
				database: 'LN',
				port: 3103,
				// logging:true,
				// synchronize:true,
				multipleStatements: true,
				maxOperationRow: 50, //最大操作行数，防止查询过程语句太大，大于max-allowed-packet
				pool: {
					maxConnections: 30,
					minConnections: 10,
					maxIdleTime: 1000 * 30,
				}
			}
		}
	},
	logger: {
		dir: path.join(__dirname, '/log')
	},
	communication: {
		//邮件发送【系统错误信息、邮件服务】
		mailer: {
			start: true,
			defaultRecipients: ['540752013@qq.com'],
			server: 'tengxun',
			tengxun: {
				host: 'smtp.qq.com',
				secureConnection: true,
				port: 465,
				auth: {
					user: '540752013@qq.com',
					pass: 'zrhifpxqcdtcbfdc'
				}
			}
		}
	},
	project: {
		englishName: "NK",
		description: '',
		keyword: '',
		name: "NK",
		version: "0.1",
		favIcon: path.join(__dirname, "./projectDemo/nkv/public/images/favIcon/LN.ico"),
		providers: 'zxg',
		providersHref: 'http://www.zxghp.cn'
	},
	jsdoc: {
		start: false,
		include: [path.join(__dirname, './projectDemo/background/services')],
		destination: path.join(__dirname, 'jsdocument'),
		template: ['default', 'better-docs', 'docdash', 'jaguarjs', 'minami', 'tui'][0]
	}
}
