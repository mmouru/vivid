const express = require("express");
const router = express.Router();
const Picture = require("../models/picture");
const middleware = require("../middleware");

// NEW PICTURE ROUTE

router.get("/:id/new", (req, res) => {
	res.render("pictures/new" , {username: req.params.id});
});

router.post("/:id", middleware.isLoggedIn, (req, res) => {
	// get data from form and user for the picture
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newPicture = {image: image, description: description, author:author};
	//create new picture and save to db
	Picture.create(newPicture, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			res.redirect("/");
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