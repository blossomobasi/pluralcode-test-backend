const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

router.route("/").post(stripeController.stripePayment);

module.exports = router;
