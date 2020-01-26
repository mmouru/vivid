const express    = require("express");
const router     = express.Router({mergeParams: true});
const User       = require("../models/user");
const Comment    = require("../models/comment");
const Picture    = require("../models/picture");
const middleware = require("../middleware");


//show users new comment page by first searching if the user and picture exist
router.get("/:user/:id/newcomment", middleware.isLoggedIn, (req, res) => {
	User.findOne({username: req.params.user}, (err, foundUser) => {
		if(err || !foundUser){
			req.flash("error", "User does not exist!");
			req.redirect("/");
		} else {
			Picture.findById(req.params.id).exec(function(err, foundPicture){
				if(err || !foundPicture){
					req.flash("error", "Picture does not exist!");
					req.redirect("/");
				} else {
					res.render("comments/new", {picture: foundPicture, user: foundUser});
				}
			})
		}
	})
});

// add comment to the existing picture and save to database
router.post("/:user/:id", middleware.isLoggedIn, (req, res) => {
	Picture.findById(req.params.id, (err, foundPicture) => {
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("/");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					// add info for the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment to db
					comment.save();
					foundPicture.comments.push(comment);
					foundPicture.save();
					req.flash("success", "Succesfully added comment!");
					res.redirect("/" + foundPicture.author.username + "/" + foundPicture._id);
				}
			})
		}
	});
});

// show user comment edit page to edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			res.render("comments/edit", {comment:foundComment});
		}
	});
});

// edit comment logic
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Comment has been edited");
			res.redirect("/");
		}
	});
});

// delete comment logic including commentownership check
router.delete("/:user/:id/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Succesfully removed comment!");
			res.redirect("/" + req.params.user + "/" + req.params.id);
		}
	})
});

module.exports = router;