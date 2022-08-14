
const express = require("express")
const mongoose = require("./utilis/db")

const cors = require("cors");
const http = require("http")
const app = express();
const server = http.createServer(app)

const {Server} = require("socket.io");
const { constants } = require("buffer");

const port = process.env.PORT || 2001;

const io = new Server(server, {
  cors : {origin: "*"}
})

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "We are ready...!" });
});

app.use("/api/admin", require("./Router/adminRouter"))
app.use("/api/agent", require("./Router/agentRouter"))

const db = mongoose.connection



db.on("open", () =>
{
  const oberver = db.collection("agents").watch()

  oberver.on("change", (change) =>
  {
    if (change.operationType === "delete")
    {
      console.log(change)

      const deleteData = {
        _id: change.documentKey._id,
      }
      io.emit("delete", deleteData)
    }
  })
})





io.on("connection", (socket) =>
{
  console.log("user has been connected")
})




server.listen(port , ()=>{
    console.log("im runnig on this port")
  })
  