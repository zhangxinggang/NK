export function plainArrfromNode2TreeArr(treeNodeName,data){
	let hashNode={};
	for(let i=0;i<data.length;i++){
		hashNode[data[i][treeNodeName]]=data[i]
	}
	let dealData=[];
	let keys=Object.keys(hashNode);
	for(let key in hashNode){
		let isRoot=true;
		keys.map((item,index)=>{
			let nodeHead=item+'.';
			if(key.startsWith(nodeHead)){
				isRoot=false;
				!hashNode[item]['children'] && (hashNode[item]['children']=[]);
				hashNode[item]['children'].push(hashNode[key])
			}
		})
		if(isRoot){
			dealData.push(hashNode[key])
		}
	}
	return dealData;
}
export function plainArrfromParent2TreeArr(id, parentID, arr, antdTree){
	var result = JSON.parse(JSON.stringify(arr));
	var hash = {};
	for (var i = 0; i < result.length; i++) {
		if(result[i]['ChildrenCount']>0){
			result[i]['children']=[]
		}
		if (antdTree) {
			!result[i]['id'] && (result[i]['id'] = result[i][id]);
			!result[i]['value'] && (result[i]['value'] = result[i][id]);
			!result[i]['title'] && (result[i]['title'] = result[i][antdTree]);
		}
		if (hash[result[i][id]]) {
			!hash[result[i][id]]['children'] && (hash[result[i][id]]['children'] = []);
			if (result[i]['children']) {
				hash[result[i][id]]['children'] = hash[result[i][id]]['children'].concat(result[i]['children'])
			}
		} else {
			hash[result[i][id]] = result[i]
		}
	}
	var dealData = [];
	for (var i = 0; i < result.length; i++) {
		if (hash[result[i][parentID]]) {
			!hash[result[i][parentID]]['children'] && (hash[result[i][parentID]]['children'] = []);
			hash[result[i][parentID]]['children'].push(result[i])
		}
	}
	for (var key in hash) {
		dealData.push(hash[key])
	}
	return dealData;
}