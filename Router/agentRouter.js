const express = require("express");
const router = express.Router();
const uplaod = require("../utilis/multer")
const {createAgent, LogInAgent, get} = require("../Controller/agentController")

router.route("/regagent").post(uplaod, createAgent)
router.route("/login").post(LogInAgent)



module.exports = router;