const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "ndtech",
    api_key:"325692748593977",
    api_secret:"umNXDmlZgBcvD-DrYhwoehT0HDM",
	secure: true,
});

module.exports = cloudinary;
