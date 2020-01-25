const express    = require("express");
const router     = express.Router();
const User       = require("../models/user");
const Picture    = require("../models/picture");
const middleware = require("../middleware");

// show user page
router.get("/:id", (req, res) => {
	User.findOne({ username: req.params.id}, (err, foundUser) => {
		if(err || !foundUser){
			req.flash("error", "Cannot find that user");
			res.redirect("/");
		} else {
			Picture.find({ "author.username" : foundUser.username}, (err, foundPictures) => {
				
				if(err){
					console.log(err);
					res.redirect("/");
				} else {
					res.render("users/show", {pictures: foundPictures, user: foundUser.username, id: foundUser._id});
				}
			})
		}
	});
});

module.exports = router;