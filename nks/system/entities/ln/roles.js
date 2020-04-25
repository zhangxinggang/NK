module.exports={
    name: "roles",
    columns: {
        RoleOID:{
            primary: true,
            type:Number,
            generated: true
        },
        OrgOID:{
            type:Number
        },
        RoleName:{
            length:50,
            type:String
        }
    }
};