const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	likes: Number
});

module.exports = mongoose.model("Comment", commentSchema);