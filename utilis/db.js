const mongoose = require("mongoose");
const url =
	"mongodb+srv://testauth:ilovemusic1234@cluster0.kubrg.mongodb.net/careTag?retryWrites=true&w=majority";

const urls = "mongodb://localhost/careTag";

mongoose.connect(urls).then(() => {
	console.log("database connected...");
});

module.exports = mongoose;
