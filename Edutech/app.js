const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connect = require('./config/db');  // Database connection
const router = require('./routes/route');  // Routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware Setup
app.use(helmet()); // Security
app.use(cors({
    origin: "*", //
    methods: ["POST", "PUT", "DELETE", "OPTIONS", "PATCH", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());  //  Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse form-urlencoded data


connect();

app.use('/edutech', router);

app.get("/health", (req, res) => {
    res.send("OK");
});


app.listen(port, () => {
    console.log(` Server running on http://localhost:${port}`);
});
