// all the middleware goes here
const middlewareObj = {};
const Picture = require("../models/picture");
const Comment = require("../models/comment");

middlewareObj.checkPictureOwnership = function(req, res, next) {
		if(req.isAuthenticated()){
			Picture.findById(req.params.id, (err, Picture) =>{
				if(err || !Picture){
					req.flash("error", "Picture not found");
					res.redirect("back");
				} else {
					// does user own the campground
					if(Picture.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You dont have permission to do that");
						res.redirect("back");	
					}
				}
			});
		} else {
			req.flash("error", "You have to be logged in to do that");
			res.redirect("back");	
		}
	};

middlewareObj.checkCommentOwnership = function(req, res, next) {
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, (err, foundComment) =>{
				if(err || !foundComment){
					req.flash("err", "Comment not found!");
					res.redirect("back");
				} else {
					// does user own the comment
					if(foundComment.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You dont have permission to do that");
						res.redirect("back");	
					}
				}
			});
		} else {
			req.flash("error", "You have to be logged in to do that");
			res.redirect("back");	
		}
	};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First");
	res.redirect("/login");
};

module.exports = middlewareObj;