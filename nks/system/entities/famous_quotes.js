module.exports={
    name: "famous_quotes",
    columns: {
        OID:{
            primary: true,
            type:Number,
            generated: true
        },
        QuoteCN:{
            length:1000,
            type:String,
            nullable:true
        },
        QuoteEN:{
        	length:1000,
            type:String,
            nullable:true
        },
        Author:{
            length:50,
            type:String,
            nullable:true
        }
    }
};