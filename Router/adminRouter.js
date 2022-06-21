const express = require("express");
const router = express.Router();
const uplaod = require("../utilis/multer")
const {Register,verifiedOrganization,SignIn} = require("../Controller/adminController")

router.route("/").post(uplaod, Register)
router.route("/:id/:token").get(verifiedOrganization);
router.route("/signin").post(SignIn)

module.exports = router;