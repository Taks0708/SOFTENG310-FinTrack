/**
 * Assignment 1 Backend API
 * 
 * This API handles user management, transactions, and provides various 
 * endpoints for interacting with the application.
 *
 * Dependencies:
 * - Express: Web framework for Node.js
 * - Bcrypt: Library for hashing passwords
 * - CORS: Middleware to enable Cross-Origin Resource Sharing
 * - Dotenv: Module to load environment variables from a .env file
 * - Express-Session: Middleware to manage user sessions
 * - FS: File system module for interacting with the file system
 * - JSONWebToken: For token-based authentication
 * - Nodemon: Tool to automatically restart the server when code changes
 * - PG: Node.js client for PostgreSQL databases
 * 
 * Author: NEVE572
 * Date: 2024
 */

//dependancies
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
//config
const pool = require("./config/db.js");
const createTables = require("./config/createTables.js");
const corsConfig = require("./config/corsConfig");
//middleware
const isAuthenticated = require("./middleware/authMiddleware.js");
//routes 
const userRoutes = require("./routes/users.js");
const transactionRoutes = require("./routes/transactions")
const luckyAdviserRoutes = require('./routes/luckyAdviser'); // Adjust the path if necessary


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsConfig);

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to database');
        try {
            createTables();
            console.log("created tables succesfully")
        } catch (error) {
            console.log("error creating tables")
        }
        

    }
});

app.use('/user',  userRoutes);
app.use('/transaction' , transactionRoutes);
app.use('/api', luckyAdviserRoutes); 

const port = 4000

app.listen(port, () => {

    console.log(`Server is running on port ${port}`)

})