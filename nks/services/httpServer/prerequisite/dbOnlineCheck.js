const dbOnlineCheck=function(){
	return new Promise((resolve,reject)=>{
		if(NKGlobal['config']['storage'] && (NKGlobal['config']['storage']['orm']['start']!=false)){
			const orm= NKRequire("NK","orm").conn();
			orm.authenticate().then(function(){
				let engine=NKGlobal['config']['storage']['orm']['engine'];
				console.info(engine+' 数据库运行正常!')
				resolve(true)
			}).catch(function(err){
				console.log(err)
				setTimeout(function(){
					dbOnlineCheck();
				},1000*5)
			});
		}else{
			resolve(true)
		}
	})
	
}
module.exports=dbOnlineCheck;