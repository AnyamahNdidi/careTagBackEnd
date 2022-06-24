const mongoose = require("mongoose");

const adminModel = mongoose.Schema(
	{
		agentName: {
			type: String,
		},
		location: {
			type: String,
        },
        organizationCode: {
			type: String,
        },
        organizationName: {
			type: String,
        },
        agentCode: {
            type:String,
        },
		address: {
			type: String,
		},
		email: {
			type: String,
		},
		phoneNumber: {
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
        verifiedToken: {
			type: String,
		},
        verified: {
			type: Boolean,
			default: true,
		},
		avatarID: {
			type: String,
		},	
		status: {
			type: String,
			default: "agent",
		},
	  organizaton: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "admins",
		},
	},

	{ timestamps: true }
);

module.exports = mongoose.model("agents", adminModel);
