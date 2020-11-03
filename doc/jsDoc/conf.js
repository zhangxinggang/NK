const path=require('path');
const config=require(path.join(process.cwd(),'./config.js'));
const jsdoc=config.jsdoc || {};
const project=config.project || {};
module.exports={
    "tags": {
        "allowUnknownTags": true,
		"dictionaries": ["jsdoc","closure"]
    },
    "source": {
    	"include":jsdoc.include,
        "includePattern": ".+\\.js(doc)?$",
        "excludePattern": "(^|\\/|\\\\)_",
		"exclude":[]
    },
	"templates": {
		"cleverLinks": true,
		"monospaceLinks": true,
		"default": {
			"outputSourceFiles" : true,
			"useLongnameInNav":true
		},
		"applicationName":project.name || 'nk',
        "disqus": "",
        "googleAnalytics": "",
        "meta": {
            "title":project.name || 'nk',
            "description":'开发文档',
            "keyword":'NK,nodejs'
        },
        "linenums": true
	},
	"opts": {
        "template":path.join(__dirname,"./template/"+jsdoc.template),
        "encoding":"utf8",
        "destination":jsdoc.destination,
        "recurse": true
    }
}