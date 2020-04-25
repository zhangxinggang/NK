module.exports = function(sender) {
	if (sender.req.session){
		delete sender.req.session.userInfo
	}
	//cookie用于自动登录
	var cookies=NKRequire("LN","cookies");
	sender.res.cookie(cookies.autoLogin,null,{
		maxAge : 0
	});
	sender.res.cookie(cookies.token,null,{
		maxAge : 0
	});
	sender.res.cookie(cookies.isLoggedIn,'false');
	sender.res.redirect("/");
}