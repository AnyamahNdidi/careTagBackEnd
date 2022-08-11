const express = require("express");
const router = express.Router();
const uplaod = require("../utilis/multer")
const {createAgent, LogInAgent, getSingleAgent, deleteAgent} = require("../Controller/agentController")

router.route("/regagent").post(uplaod, createAgent)
router.route("/login").post(LogInAgent)
router.route("/:id").get(getSingleAgent)
router.route("/:id/:agents").delete(deleteAgent)



module.exports = router;