const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ status: "success", result: users.length, users });
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};

const createUser = async (req, res) => {
    if (!req.body) return res.status(400).json({ message: "Please provide user details" });

    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Please provide new user details" });
        const { firstName, lastName, email, password } = req.body;

        const updatedUser = await User.findOneAndUpdate(req.params.id, {
            firstName,
            lastName,
            email,
            password,
        });

        res.status(200).json({ status: "success", updatedUser });
    } catch (err) {
        res.status(500).json({ status: "failed", message: err.message });
    }
};
const deleteUser = (req, res) => {
    res.status(200).json({ message: "Delete user route" });
};

// Export all at once
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
