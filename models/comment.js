const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mognoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: string
	},
	likes: Number
});

module.exports = mongoose.model("Comment", commentSchema)