let mongoose = require("mongoose");


let campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    author:{
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"user"
      },
      username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports = mongoose.model("campGround",campgroundSchema);
