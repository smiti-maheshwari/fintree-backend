const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require("./config/database")

// Handling Uncaught Exception
process.on("UncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Rejection`);
    process.exit(1);
})

// Config
dotenv.config({path:"./config/config.env"});

// Connecting to database
connectDatabase()

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on ${process.env.PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit();
    })
})