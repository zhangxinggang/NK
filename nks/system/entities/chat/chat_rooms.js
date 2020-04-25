module.exports={
    name: "chat_rooms",
    columns: {
        OID:{
            primary: true,
            type:Number,
            generated: true
        },
        InternetName:{
            length:50,
            type:String,
            nullable:true
        },
        Signature:{
        	length:200,
            type:String,
            nullable:true
        },
        Members:{
            type:'text',
            comment:'好友使用,隔开',
            nullable:true
        },
        HeadPortrait:{
            length:255,
            type:String,
            nullable:true
        }
    }
};