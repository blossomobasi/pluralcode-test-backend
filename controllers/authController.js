const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, res, statusCode) => {
    const token = signToken(user._id);

    res.cookie("jwt", token, {
        expiresIn: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000), // 30days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
    });

    // Remove the password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    createSendToken(newUser, res, 201);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if there is an email and password
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }

    // 2) Get the user
    const user = await User.findOne({ email }).select("+password");

    // 3) Check if the user exists and if the password is correct
    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError("Incorrect email or password", 401));

    // 4) Create a token for the user
    createSendToken(user, res, 200);
});
