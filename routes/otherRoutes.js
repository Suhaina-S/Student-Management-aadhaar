// routes/otherRoutes.js
const express = require("express");
const router = express.Router();
const { checkID, checkAddr } = require("../controllers/otherController");
router.post("/aadhaar/address", checkAddr);  
router.post("/aadhaar", checkID);  
console.log("typeof checkID", typeof checkID); 

module.exports = router;
