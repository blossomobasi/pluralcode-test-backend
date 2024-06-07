const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
dotenv.config({ path: "./config.env" });

const signupRouter = require("./routes/signupRoutes");
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
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/checkout", stripeRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// app.route("/api/signup").get(getAllUsers).post(signUp);
// app.route("/api/signup/:id").put(updateUser).delete(deleteUser);
// app.route("/checkout").post(stripePayment);
// app.route("/api/login").post(login);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
