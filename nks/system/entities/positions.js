module.exports={
    name: "positions",
    columns: {
        PositionOID:{
            primary: true,
            type:Number,
            generated: true
        },
        Name:{
            length:50,
            type:String
        },
        EnglishName:{
            length:50,
            type:String
        },
        PositionAID:{
        	length:50,
            type:String,
            nullable:true
        },
        PositionOIDParent:{
            type:Number,
            default:-1
        },
        IsHot:{
            type:Boolean,
            default:0,
            comment:'0:非热点城市，1:热点城市'
        },
        SortNumber:{
            type:Number
        }
    },
    relations: {
        parent: {
            target:'positions',
            type: 'many-to-one',
            joinColumn: {
                name:'PositionOIDParent'
            },
            inverseSide: "childrens"
        },
        childrens: {
            target:'positions',
            type: 'one-to-many',
            joinColumn: {
                name:'PositionOID'
            },
            inverseSide: "parent"
        }
    }
};