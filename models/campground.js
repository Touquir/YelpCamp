var mongoose=require("mongoose");
var campgroundSchema= new mongoose.Schema({
	name:String,
	price:String,
	image:String,
	description: String,
	location:String,
	coordinates:Array,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}],
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    place:String
});
module.exports=mongoose.model("Campground", campgroundSchema);