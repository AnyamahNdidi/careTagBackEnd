const mongoose = require("mongoose");
const geocoder = require("../../utilis/geocoder")

const adminModel = mongoose.Schema(
	{
		agentName: {
			type: String,
		},
		dlocation: {
    type: String,
   
  },
	 location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
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

adminModel.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.dlocation);
	console.log(loc)
	  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address

  next();
});

module.exports = mongoose.model("agents", adminModel);
