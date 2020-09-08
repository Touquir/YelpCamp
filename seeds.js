var mongoose=require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data=[
	{
	name:"Dzouko Valley",
	image:"https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg",
	description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	},
	{
	name:"Shimla",
	image:"https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__340.jpg",
	description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	},
	{
	name:"Manali",
	image:"https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
	description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
	}
];

function seedDB(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		} else{
			console.log("removed!");
		}
		data.forEach(function(seed){
			Campground.create(seed, function(err,campground){
				if(err){
					console.log(err);
				}else{
					console.log("added!");
					Comment.create(
						{
							text:"cgtjugcucgjtdugjut",
							author:"someone"
						}, function(err,comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("commented!");
							}
					});
				}
			}); 
		});
	});
}

module.exports = seedDB;