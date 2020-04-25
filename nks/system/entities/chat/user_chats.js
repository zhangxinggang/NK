module.exports={
    name: "user_chats",
    columns: {
        OID:{
            primary: true,
            type:'int',
            generated:'increment'
        },
        UserOID:{
            type:Number
        },
        Friends:{
        	type:'text',
            comment:'好友使用,隔开',
            nullable:true
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
        }
    }
};