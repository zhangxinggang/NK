const path=require('path');
module.exports={
	entry: {
		webpack:path.resolve(__dirname, './projectDemo/nkv/vue')
	},
	output: path.resolve(__dirname, './projectDemo/nkv/dist'),
	resolve:{
		alias:{
			'@v':path.resolve(__dirname,'./projectDemo/nkv/vue'),
			'@iconfont':path.resolve(__dirname,'./nks/services/viewServer/system')
		},
		extensions:['.jsx','.vue']
	}
}