// routes/otherRoutes.js
const express = require("express");
const router = express.Router();
const{ sendMail,decryptURI, sendImageMail}=require("../controllers/mailController");
router.post("/send",sendMail);
router.post("/image",sendImageMail);
router.post("/uri",decryptURI);


module.exports = router;
