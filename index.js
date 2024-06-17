const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const stripeRouter = require("./routes/stripeRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const corsOptions = {
    origin:
        process.env.NODE_ENV === "production"
            ? [process.env.FRONTEND_BASE_URL, "http://localhost:3000"]
            : "*",
    optionsSuccessStatus: 200,
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitizer());

// Data sanitization against XSS
app.use(xss());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/checkout", stripeRouter);

// Default route
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
