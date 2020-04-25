module.exports={
    name: "accesslogs",
    columns: {
        OID:{
            primary: true,
            type:Number,
            generated: true
        },
        UserAID:{
        	length:64,
            type:String
        },
        URL:{
            length:1000,
            type:String
        },
        UserAgent:{
            length:256,
            type:String,
            nullable:true
        },
        HttpVersion:{
            length:10,
            type:String,
            nullable:true
        },
        RemoteAddr:{
            length:50,
            type:String,
            nullable:true
        },
        ReponseTime:{
            length:50,
            type:String,
            nullable:true
        },
        Status:{
            length:10,
            type:String,
            nullable:true
        },
    }
};