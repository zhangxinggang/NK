var config={
	mode:process.env.NODE_ENV,
	cache:process.env.NODE_ENV=='development'?false:true,
	devtool:process.env.NODE_ENV=='development'?'eval-source-map':'source-map',
	entry:require('./entry.conf'),
	output:require('./output.conf'),
	module:require('./module.conf'),
	resolve:require('./resolve.conf'),
	plugins:require('./plugins.conf'),
	externals:require('./externals.conf'),
	devServer:require('./devServer.conf'),
	optimization:require('./optimization.conf')
};
module.exports=config;