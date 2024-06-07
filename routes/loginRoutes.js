const express = require("express");
const router = express.Router();

function login(req, res) {
    res.status(200).json({ message: "Login route" });
}

router.route("/").post(login);

module.exports = router;
