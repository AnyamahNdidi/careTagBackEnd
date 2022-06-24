const mongoose = require("mongoose");
const url =
	"mongodb+srv://testauth:ilovemusic1234@cluster0.kubrg.mongodb.net/careTag?retryWrites=true&w=majority";

const urls = "mongodb://localhost/careTag";

mongoose.connect(url).then(() => {
	console.log("database connected...");
}).catch((error) =>
{
	console.log("error in connetion", error)
})

module.exports = mongoose;
