const optimization={
  	nodeEnv:process.env.NODE_ENV
};
if(optimization.nodeEnv==='production'){
	const TerserPlugin = require('terser-webpack-plugin');
	optimization['minimizer']=[new TerserPlugin()];
};
module.exports=optimization;