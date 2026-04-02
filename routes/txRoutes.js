// routes/otherRoutes.js
const express = require("express");
const router = express.Router();
const{ getDash,updateTx}=require("../controllers/txController");
router.get("/dash",getDash);
router.post("/tx",updateTx);



module.exports = router;
