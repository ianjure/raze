const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const staticRouter = require("./routes/static.route")
const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");

// Initialize the application
const app = express();

// Initialize the middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Initialize the routes
app.use("/", staticRouter);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

// Connect to the database and start the server
connectDB((client) => {
    if (client) {
        app.listen(3000, () => {
            console.log(`Server: http://localhost:${process.env.PORT || 3000}`);
        })
    } else {
        console.log("Error connecting to database!");
        process.exit(1);
    }
});