const wpc = require('./conf.js');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const plugins=require('./plugins.conf');
let getEntry = () => {
	let entrys = {};
	let setEntryFile=(entryObj)=>{
		let files = glob.sync(entryObj.rootDir + '/**/*.js');
		files.forEach(function(_file){
			let srcLength = entryObj.rootDir.length;
		    let file = path.parse(_file);
		    let fileGroups=file.name.split('.');
		    if(fileGroups[fileGroups.length-1].toLowerCase()==wpc.entryExtFlag){
		        //每一个入口文件都有一个视图文件
		        fileGroups.pop();
		        let chunkName=path.join(entryObj.rootPath,file.dir.slice(srcLength+1),fileGroups.join('.'));
		        chunkName=chunkName+(wpc.routeSuffixName?(wpc.routeSuffixName.startsWith('.')?wpc.routeSuffixName:('.'+wpc.routeSuffixName)):'');
		        entrys[chunkName]=path.resolve(_file);
		        let tempObj={
		            filename:chunkName,
		            showErrors:true,
		            minify: {
		                //是否对大小写敏感，默认false
		                caseSensitive: true,
		                //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled  默认false
		                collapseBooleanAttributes: true,
		                //是否去除空格，默认false
		                collapseWhitespace: true,
		                //是否压缩html里的css（使用clean-css进行的压缩） 默认值false；
		                minifyCSS: true,
		                //是否压缩html里的js（使用uglify-js进行的压缩）
		                minifyJS: true,
		                //Prevents the escaping of the values of attributes
		                preventAttributesEscaping: true,
		                //是否移除属性的引号 默认false
		                removeAttributeQuotes: true,
		                //是否移除注释 默认false
		                removeComments: true,
		                //从脚本和样式删除的注释 默认false
		                removeCommentsFromCDATA: true,
		                //是否删除空属性，默认false
		                removeEmptyAttributes: true,
		                //若开启此项，生成的html中没有 body 和 head，html也未闭合
		                removeOptionalTags: false, 
		                //删除多余的属性
		                removeRedundantAttributes: true, 
		                //删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false
		                removeScriptTypeAttributes: true,
		                //删除style的类型属性， type="text/css" 同上
		                removeStyleLinkTypeAttributes: true,
		                //使用短的文档类型，默认false
		                useShortDoctype: true,
		            },
		            chunks:[chunkName],
		            inject:'body'
		        }
		        try{
		            let templateExtFlag=wpc.templateExtFlag;
		            templateExtFlag=templateExtFlag.replace(/{|}/g,'');
		            let tpl=path.resolve(file.dir,fileGroups.join('.')+'.'+templateExtFlag);
		            fs.accessSync(tpl);
		            tempObj['template']=tpl;
		        }catch(e){
		            let tpl=path.resolve(file.dir,fileGroups.join('.')+'.'+wpc.templateExtFlag+'.js');
		            try{
		                fs.accessSync(tpl);
		                tempObj['template']=tpl;
		            }catch(e){
						let routeSuffixName=(wpc.routeSuffixName?(wpc.routeSuffixName.startsWith('.')?wpc.routeSuffixName:('.'+wpc.routeSuffixName)):'.html');
						let tpl=path.resolve(file.dir,fileGroups.join('.')+routeSuffixName);
						try{
						    fs.accessSync(tpl);
						    tempObj['template']=tpl;
						}catch(e){
							let tpl=path.resolve(file.dir,'index'+routeSuffixName);
							try{
								fs.accessSync(tpl);
								tempObj['template']=tpl;
							}catch(e){
								tempObj['templateContent']='<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"></head><body><div id=app></div></body></html>'
							}
						}
					}
		        }
		        plugins.push(new HtmlWebpackPlugin(tempObj))
		    }
		});
	}
	if(Object.prototype.toString.call(wpc.entry)=='[object Array]'){
		wpc.entry.forEach((item)=>{
			setEntryFile({
				rootDir:item,
				rootPath:'/'
			})
		})
	}else if(Object.prototype.toString.call(wpc.entry)=='[object Object]'){
		for(let key in wpc.entry){
			setEntryFile({
				rootDir:wpc.entry[key],
				rootPath:key
			})
		}
	}else{
		setEntryFile({
			rootDir:wpc.entry,
			rootPath:'/'
		})
	}
    return entrys;
}
module.exports = getEntry();