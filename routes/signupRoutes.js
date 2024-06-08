const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signupController");

router.route("/").get(signupController.getAllUsers).post(signupController.signUp);
router.route("/:id").put(signupController.updateUser).delete(signupController.deleteUser);

module.exports = router;
