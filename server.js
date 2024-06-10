const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXECEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);

    process.exit(1);
});

const app = require("./index");
const DB = process.env.DATABASE_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log("Database connection successful...");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
