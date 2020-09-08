//==========================
// Campground ROUTES
//==========================
//require('dotenv').config();
require("dotenv").config();
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");  
var middleware=require("../middleware");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

//router.use(middleware());

//Show all cmapgrounds
router.get("/campgrounds", function(req,res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name:regex},function(err,allCampgrounds){
			if(err){
				console.log(err);
			} else{
				var msg1="No campgrounds found, please try again!";
				if(allCampgrounds.length<1){
					res.render("campgrounds/index",{campgrounds:allCampgrounds,"error":msg1});
				}else{
					var msg="Found Campgrounds";
					res.render("campgrounds/index",{campgrounds:allCampgrounds,"success":msg});
				}
			}
	    });
	}else{
		Campground.find({},function(err,allCampgrounds){
			if(err){
				console.log(err);
			} else{
				res.render("campgrounds/index",{campgrounds:allCampgrounds});
			}
		});
    }
});

router.post("/campgrounds",middleware.isLoggedIn, async function(req,res){
	var name=req.body.name, image=req.body.image
				desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	let response= await geocodingClient
	.forwardGeocode({
		query: req.body.location,
		limit:1
	})
	.send()
	.then()
	var cor=[0,0], place="";
	var updated=false;
	if(response.body.features.length>0){
		cor=response.body.features[0].center;
		place=response.body.features[0].place_name;
		updated=true;
	}
	var newGround={name:name, image:image, description:desc,price:req.body.price, author:author, location:req.body.location, coordinates:cor, place:place};
	Campground.create(newGround, function(err,newly){
		if(err){
			console.log(err);
		}else{
			if(updated==false){
				req.flash("error","Please update a valid location!");
			}
			res.redirect("/campgrounds"); 
		}  
	});
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments likes").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found!");
			res.redirect("/campgrounds");
		} else{ 
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//LIKE ROUTE
router.post("/campgrounds/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});
//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwner, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){		
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE ROUTE

router.put("/campgrounds/:id",middleware.checkCampgroundOwner, async function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, async function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			let response= await geocodingClient
			.forwardGeocode({
				query: req.body.location,
				limit:1
			})
			.send()
			.then()
			var cor;
			var updated=false;
			updatedCampground.location=req.body.location;
			if(response.body.features.length>0){
				updatedCampground.coordinates=response.body.features[0].center;
				updatedCampground.place=response.body.features[0].place_name;
				updatedCampground.save();
				updated=true;
			}
			if(updated==false){
				req.flash("error","Please update a valid location!");
			}
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE

router.delete("/campgrounds/:id",middleware.checkCampgroundOwner, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports=router;