module.exports={
    name: "oplogs",
    columns: {
        OID:{
            primary: true,
            type:Number,
            generated: true
        },
        UserAID:{
            length:64,
            type:String,
            nullable:true
        },
        AddTime:{
        	length:25,
            type:String
        },
        LogRecord:{
            type:'text',
            nullable:true
        },
        OldLogRecord:{
            type:'text',
            nullable:true
        },
        OperationType:{
            type:Boolean,
            comment:'1：查，2：增，3：删，4：改'
        },
        URL:{
            length:1000,
            type:String
        },
        Description:{
            length:256,
            type:String,
            nullable:true
        }
    }
};