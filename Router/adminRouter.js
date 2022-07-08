const express = require("express");
const router = express.Router();
const uplaod = require("../utilis/multer")
const {Register,verifiedOrganization,SignIn, getAgent,getRecentOne} = require("../Controller/adminController")

router.route("/").post(uplaod, Register)
router.route("/:id/:token").get(verifiedOrganization);
router.route("/signin").post(SignIn)
router.route("/:id/agent/all").get(getAgent)
router.route("/:id/agent/one/agent").get(getRecentOne)

module.exports = router;