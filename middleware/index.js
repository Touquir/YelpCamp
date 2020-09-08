var Campground=require("../models/campground");
var Comment=require("../models/comment");

var middleWare={};

middleWare.checkCampgroundOwner= function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error","Campground not found!");
				res.redirect("/campgrounds");
			} else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("You don't have access!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}
}

middleWare.checkCommentOwner=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error","Comment not found!");
				res.redirect("back");
			} else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}
}

middleWare.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in!");
	res.redirect("/login");
}
module.exports= middleWare;