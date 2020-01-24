const methodOverride = require("method-override"),
	  LocalStrategy  = require("passport-local"),
	  Campground     = require("./models/campground"),
	  bodyParser     = require("body-parser"),
	  passport       = require("passport"), 
	  flash          = require("connect-flash"),
	  mongoose       = require("mongoose"),
	  express        = require("express"),
      app            = express(),
	  Comment        = require("./models/comment"),
	  User           = require("./models/user");

// Configuring refactored routes
const commentRoutes  = require("./routes/comments"),
	  indexRoutes    = require("./routes/index"),
	  userRoutes     = require("./routes/users");

// Requiring all the routes
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp_v7", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// Configuring passport for secure connections
app.use(require("express-session")({
	secret: "Not really secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Congifuring currentUser and general errors for the app
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Refactor urls
app.use("/", indexRoutes);
app.use("/:id", userRoutes);
app.use("/:id", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server has started!")
});
	  