const express = require("express");
const router = express.Router();
const Picture = require("../models/picture");
const User = require("../models/user");
const middleware = require("../middleware");

// NEW PICTURE ROUTE

router.get("/:id/new", (req, res) => {
	res.render("pictures/new" , {username: req.params.id});
});

router.post("/:id", middleware.isLoggedIn, (req, res) => {
	// get data from form and user for the picture
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newPicture = {name: name, image: image, description: description, author:author};
	//create new picture and save to db
	Picture.create(newPicture, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

// show picture route
// find one user from db and show picture with correct id
router.get("/:user/:id", (req, res) => {
	var user = req.params.user;
	var pictureId = req.params.id;
	User.findOne({ username: user}, (err, foundUser) => {
		if(err || !foundUser){
			req.flash("error", "User does not exist");
			res.redirect("/");
		} else {
			Picture.findById(pictureId).populate("comments").exec(function(err, foundPicture){
				if(err || !foundPicture){
					req.flash("error", "Picture does not exist");
					res.redirect("/");
				} else {
					res.render("pictures/show", {picture:foundPicture, user: foundUser});
				}
			})
		}
	});
});	
	

// Delete picture logic
router.delete("/:id", middleware.checkPictureOwnership, (req, res) => {
	Picture.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("back");
		}
	});
});
module.exports = router;