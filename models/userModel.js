const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide your last name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
