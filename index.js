const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const loginRouter = require("./routes/loginRoutes");
const stripeRouter = require("./routes/stripeRoutes");

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL,
    optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/signup", userRouter);
app.use("/api/login", loginRouter);
app.use("/checkout", stripeRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        name: "PLURALCODE-TEST APPLICATION",
    });
});

app.use("*", (req, res) => {
    res.status(404).json({ status: "failed", message: "Route not found" });
});

module.exports = app;
