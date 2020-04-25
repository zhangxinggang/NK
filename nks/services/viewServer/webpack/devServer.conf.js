const wpc = require('./conf.js');
module.exports = {
  	contentBase:false,
  	host:'localhost',
	historyApiFallback: true,// 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
  	port:8080, // 默认8080
	compress: true,// 启用gzip压缩
  	inline:true, // 设置为true，当源文件改变时会自动刷新页面
  	hot:true, // 热启动
  	compress:true,
  	watchContentBase:false
};