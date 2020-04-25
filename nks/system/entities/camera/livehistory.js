module.exports={
    name: "livehistory",
    columns: {
        OID:{
            primary: true,
            type:Number,
            generated: true
        },
        startTime:{
            length:50,
            type:String
        },
        endTime:{
            length:50,
            type:String,
            nullable:true
        },
        videoName:{
            length:50,
            type:String
        },
        streamUrl:{
        	length:255,
            type:String
        },
        videoUrl:{
            length:50,
            type:String
        }
    }
};