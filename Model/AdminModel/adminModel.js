const mongoose = require("mongoose");

const adminModel = mongoose.Schema(
	{
		fullName: {
			type: String,
		},
		organizationName: {
			type: String,
		},
		organizationCode: {
			type: String,
		},
		location: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		phoneNumber: {
			type: Number,
		},
		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},
		verifiedToken: {
			type: String,
		},
		verified: {
			type: Boolean,
		},
		status: {
			type: String,
			default: "admin",
		},

		agent: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "agents",
			},
		],
	},

	{ timestamps: true }
);

module.exports = mongoose.model("admins", adminModel);
