/**
 * @function
 * @name "url::post::/LNBiz/servers/background/account/register"
 * @description 注册新用户。
 * @memberof 用户管理
 * @param {string} req.query.userAID 用户名
 * @param {string} req.query.password 加密后的密码。通过rsa公钥加密。
 * @param {string} req.query.userName 用户名
 * @param {string} req.query.email 用户邮箱
 * @return {object} 数据库插入成功信息
 */
module.exports = function(sender) {
    var body=sender.req.body;
    var allowRegistered=NKGlobal.config.httpServer.security.allowRegistered;
    if(allowRegistered){
        var DBServer=NKRequire('LN','DBServer')();
        DBServer.exec({
            sql:'select OID from users where AID=? ',
            parameters:[body.userAID],
            success:function(result){
                if(result.length>0){
                    sender.error(new Error('用户名已存在！'))
                }else{
                    var security=NKRequire('LN','security');
                    var realPassword=security.DiffieHellman.decrypt(body.password);
                    var password=security[NKGlobal.config.httpServer.security.encryptMethod]['encryptPwd'](realPassword);
                    var DBServer=NKRequire('LN','DBServer')();
                    DBServer.exec({
                        sql:'insert into users(AID,Name,Password,EMail) values(?,?,?,?)',
                        parameters:[body.userAID,body.userName,password,body.email],
                        success:function(result){
                            sender.success(result)
                        },
                        error:sender.error
                    })
                }
            },
            error:sender.error
        })
    }else{
        sender.error(new Error('Not allowRegistered'))
    }
}