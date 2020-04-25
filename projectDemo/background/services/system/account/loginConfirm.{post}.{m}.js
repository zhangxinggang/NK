/**
 * @global
 * @namespace 用户管理
 */
/**
 * @function
 * @name "url::post::/NKBiz/servers/background/account/loginConfirm"
 * @description 用户登录验证
 * @memberof 用户管理
 * @param {string} req.body.AID 用户标识
 * @param {string} req.body.Password 用户密码
 * @param {string} [req.body.rememberMe=false] 是否记住我
 * @return {object} <pre>返回登录用户的相关信息：{
 * 	OID：用户OID
 * 	Name：用户姓名
 * 	PositionOID：所在地点OID
 * 	QQ：QQ号码
 * 	MobilePhone：手机号码
 * 	EMail：邮箱
 * 	WeChat：微信号
 * 	HeadPortrait：头像
 * 	Birthday：出生日期
 * 	CreateTime：账号创建时间
 * 	LoginCount：登录次数
 * 	RoleOID：角色OID
 * 	AID：用户AID
 * 	LastLoginTime：最后登录时间
 *	OrgOID：组织OID
 * 	TreeNode：组织Node
 * 	access_token:xx
 * }
 */
module.exports = function (sender) {
	let body =sender.request.body;
	let security=NKRequire("NK","security");
	//私钥解密
	let realPassword = security.DiffieHellman.decrypt(body.Password);
	//解密的密码不能明码保存
	var Password =security.DiffieHellman.sign(realPassword);
	let cookies = NKRequire("NK","cookies");
	let authority=NKRequire("NK","authority");
	/**
		maxAge              一个数字表示从 Date.now() 得到的毫秒数
		expires cookie      过期的 Date
		path cookie         路径, 默认是'/'
		domain cookie       域名
		secure             安全 cookie   默认false，设置成true表示只有 https可以访问
		httpOnly           是否只是服务器可访问 cookie, 默认是 true
		overwrite          一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。
	*/
	let token=authority.getToken({
		AID:body.AID,
		Name:'张兴刚'
	})
	sender.cookies.set(cookies.token,token,{
		maxAge: 0
	})
	setTimeout(function(){
		sender.success(token)
	},1000)
}