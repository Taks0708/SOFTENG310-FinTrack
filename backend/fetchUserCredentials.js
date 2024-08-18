const { Client } = require('pg');
const fs = require('fs');

require('dotenv').config();

async function fetchUserCredentials() {
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: {
      ca: fs.readFileSync(process.env.CA_CERT_PATH).toString(),
    },
  });

  await client.connect();

  const res = await client.query('SELECT email, password FROM users LIMIT 1');
  console.log('User credentials:', res.rows);

  await client.end();
}

fetchUserCredentials();