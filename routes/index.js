const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user"),
	  Picture = require("../models/picture");

router.get("/", (req, res) => {
	// get all picture from all authors from the database
	Picture.find({}, (err, allPictures) => {
		if(err){
			res.send("Something went horribly wrong");
		} else {
			res.render("landingpage", {pictures: allPictures});
		}
	});
});

// show register form
router.get("/register", (req, res) => {
	res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			req.flash("error", err.message);
			res.redirect("register");
		} else {
			passport.authenticate("local")(req, res, () => {
				req.flash("success", "Hello " + user.username + ", Welcome to use Vivid!");
				res.redirect("back")
			});
		}
	});
});

// show login form
router.get("/login", (req, res) => {
	res.render("login");
});

// hande login logic
router.post("/login",passport.authenticate("local", 
	{	
		successRedirect: "/",
		successFlash: "Welcome back!",
		failureRedirect: "/login",
		failureFlash: true
	}), (req, res) => {
});

// handle logouts
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Succesfully logged out!");
	res.redirect("/");
});

	
module.exports = router;