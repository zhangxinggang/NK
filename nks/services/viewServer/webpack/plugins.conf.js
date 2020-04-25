const plugins=[];
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin=require("mini-css-extract-plugin");
if(process.env.NODE_ENV=='development'){
	plugins.push(new webpack.HotModuleReplacementPlugin(),new webpack.NamedModulesPlugin());
}else{
	const {CleanWebpackPlugin}=require('clean-webpack-plugin');
	plugins.push(new webpack.HashedModuleIdsPlugin(),new CleanWebpackPlugin());
}
plugins.push(new MiniCssExtractPlugin({
    filename: "[name].[contenthash:8].css",
    chunkFilename: "public/css/[id].[hash].css"
}));
plugins.push(new VueLoaderPlugin(),new webpack.NoEmitOnErrorsPlugin());
module.exports=plugins;