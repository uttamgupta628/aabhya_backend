const express = require("express");
const router = express.Router();
const { getPaymentConfig } = require("../controllers/configController");

router.get("/payment", getPaymentConfig);

module.exports = router;