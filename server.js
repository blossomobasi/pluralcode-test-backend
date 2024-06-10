const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./index");

const DB = process.env.DATABASE_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log("Database connection successful...");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
