const MiniCssExtractPlugin=require("mini-css-extract-plugin");
var rules=[{
    test:/\.css$/,
    use:[
    	process.env.NODE_ENV=='development'?'style-loader':MiniCssExtractPlugin.loader,
    	'css-loader'
    ]
},{
    test: /\.less$/,
    use: [
        process.env.NODE_ENV=='development'?'style-loader':MiniCssExtractPlugin.loader,
        'css-loader',
        {
			loader: 'less-loader',
			options: {
				modifyVars:{
					'primary-color':'#1DA57A',
					'link-color':'#1DA57A',
					'border-radius-base': '2px'
				},
				javascriptEnabled:true,
			}
		}
    ]
},{
    test: /\.scss$/,
    use:[{
        loader: "style-loader"
    },{
        loader: "css-loader"
    },{
        loader: "sass-loader"
    }]
},{
    test:/\.(js|jsx)/,
	exclude:new RegExp('node_modules'),
    loader:'babel-loader'
},{
    test:/\.html$/,
	exclude:new RegExp('node_modules'),
    loader:'html-loader'
},{
    test:/\.vue$/,
	exclude:new RegExp('node_modules'),
    loader: 'vue-loader'
},{
	test: /\.ejs$/,
	exclude:new RegExp('node_modules'),
	loader: 'ejs-loader'
},{
	test: /\.(svg|woff|woff2?|eot|ttf|otf)$/,
	loader: 'url-loader?limit=10240&name=public/fonts/[name]-[hash:6].[ext]'
},{
    test: /\.(png|svg|jpe?g|gif)$/,
    use: [{
        loader: 'url-loader',
        options:{
            esModule: false,
            // 这里的options选项参数可以定义多大的图片转换为base64
            name: '[name]-[hash:6].[ext]',
            limit:50*1024,//小于50k就会转成base64
            outputPath: 'images' //定义输出的图片文件夹
        }
    }]
},{
	test: /\.json$/,
	exclude:new RegExp('node_modules'),
	loader: 'json-loader',
}];
module.exports={
	rules:rules
};