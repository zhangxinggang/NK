var path=require('path');
var fs=require('fs');
var url=require('url');
module.exports.codes={
    100:'客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应。',
    101:'服务器已经理解了客户端的请求，并将通过Upgrade 消息头通知客户端采用不同的协议来完成这个请求。在发送完这个响应最后的空行后，服务器将会切换到在Upgrade 消息头中定义的那些协议。 　　只有在切换新的协议更有好处的时候才应该采取类似措施。例如，切换到新的HTTP 版本比旧版本更有优势，或者切换到一个实时且同步的协议以传送利用此类特性的资源。',
    102:'由WebDAV（RFC 2518）扩展的状态码，代表处理将被继续执行。',
    //服务器成功处理了请求的状态代码，说明网页可以正常访问
    200:'请求成功',
    201:'请求已创建',
    202:'请求已接受',
    203:'非授权信息',
    204:'无内容',
    205:'重置内容',
    206:'部分内容',
    //要完成请求，您需要进一步进行操作。通常，这些状态代码是永远重定向的。
    300:'多种选择',
    301:'永久移动',
    302:'临时移动',
    303:'查看其他位置',
    304:'未修改',
    305:'使用代理',
    307:'临时重定向',
    //HTTP状态码表示请求可能出错
    400:'错误请求',
    401:'身份验证错误',
    403:'禁止',
    404:'未找到',
    405:'方法禁用',
    406:'不接受',
    407:'需要代理授权',
    408:'请求超时',
    409:'冲突',
    410:'已删除',
    411:'需要有效长度',
    412:'未满足前提条件',
    413:'请求实体过大',
    414:'请求的 URI 过长',
    415:'不支持的媒体类型',
    416:'请求范围不符合要求',
    417:'未满足期望值',
    421:'无法被服务器满足',
    422:'请求超过服务器许可的最大范围',
    424:'请求发生错误',
    426:'客户端应当切换到TLS/1.0',
    449:'代表请求应当在执行完适当的操作后进行重试',
    //服务器在尝试处理请求时发生内部错误。这些错误可能是服务器本身的错误，而不是请求出错
    500:'服务器内部错误',
    501:'尚未实施',
    502:'错误网关',
    503:'服务不可用',
    504:'网关超时',
    505:'HTTP 版本不受支持',
    506:'服务器存在内部配置错误',
    507:'服务器无法存储完成请求所必须的内容',
    509:'服务器达到带宽限制',
    510:'获取资源所需要的策略并没有没满足'
}
module.exports.codePage=function(code,req,res){
    var LNLayoutDir=NKGlobal.config.httpServer.LNLayoutDir;
    var tempPath=path.join(LNLayoutDir,'./default/'+code+'.ejs');
    fs.access(tempPath,function(err){
        if(err){
            tempPath=path.join(LNLayoutDir,'./default/httpStatusCodeHint.ejs');
        }
        var pathname=url.parse(req.url).pathname;
        var homePage_url=NKGlobal.config.httpServer.defaultUrls.homePage_url;
        var loginOut_url=NKGlobal.config.httpServer.defaultUrls.loginOut_url;
        homePage_url=pathname==homePage_url?loginOut_url:homePage_url;
        res.render(tempPath,{
            code:code,
            info:module.exports.codes[code],
            jumpLink:homePage_url
        });
    })
}