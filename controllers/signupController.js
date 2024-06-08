exports.getAllUsers = (req, res) => {
    res.status(200).json({ message: "Get all users route" });
};
exports.signUp = (req, res) => {
    res.status(200).json({ message: "Signup route" });
};
exports.updateUser = (req, res) => {
    res.status(200).json({ message: "Update user route" });
};
exports.deleteUser = (req, res) => {
    res.status(200).json({ message: "Delete user route" });
};
