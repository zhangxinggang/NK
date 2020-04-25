module.exports={
    name: "chat_records",
    columns: {
        OID:{
            primary: true,
            type:Number,
            generated: true
        },
        From_UOID:{
            type:Number
        },
        To_OID:{
            type:Number
        },
        IsRoomInfo:{
            length:1,
            type:String,
            default:0,
            comment:'0：非群消息 1：群消息'
        },
        ChatMSG:{
        	type:'text'
        },
        AddTime:{
            length:20,
            type:String
        },
        MsgType:{
            length:20,
            type:String
        }
    }
};