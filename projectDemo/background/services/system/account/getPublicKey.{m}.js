module.exports=function(sender){
    var hellman=NKRequire('NK','diffieHellman.js');
    setTimeout(function(){
        sender.success(hellman.publicKey_pkcs8);
    },1000)
}