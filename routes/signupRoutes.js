const express = require("express");
const router = express.Router();

function getAllUsers(req, res) {
    res.status(200).json({ message: "Get all users route" });
}
function signUp(req, res) {
    res.status(200).json({ message: "Signup route" });
}
function updateUser(req, res) {
    res.status(200).json({ message: "Update user route" });
}
function deleteUser(req, res) {
    res.status(200).json({ message: "Delete user route" });
}

router.route("/").get(getAllUsers).post(signUp);
router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
