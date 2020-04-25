const wpc = require('./conf.js');
module.exports={
  	path:wpc.output,
  	publicPath:wpc.publicPath || '/',
  	filename:'[name].[hash].js',
  	chunkFilename:'public/js/[name].[hash].bundle.js'
};