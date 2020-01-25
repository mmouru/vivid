const express    = require("express");
const router     = express.Router({mergeParams: true});
const User = require("../models/user");
const Comment    = require("../models/comment");
const middleware = require("../middleware");

module.exports = router;