module.exports={
    name: "orgs",
    columns: {
        OrgOID:{
            primary: true,
            type:Number,
            generated: true
        },
        OrgOIDParent:{
            type:Number,
            default:-1
        },
        OrgName:{
            length:50,
            type:String,
            unique:true
        },
        SortNumber:{
            type:Number,
            default:1
        },
        TreeNode:{
            type:String,
            length:255,
            unique:true,
            default:0
        }
    },
    // relations: {
    //     categories: {
    //         target: "Category",
    //         type: "many-to-many",
    //         joinTable: true,
    //         cascade: true
    //     }
    // }
};