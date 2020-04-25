class Translation{
    constructor(x){
        if(x){
            this.supplier=x;
        }else{
            this.supplier='sanliuling';
        }
    }
    convert(options){
        this[this.supplier](options)
    }
    sanliuling(options){
        var AccessRouting=NKRequire('LN','accessRouting');
        var accessRouting=new AccessRouting();
        accessRouting.remoteRoute({
            method:'get',
            url:'https://fanyi.so.com/index/search',
            data:{
                query:options.query,
                eng:"en2cn"==options.eng?1:0
            },
            success:function(data){
                if(data.error==0){
                    options.success(data.data.fanyi)
                }else{
                    options.error(data.msg)
                }
            },
            error:function(err){
                options.error(err)
            }
        })
    }
}
module.exports=Translation;