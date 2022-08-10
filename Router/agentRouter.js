const express = require("express");
const router = express.Router();
const uplaod = require("../utilis/multer")
const {createAgent, LogInAgent, getSingleAgent} = require("../Controller/agentController")

router.route("/regagent").post(uplaod, createAgent)
router.route("/login").post(LogInAgent)
router.route("/:id").get(getSingleAgent)



module.exports = router;