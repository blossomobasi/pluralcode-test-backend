const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const signupRouter = require("./routes/signupRoutes");
const loginRouter = require("./routes/loginRoutes");
const stripeRouter = require("./routes/stripeRoutes");

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_BASE_URL,
    optionsSuccessStatus: 200,
};

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/checkout", stripeRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;
