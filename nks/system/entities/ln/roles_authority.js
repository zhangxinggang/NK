module.exports={
    name: "roles_authority",
    columns: {
        RolesAuthorityOID:{
            primary: true,
            type:Number,
            generated: true
        },
        RoleOID:{
            type:Number
        },
        RouteOID:{
            type:Number
        },
        AuthorityTypeOID:{
            type:Number
        }
    },
    uniques:[
        {
            name:"RoleOID_RouteOID_AuthorityTypeOID",
            columns:[
                "RoleOID",
                "RouteOID",
                "AuthorityTypeOID"
            ]
        }
    ]
};