module.exports={
    name: "authority_type",
    columns: {
        AuthorityTypeOID:{
            primary: true,
            type:Number,
            generated: true
        },
        AuthorityTypeAID:{
        	length:50,
            type:String,
            nullable:true
        },
        AuthorityTypeName:{
        	length:50,
            type:String,
            nullable:true
        }
    }
};