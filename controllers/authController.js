const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN, // 30days
    });
};

const createSendToken = (user, res, statusCode) => {
    const token = signToken(user._id);

    res.cookie("jwt", token, {
        expiresIn: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000), // 30days in milliseconds
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: true,
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

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting the token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access.", 401)); // Unauthorized
    }

    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }

    // Our Application do not really need this check but for complex applications, you can check if the user changed password after the token was issued

    // 3) Check if user still exists
    // 4) Check if user changed password after the token was issued
    // ...

    req.user = user;

    // GRANT ACCESS TO PROTECTED ROUTE
    next();
});
