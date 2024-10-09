const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); // Load environment variables from .env file

const caCertPath = path.resolve(__dirname, process.env.CA_CERT_PATH);
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(caCertPath).toString(),
    },
});

module.exports = pool;
