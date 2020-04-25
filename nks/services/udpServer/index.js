export default class UdpServer{
    constructor(udpServer) {
        this.udpServer=udpServer;
    }
    start(){
        var that=this;
        var udpServer=that.udpServer;
        if(udpServer && udpServer.start){
            var dgram = require('dgram');
            that.server = dgram.createSocket('udp4');
            that.server.on('message', function(msg,rinfo){
                console.log('客户端发送的数据:' + msg);
                //回发确认
                that.server.send(msg,0,msg.length,rinfo.port,rinfo.address);
            });
            var udp_port=udpServer.port || 41234;
            that.server.on('listening',function(){
                console.info('udpServer started at port：'+udp_port);
            });
            that.server.bind(udp_port,'localhost');
        }
    }
}