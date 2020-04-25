module.exports={
    name: "wxgzh_users",
    columns: {
        UserOID:{
            primary: true,
            type:Number,
            generated: true
        },
        openid:{
            length:255,
            type:String,
            unique:true
        },
        nickname:{
            length:50,
            type:String,
            nullable:true
        },
        sex:{
            length:1,
            type:String,
            comment:'1、男性 2、女性'
        },
        province:{
        	length:50,
            type:String,
            nullable:true
        },
        city:{
            length:50,
            type:String,
            nullable:true
        },
        country:{
        	length:50,
            type:String,
            nullable:true
        },
        headimgurl:{
        	length:255,
            type:String,
            nullable:true
        },
        privilege:{
        	length:1000,
            type:String,
            nullable:true,
        	comment:'用户特权信息'
        },
        unionid:{
        	length:255,
            type:String,
            nullable:true,
        	comment:'用户统一标识。针对一个微信开放平台帐号下的应用，同一用户的unionid是唯一的。'
        },
        CreateTime:{
            type:Date,
            readonly:true
        },
        LastLoginTime:{
            type:Date
        },
		MobilePhone:{
		    length:50,
		    type:String,
		    nullable:true
		},
		IdCardNum:{
			length:100,
			type:String,
			nullable:true
		},
		RealName:{
			length:50,
			type:String,
			nullable:true
		}
    }
};