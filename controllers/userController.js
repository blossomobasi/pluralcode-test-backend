const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({ status: "success", result: users.length, users });
});

const getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new AppError("User with the given ID was not found!", 404));

    res.status(200).json({ status: "success", user });
});

const createUser = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    res.status(200).json({ status: "success", user });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const updatedUser = await User.findOneAndUpdate(
        req.params.id,
        {
            firstName,
            lastName,
            email,
            password,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedUser) return next(new AppError("User with the given ID was not found!", 404));

    res.status(200).json({ status: "success", updatedUser });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError("User with the given ID was not found!", 404));

    res.status(204).json({ status: "success", message: "User deleted successfully" });
});

// Export all at once
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
