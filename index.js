
const express = require("express")

require("./utilis/db")
const cors = require("cors");
const app = express();

const port = process.env.PORT || 2001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "We are ready...!" });
});

app.use("/api/admin", require("./Router/adminRouter"))



app.listen(port , ()=>{
    console.log("im runnig on this port")
  })
  