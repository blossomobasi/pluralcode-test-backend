const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const loginRouter = require("./routes/loginRoutes");
const stripeRouter = require("./routes/stripeRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

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

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
